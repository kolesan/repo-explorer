import log from "../utils/Logging";

export const REPO_STAR_STATE_CHANGED = "repo star state changed";

export interface RepoStarStateAction {
  readonly type: string;
  readonly payload: RepoStarStateActionPayload;
}
export interface RepoStarStateActionPayload {
  readonly owner: string;
  readonly name: string;
  readonly starred: boolean;
  readonly starCount: number;
}

export default function repoStarStateChanged(payload: RepoStarStateActionPayload): RepoStarStateAction {
  return {
    type: REPO_STAR_STATE_CHANGED,
    payload
  }
}