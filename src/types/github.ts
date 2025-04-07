
export interface GithubImage {
  name: string;
  path: string;
  download_url: string;
  html_url: string;
  sha: string;
  size: number;
  type: string;
}

export interface GithubRepoInfo {
  owner: string;
  repo: string;
  path: string;
  token: string;
}
