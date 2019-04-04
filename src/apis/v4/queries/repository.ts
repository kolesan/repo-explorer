const getRepositoryQuery = `
  query getRepository($owner: String!, $name: String!){
    repository(owner: $owner, name: $name) {
      id
      name
      owner {
        login
      }
      description
      licenseInfo {
        key
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
`;
export default getRepositoryQuery;
