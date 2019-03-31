//V3
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
  readonly id: string;
  readonly name: string;
  readonly owner: {
    readonly login: string;
  };
  readonly description: string;
  readonly updatedAt: string;
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
  readonly defaultBranchRef: {
    readonly target: {
      readonly history: {
        readonly totalCount: number;
      }
    }
  }
}

//V4
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