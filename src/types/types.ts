export interface GitHubRepo {
  readonly nameWithOwner: string;
  readonly description: string;
  readonly licenseInfo: {
    readonly name: string;
  };
  readonly url: string;
  readonly viewerHasStarred: boolean;
  readonly primaryLanguage: {
    readonly name: string;
  };
  readonly stargazers: {
    readonly totalCount: number;
  }
  readonly forkCount: number;
  readonly issues: {
    readonly totalCount: number;
  }
}

export interface GithubRepoSearchResponse {
  readonly search: {
    readonly pageInfo: {
      endCursor: string;
    };
    readonly repositoryCount: number;
    readonly nodes: GitHubRepo[];
  };
}

export interface RepoSearchParams {
  readonly searchQuery: string;
  readonly startCursor?: string;
  readonly count: number;
}

export interface RepoSearchResult {
  readonly total: number;
  readonly repos: Repo[];
  readonly nextPageCursor: string;
}

export interface Repo {
  readonly name: string;
  readonly description: string;
  readonly license: string;
  readonly url: string;
  readonly starred: boolean;
  readonly language: string;
  readonly starCount: number;
  readonly forkCount: number;
  readonly issueCount: number;
}
