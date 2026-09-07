import { Octokit } from '@octokit/rest';

export interface CommitFilePayload {
  path: string;
  content: string;
}

/**
 * Creates an authenticated Octokit client instance with the user's token.
 */
export function getOctokit(token: string): Octokit {
  return new Octokit({ auth: token });
}

/**
 * Verifies token validity and returns the authenticated GitHub user profile.
 */
export async function verifyGitHubToken(token: string) {
  const octokit = getOctokit(token);
  const { data } = await octokit.rest.users.getAuthenticated();
  return {
    login: data.login,
    id: data.id,
    name: data.name,
    avatar_url: data.avatar_url,
    html_url: data.html_url,
    public_repos: data.public_repos,
    total_private_repos: data.total_private_repos || 0,
  };
}

/**
 * Lists repositories accessible by the user (both public and private).
 */
export async function listUserRepositories(token: string, perPage = 30) {
  const octokit = getOctokit(token);
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: 'updated',
    direction: 'desc',
    per_page: perPage,
    affiliation: 'owner,collaborator',
  });

  return data.map((repo) => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    private: repo.private,
    html_url: repo.html_url,
    description: repo.description,
    default_branch: repo.default_branch,
    updated_at: repo.updated_at,
  }));
}

/**
 * Fetches the entire file tree of a repository branch and returns
 * the text files content into editor memory.
 */
export async function getRepositoryTreeAndFiles(
  token: string,
  owner: string,
  repo: string,
  branch = 'main'
) {
  const octokit = getOctokit(token);

  // 1. Get branch commit reference
  let branchRef = branch;
  try {
    const { data: repoInfo } = await octokit.rest.repos.get({ owner, repo });
    branchRef = branch || repoInfo.default_branch || 'main';
  } catch {
    branchRef = branch;
  }

  const { data: refData } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${branchRef}`,
  });
  const latestCommitSha = refData.object.sha;

  // 2. Fetch git tree recursively
  const { data: treeData } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: latestCommitSha,
    recursive: 'true',
  });

  // 3. Filter text and source code files (exclude heavy binaries, node_modules, .git)
  const ignoredPrefixes = ['node_modules/', '.git/', '.next/', 'dist/', 'build/'];
  const textExtensions = ['.js', '.ts', '.tsx', '.jsx', '.html', '.css', '.json', '.md', '.sql', '.txt', '.env.example', '.gitignore', '.yaml', '.yml'];

  const candidateFiles = treeData.tree.filter((node) => {
    if (node.type !== 'blob' || !node.path) return false;
    if (ignoredPrefixes.some((p) => node.path?.startsWith(p))) return false;
    const isTextExt = textExtensions.some((ext) => node.path?.endsWith(ext)) || !node.path.includes('.');
    return isTextExt;
  });

  // 4. Download content for the first 30 files to avoid rate limiting
  const filesToFetch = candidateFiles.slice(0, 30);
  const files: { path: string; content: string; language: string }[] = [];

  for (const item of filesToFetch) {
    if (!item.path || !item.sha) continue;
    try {
      const { data: blob } = await octokit.rest.git.getBlob({
        owner,
        repo,
        file_sha: item.sha,
      });

      const content = Buffer.from(blob.content, 'base64').toString('utf8');
      const ext = item.path.split('.').pop() || '';
      const languageMap: Record<string, string> = {
        ts: 'typescript',
        tsx: 'typescript',
        js: 'javascript',
        jsx: 'javascript',
        html: 'html',
        css: 'css',
        json: 'json',
        md: 'markdown',
        sql: 'sql',
      };

      files.push({
        path: item.path,
        content,
        language: languageMap[ext] || 'text',
      });
    } catch (err) {
      console.warn(`Could not fetch file ${item.path}:`, err);
    }
  }

  return {
    branch: branchRef,
    sha: latestCommitSha,
    files,
  };
}

/**
 * Creates a brand new repository under the authenticated user's account.
 */
export async function createRepository(
  token: string,
  repoName: string,
  description?: string,
  isPrivate = false
) {
  const octokit = getOctokit(token);
  const { data } = await octokit.rest.repos.createForAuthenticatedUser({
    name: repoName,
    description: description || 'Generated with Web AI Studio',
    private: isPrivate,
    auto_init: true, // creates initial main branch with README
  });

  return {
    id: data.id,
    name: data.name,
    full_name: data.full_name,
    html_url: data.html_url,
    default_branch: data.default_branch,
    owner: data.owner.login,
  };
}

/**
 * Commits multiple files directly to the main branch using GitHub's Git Data API:
 * 1. Resolves HEAD ref
 * 2. Uploads Git blobs for each changed file
 * 3. Builds a new Git Tree referencing the parent tree
 * 4. Creates a Git commit pointing to the parent commit
 * 5. Updates the branch ref to point to the new commit
 */
export async function commitFilesToBranch(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  files: CommitFilePayload[],
  commitMessage: string
) {
  const octokit = getOctokit(token);

  // 1. Get current branch reference
  let baseTreeSha: string | undefined;
  let parentCommitSha: string | undefined;

  try {
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    parentCommitSha = refData.object.sha;

    const { data: parentCommit } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: parentCommitSha,
    });
    baseTreeSha = parentCommit.tree.sha;
  } catch (err: any) {
    // If branch doesn't exist yet, check default branch
    const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
    const defaultBranch = repoData.default_branch || 'main';
    const { data: defaultRef } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${defaultBranch}`,
    });
    parentCommitSha = defaultRef.object.sha;
    const { data: parentCommit } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: parentCommitSha,
    });
    baseTreeSha = parentCommit.tree.sha;
  }

  // 2. Create blobs for each file
  const treeNodes: { path: string; mode: '100644'; type: 'blob'; sha: string }[] = [];

  for (const file of files) {
    const { data: blobData } = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(file.content).toString('base64'),
      encoding: 'base64',
    });

    treeNodes.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      sha: blobData.sha,
    });
  }

  // 3. Create the new Git Tree
  const { data: newTree } = await octokit.rest.git.createTree({
    owner,
    repo,
    base_tree: baseTreeSha,
    tree: treeNodes,
  });

  // 4. Create the new Commit
  const { data: newCommit } = await octokit.rest.git.createCommit({
    owner,
    repo,
    message: commitMessage || 'feat(ai): update application code via Web AI Studio',
    tree: newTree.sha,
    parents: parentCommitSha ? [parentCommitSha] : [],
  });

  // 5. Update the branch HEAD
  await octokit.rest.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: newCommit.sha,
    force: true,
  });

  return {
    commitSha: newCommit.sha,
    commitUrl: newCommit.html_url,
    message: newCommit.message,
    branch,
    timestamp: new Date().toISOString(),
  };
}
