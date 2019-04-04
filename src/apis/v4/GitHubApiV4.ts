import { GraphQLClient } from 'graphql-request';
import token from '../../token';
import log from '../../utils/Logging';
import { RepoSearchParams, RepoSearchResult, RepoSearchResultItem, StarMutationResponse } from '../../types/RepoListTypes';
import { GithubRepoSearchResponse, GitHubRepo, GithubAddStarResponse, GithubRemoveStarResponse, GitHubStarMutationInput } from '../../types/GithubApiTypes';
import allRepositoriesQuery from './queries/repositories';
import starMutation from './queries/star';
import unstarMutation from './queries/unstar';
const _get = require('lodash/get');

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    authorization: `token ${token}`
  }
})



export async function repoSearch({ searchQuery, startCursor, count }: RepoSearchParams): Promise<RepoSearchResult> {
  const response: GithubRepoSearchResponse = await client.request(allRepositoriesQuery, { searchQuery, startCursor, count });
  const { search } = response;
  return {
    total: search.repositoryCount,
    repos: search.nodes.map(toRepoSearchResultItem),
    nextPageCursor: search.pageInfo.hasNextPage ? search.pageInfo.endCursor : undefined
  }
}

function toRepoSearchResultItem(gitHubRepo: GitHubRepo): RepoSearchResultItem {
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



export async function star(repoId: string): Promise<StarMutationResponse> {
  const response: GithubAddStarResponse = await client.request(starMutation, starMutationInput(repoId));
  return {
    starred: response.addStar.starrable.viewerHasStarred
  }
}

export async function unstar(repoId: string): Promise<StarMutationResponse> {
  const response: GithubRemoveStarResponse = await client.request(unstarMutation, starMutationInput(repoId));
  return {
    starred: response.removeStar.starrable.viewerHasStarred
  }
}

function starMutationInput(repoId: string): GitHubStarMutationInput {
  return {
    input: {
      starrableId: repoId
    }
  }
}
