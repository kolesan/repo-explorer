import log from '../../utils/Logging';
import { repoSearch, star, unstar, getRepository, getRepositoryStars } from './GitHubApiV4';
import { StarMutationResponse } from '../../types/RepoTypes';

jest.setTimeout(30000);

describe('"repoSearch" returns a list of repositories from github api that match the provided query', () => {

  test(`single request`, async () => {
    const response = await repoSearch({
      searchQuery: 'react-ts-table sort:updated',
      count: 10 
    });

    expect(response.total).toEqual(3);
    expect(response.repos).toHaveLength(3);
    expect(response.repos).toContainEqual(
      {
        name: 'react-ts-table',
        owner: 'kolesan',
        description: 'Sortable table with react and typescript',
        license: null,
        url: 'https://github.com/kolesan/react-ts-table',
        starred: true,
        language: 'TypeScript',
        starCount: 1,
        forkCount: 0,
        issueCount: 0
      }
    );
    expect(response.repos).toContainEqual(
      {
        name: 'ts-react-json-table',
        owner: 'agracio',
        description: 'Simple React table component to display JSON data.',
        license: 'mit',
        url: 'https://github.com/agracio/ts-react-json-table',
        starred: false,
        language: 'TypeScript',
        starCount: 13,
        forkCount: 4,
        issueCount: 5
      }
    );
    expect(response.repos).toContainEqual(
      {
        name: 'react_table_ts',
        owner: 'tomo0613',
        description: null,
        license: null,
        url: 'https://github.com/tomo0613/react_table_ts',
        starred: false,
        language: 'TypeScript',
        starCount: 0,
        forkCount: 0,
        issueCount: 0
      }
    );
  });

  test(`multiple requests using page cursors`, async () => {
    const response1 = await repoSearch({
      searchQuery: 'react-ts-table sort:updated',
      count: 2 
    });
    const response2 = await repoSearch({
      searchQuery: 'react-ts-table sort:updated',
      startCursor: response1.nextPageCursor,
      count: 2 
    });


    expect(response1.total).toEqual(3);
    expect(response1.nextPageCursor).toBeDefined();
    expect(response1.repos).toHaveLength(2);

    expect(response2.total).toEqual(3);
    expect(response2.nextPageCursor).toBeUndefined();
    expect(response2.repos).toHaveLength(1);

    expect(response1.repos).not.toContainEqual(response2.repos[0]);
  });

});


test(`can get a repository by it's owner and name using 'getRepository'`, async () => {
  
  let repo = await getRepository("kolesan", "react-ts-table");

  expect(repo).toEqual(
    {
      id: 'MDEwOlJlcG9zaXRvcnkxNzcwODE5MDg=',
      name: 'react-ts-table',
      owner: 'kolesan',
      description: 'Sortable table with react and typescript',
      license: null,
      url: 'https://github.com/kolesan/react-ts-table',
      starred: true,
      language: 'TypeScript',
      starCount: 1,
      forkCount: 0,
      issueCount: 0,
      commitCount: 78
    }
  );

});



test(`can get repository star count by it's owner and name using 'getRepositoryStars'`, async () => {
  let stars = await getRepositoryStars("kolesan", "react-ts-table");
  expect(stars).toEqual(1);
  
  stars = await getRepositoryStars("kolesan", "repo-explorer");
  expect(stars).toEqual(0);
});



test(`can star and unstar a repository by id using 'star' and 'unstar' methods`, async () => {
  //Get id
  let repo = await getRepository("kolesan", "react-ts-table");

  //Star
  const starResponse: StarMutationResponse = await star(repo.id);
  expect(starResponse.starred).toBe(true);
  expect((await getRepository("kolesan", "react-ts-table")).starred).toBe(true);

  //Unstar
  const unstarResponse: StarMutationResponse = await unstar(repo.id);
  expect(unstarResponse.starred).toBe(false);
  expect((await getRepository("kolesan", "react-ts-table")).starred).toBe(false);
});
