import { GraphQLClient } from 'graphql-request';
import token from '../../token';
import log from '../utils/Logging';
import { RepoSearchParams, RepoSearchResult, Repo } from '../types/RepoListTypes';
import { GithubRepoSearchResponse, GitHubRepo } from '../types/GithubApiTypes';

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
    viewerHasStarred, primaryLanguage, stargazers, forkCount, issues 
  } = gitHubRepo;

  return {
    name: name,
    owner: owner && owner.login,
    description,
    license: licenseInfo && licenseInfo.name,
    url,
    starred: viewerHasStarred,
    language: primaryLanguage && primaryLanguage.name,
    starCount: stargazers && stargazers.totalCount,
    forkCount,
    issueCount: issues && issues.totalCount
  }
}
