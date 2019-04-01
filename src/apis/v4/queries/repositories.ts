const getRepositoriesQuery = `
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
export default getRepositoriesQuery;