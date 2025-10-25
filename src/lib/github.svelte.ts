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

// Create placeholder repos for initial loading state
const createPlaceholderRepo = (id: number): GitHubRepo => ({
  id,
  name: "",
  full_name: "",
  description: null,
  html_url: "",
  stargazers_count: 0,
  language: null,
  topics: [],
  updated_at: new Date().toISOString(),
  fork: false,
});

const placeholderRepos = Array.from(
  { length: 10 },
  (_, i) => createPlaceholderRepo(i),
);
const placeholderPinnedRepos = Array.from(
  { length: 3 },
  (_, i) => createPlaceholderRepo(i + 100),
);

export const githubState = $state<GitHubReposState>({
  username: "",
  repos: placeholderRepos,
  pinned_repos: placeholderPinnedRepos,
  loading: true,
  error: null,
});

export async function fetchRepos(username: string, pinned: string[]) {
  githubState.username = username;
  try {
    // Fetch user repos
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&direction=reverse&per_page=100`,
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();

    // Clear placeholder data
    githubState.repos = [];
    githubState.pinned_repos = [];

    // Separate pinned items into simple names and org/repo format
    const simplePinned = pinned.filter((p) => !p.includes("/"));
    const orgRepoPinned = pinned.filter((p) => p.includes("/"));

    // Fetch external repos (org/repo format)
    for (const fullName of orgRepoPinned) {
      try {
        const repoResponse = await fetch(
          `https://api.github.com/repos/${fullName}`,
        );
        if (repoResponse.ok) {
          const externalRepo: GitHubRepo = await repoResponse.json();
          githubState.pinned_repos.push(externalRepo);
        }
      } catch (err) {
        console.warn(`Failed to fetch ${fullName}:`, err);
      }
    }

    // Process user repos
    for (const repo of repos) {
      if (simplePinned.includes(repo.name)) {
        githubState.pinned_repos.push(repo);
      } else if (!repo.fork && !!repo.description) {
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
