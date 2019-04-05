const getRepositoryStarsQuery = `
  query getRepositoryStars($owner: String!, $name: String!){
    repository(owner: $owner, name: $name) {
      stargazers {
        totalCount
      }
    }
  }
`;
export default getRepositoryStarsQuery;
