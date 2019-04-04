export interface Repo {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly description: string;
  readonly license: string;
  readonly url: string;
  readonly starred: boolean;
  readonly language: string;
  readonly starCount: number;
  readonly forkCount: number;
  readonly issueCount: number;
  readonly commitCount: number;
}

export interface StarMutationResponse {
  readonly starred: boolean;
}
