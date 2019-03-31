import { GraphQLClient } from 'graphql-request';
import token from '../../token';
import log from '../utils/Logging';
import { RepoSearchParams, RepoSearchResult, Repo, StarMutationResponse } from '../types/RepoListTypes';
import { GithubRepoSearchResponse, GitHubRepo, GithubAddStarResponse, GithubRemoveStarResponse, GitHubStarMutationInput } from '../types/GithubApiTypes';
const _get = require('lodash/get');

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    authorization: `token ${token}`,
  },
})

const queryGetRepos = `
  query getRepos($searchQuery: String!, $startCursor: String, $count: Int!){
    search(query: $searchQuery, after: $startCursor, first: $count, type:REPOSITORY){
      pageInfo {
        hasNextPage
        endCursor
      }
      repositoryCount
      nodes {
        ... on Repository {
          id
          name
          owner {
            login
          }
          updatedAt
          description
          licenseInfo {
            name
          }
          url
          viewerHasStarred
          primaryLanguage {
            name
          }
          stargazers {
            totalCount
          }
          forkCount
          issues {
            totalCount
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function repoSearch({ searchQuery, startCursor, count }: RepoSearchParams): Promise<RepoSearchResult> {
  //Without adding ' sort:updated' to search query and adding 'updatedAt' field to the graphql query
  //the result order seems to be random and as a result cursor navigation becomes impossible
  const queryWithSort = searchQuery + " sort:updated";

  const response: GithubRepoSearchResponse = await client.request(queryGetRepos, { searchQuery: queryWithSort, startCursor, count });
  const { search } = response;
  return {
    total: search.repositoryCount,
    repos: search.nodes.map(toRepoObject),
    nextPageCursor: search.pageInfo.hasNextPage ? search.pageInfo.endCursor : undefined
  }
}

function toRepoObject(gitHubRepo: GitHubRepo): Repo {
  const { id, name, owner, description, licenseInfo, url,
    viewerHasStarred, primaryLanguage, stargazers, forkCount, issues, defaultBranchRef
  } = gitHubRepo;

  return {
    id,
    name: name,
    owner: _get(owner, 'login', null),
    description,
    license: _get(licenseInfo, 'name', null),
    url,
    starred: viewerHasStarred,
    language: _get(primaryLanguage, 'name', null),
    starCount: _get(stargazers, 'totalCount', null),
    forkCount,
    issueCount: _get(issues, 'totalCount', null),
    commitCount: _get(defaultBranchRef, 'target.history.totalCount', null)
  }
}



const mutationStar = `mutation star($input: AddStarInput!) {
    addStar(input: $input) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

export async function star(repoId: string): Promise<StarMutationResponse> {
  const response: GithubAddStarResponse = await client.request(mutationStar, starMutationInput(repoId));
  return {
    starred: response.addStar.starrable.viewerHasStarred
  }
}



const mutationUnstar = `mutation unstar($input: RemoveStarInput!) {
  removeStar(input: $input) {
    starrable {
      viewerHasStarred
    }
  }
}
`;

export async function unstar(repoId: string): Promise<StarMutationResponse> {
  const response: GithubRemoveStarResponse = await client.request(mutationUnstar, starMutationInput(repoId));
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
