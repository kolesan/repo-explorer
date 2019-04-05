export interface GithubRepoSearchResponse {
  readonly search: {
    readonly pageInfo: {
      hasNextPage: boolean,
      endCursor: string;
    };
    readonly repositoryCount: number;
    readonly nodes: GitHubRepo[];
  };
}

export interface GitHubRepoSearchResultsItem {
  readonly name: string;
  readonly owner: {
    readonly login: string;
  };
  readonly description: string;
  readonly licenseInfo: {
    readonly key: string;
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



export interface GitHubGetRepoResponse {
  readonly repository: GitHubRepo;
}

export interface GitHubRepo {
  readonly id: string;
  readonly name: string;
  readonly owner: {
    readonly login: string;
  };
  readonly description: string;
  readonly licenseInfo: {
    readonly key: string;
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
  readonly defaultBranchRef: {
    readonly target: {
      readonly history: {
        readonly totalCount: number;
      }
    }
  }
}



export interface GitHubGetRepoStarsResponse {
  readonly repository: {
    readonly stargazers: {
      readonly totalCount: number;
    }
  };
}



export interface GitHubStarrable {
  readonly starrable: {
    readonly viewerHasStarred: boolean;
  }
}
export interface GithubAddStarResponse {
  readonly addStar: GitHubStarrable;
}
export interface GithubRemoveStarResponse {
  readonly removeStar: GitHubStarrable;
}
export interface GitHubStarMutationInput {
  readonly input: {
    readonly starrableId: string;
  }
}
