import { GraphQLClient } from 'graphql-request';
import token from '../../token';
import log from '../utils/Logging';
import { RepoSearchParams, RepoSearchResult, Repo } from '../types/RepoListTypes';
import { GithubRepoSearchResponse, GitHubRepo } from '../types/GithubApiTypes';
const _get = require('lodash/get');

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    authorization: `token ${token}`,
  },
})

const getReposQuery = `
  query getRepos($searchQuery: String!, $startCursor: String, $count: Int!){
    search(query: $searchQuery, after: $startCursor, first: $count, type:REPOSITORY){
      pageInfo {
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
  //Without this and 'updatedAt' field in the query the result order seems to be random and
  //as a result cursor navigation impossible
  const queryWithSort = searchQuery + " sort:updated";
  const response: GithubRepoSearchResponse = await client.request(getReposQuery, { searchQuery: queryWithSort, startCursor, count });
  // log(JSON.stringify(response, null, "  "));
  const { search } = response;
  return {
    total: search.repositoryCount,
    repos: search.nodes.map(toRepoObject),
    nextPageCursor: search.pageInfo.endCursor,
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
