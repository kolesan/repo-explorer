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
