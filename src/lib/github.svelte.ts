export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
  pinned?: boolean;
}

export interface GitHubReposState {
  username: string;
  repos: GitHubRepo[];
  pinned_repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

export const githubState = $state<GitHubReposState>({
  username: "",
  repos: [],
  pinned_repos: [],
  loading: true,
  error: null,
});

export async function fetchRepos(username: string, pinned: string[]) {
  githubState.username = username;
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    let repos: GitHubRepo[] = await response.json();
    repos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    for (const repo of repos) {
      if (pinned.includes(repo.name)) {
        githubState.pinned_repos.push(repo);
      }
      if (!repo.fork && !!repo.description) {
        githubState.repos.push(repo);
      }
    }
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    githubState.error = error instanceof Error
      ? error.message
      : "Failed to load repositories";
    githubState.repos = [];
  } finally {
    githubState.loading = false;
  }
}
