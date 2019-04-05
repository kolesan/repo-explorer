import { GraphQLClient } from 'graphql-request';
import token from '../../token';
import log from '../../utils/Logging';
import { RepoSearchParams, RepoSearchResult, RepoSearchResultItem } from '../../types/RepoListTypes';
import { 
  GithubRepoSearchResponse, GitHubRepo, GithubAddStarResponse,
  GithubRemoveStarResponse, GitHubStarMutationInput, GitHubRepoSearchResultsItem, GitHubGetRepoResponse, GitHubGetRepoStarsResponse
} from '../../types/GithubApiTypes';
import repositorySearchQuery from './queries/repositories';
import getRepositoryQuery from './queries/repository';
import starMutation from './queries/star';
import getRepositoryStarsQuery from './queries/stars';
import unstarMutation from './queries/unstar';
import { Repo, StarMutationResponse } from '../../types/RepoTypes';
const _get = require('lodash/get');

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    authorization: `token ${token}`
  }
})



export async function repoSearch({ searchQuery, startCursor, count }: RepoSearchParams): Promise<RepoSearchResult> {
  const response: GithubRepoSearchResponse = await client.request(repositorySearchQuery, { searchQuery, startCursor, count });
  const { search } = response;
  return {
    total: search.repositoryCount,
    repos: search.nodes.map(toRepoSearchResultItem),
    nextPageCursor: search.pageInfo.hasNextPage ? search.pageInfo.endCursor : undefined
  }
}

function toRepoSearchResultItem(gitHubRepo: GitHubRepoSearchResultsItem): RepoSearchResultItem {
  const { name, owner, description, licenseInfo, url,
    viewerHasStarred, primaryLanguage, stargazers, forkCount, issues
  } = gitHubRepo;

  return {
    name: name,
    owner: _get(owner, 'login', null),
    description,
    license: _get(licenseInfo, 'key', null),
    url,
    starred: viewerHasStarred,
    language: _get(primaryLanguage, 'name', null),
    starCount: _get(stargazers, 'totalCount', null),
    forkCount,
    issueCount: _get(issues, 'totalCount', null),
  }
}



export async function getRepository(owner: string, name: string): Promise<Repo> {
  const response: GitHubGetRepoResponse = await client.request(getRepositoryQuery, { owner, name });
  const { repository } = response;
  return toRepo(repository)
}

function toRepo(gitHubRepo: GitHubRepo): Repo {
  const { id, name, owner, description, licenseInfo, url,
    viewerHasStarred, primaryLanguage, stargazers, forkCount, issues, defaultBranchRef
  } = gitHubRepo;

  return {
    id,
    name: name,
    owner: _get(owner, 'login', null),
    description,
    license: _get(licenseInfo, 'key', null),
    url,
    starred: viewerHasStarred,
    language: _get(primaryLanguage, 'name', null),
    starCount: _get(stargazers, 'totalCount', null),
    forkCount,
    issueCount: _get(issues, 'totalCount', null),
    commitCount: _get(defaultBranchRef, 'target.history.totalCount', null)
  }
}



export async function getRepositoryStars(owner: string, name: string): Promise<number> {
  const response: GitHubGetRepoStarsResponse = await client.request(getRepositoryStarsQuery, { owner, name });
  return response.repository.stargazers.totalCount;
}



export async function star(repoId: string): Promise<boolean> {
  const response: GithubAddStarResponse = await client.request(starMutation, starMutationInput(repoId));
  return response.addStar.starrable.viewerHasStarred;
}

export async function unstar(repoId: string): Promise<boolean> {
  const response: GithubRemoveStarResponse = await client.request(unstarMutation, starMutationInput(repoId));
  return response.removeStar.starrable.viewerHasStarred;
}

function starMutationInput(repoId: string): GitHubStarMutationInput {
  return {
    input: {
      starrableId: repoId
    }
  }
}
