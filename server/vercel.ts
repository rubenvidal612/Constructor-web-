export interface VercelFilePayload {
  path: string;
  content: string;
}

export async function verifyVercelToken(token: string) {
  const res = await fetch('https://api.vercel.com/v2/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Vercel authentication failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return {
    id: data.user.id,
    username: data.user.username,
    email: data.user.email,
    name: data.user.name,
    avatar: data.user.avatar,
  };
}

export async function listVercelProjects(token: string) {
  const res = await fetch('https://api.vercel.com/v9/projects?limit=20', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to list Vercel projects: ${res.status}`);
  }

  const data = await res.json();
  return data.projects.map((p: any) => ({
    id: p.id,
    name: p.name,
    framework: p.framework,
    latestDeployments: p.latestDeployments,
  }));
}

/**
 * Creates an instant deployment using Vercel's direct file upload API (v13).
 * This compiles and serves files immediately without needing pre-existing repo webhooks.
 */
export async function createVercelDeployment(
  token: string,
  projectName: string,
  files: VercelFilePayload[],
  target: 'production' | 'preview' = 'production'
) {
  const sanitizedName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .slice(0, 50);

  // Format files for Vercel Deployments API
  const vercelFiles = files.map((f) => ({
    file: f.path,
    data: f.content,
    encoding: 'utf-8',
  }));

  const res = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: sanitizedName,
      files: vercelFiles,
      target,
      projectSettings: {
        framework: null,
      },
    }),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error?.message || `Vercel deployment failed with status ${res.status}`);
  }

  const data = await res.json();
  return {
    id: data.id,
    url: data.url ? `https://${data.url}` : '',
    readyState: data.readyState || 'BUILDING',
    inspectorUrl: data.inspectorUrl,
    createdAt: data.createdAt,
    name: data.name,
  };
}

/**
 * Polls the current deployment status from Vercel
 */
export async function getVercelDeploymentStatus(token: string, deploymentId: string) {
  const res = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Could not fetch deployment status: ${res.status}`);
  }

  const data = await res.json();
  return {
    id: data.id,
    url: data.url ? `https://${data.url}` : '',
    readyState: data.readyState,
    inspectorUrl: data.inspectorUrl,
    createdAt: data.createdAt,
    errorMessage: data.error?.message,
  };
}
