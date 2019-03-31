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

const query = `
  query getRepos($searchQuery: String!, $startCursor: String, $count: Int!){
    search(query: $searchQuery, after: $startCursor, first: $count, type:REPOSITORY){
      pageInfo {
        endCursor
      }
      repositoryCount
      nodes {
        ... on Repository {
          name
          owner {
            login
          }
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

export default async function repoList({ searchQuery, startCursor, count }: RepoSearchParams): Promise<RepoSearchResult> {
  const response: GithubRepoSearchResponse = await client.request(query, { searchQuery, startCursor, count });
  // log(JSON.stringify(response, null, "  "));
  const { search } = response;
  return {
    total: search.repositoryCount,
    repos: search.nodes.map(toRepoObject),
    nextPageCursor: search.pageInfo.endCursor,
  }
}

function toRepoObject(gitHubRepo: GitHubRepo): Repo {
  const { name, owner, description, licenseInfo, url,
    viewerHasStarred, primaryLanguage, stargazers, forkCount, issues, defaultBranchRef
  } = gitHubRepo;

  return {
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
