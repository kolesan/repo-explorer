export interface GithubRepoSearchResponse {
  readonly search: {
    readonly pageInfo: {
      endCursor: string;
    };
    readonly repositoryCount: number;
    readonly nodes: GitHubRepo[];
  };
}

export interface GitHubRepo {
  readonly name: string;
  readonly owner: {
    readonly login: string;
  };
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
