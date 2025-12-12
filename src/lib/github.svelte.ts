declare const __BUILD_DATA__: {
  github: {
    user: GitHubUser | null;
    repos: GitHubRepo[];
    pinned_repos: GitHubRepo[];
  };
};

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  created_at: string;
  public_repos: number;
  followers: number;
}

export interface GitHubReposState {
  username: string;
  user: GitHubUser | null;
  repos: GitHubRepo[];
  pinned_repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

const buildData = __BUILD_DATA__.github;

export const githubState = $state<GitHubReposState>({
  username: buildData.user?.login ?? "",
  user: buildData.user,
  repos: buildData.repos,
  pinned_repos: buildData.pinned_repos,
  loading: false,
  error: null,
});
