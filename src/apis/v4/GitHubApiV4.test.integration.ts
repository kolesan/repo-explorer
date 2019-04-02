import log from '../../utils/Logging';
import { repoSearch, star, unstar } from './GitHubApiV4';
import { StarMutationResponse } from '../../types/RepoListTypes';

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
        id: expect.any(String),
        name: 'react-ts-table',
        owner: 'kolesan',
        description: 'Sortable table with react and typescript',
        license: null,
        url: 'https://github.com/kolesan/react-ts-table',
        starred: false,
        language: 'TypeScript',
        starCount: 0,
        forkCount: 0,
        issueCount: 0,
        commitCount: 78
      }
    );
    expect(response.repos).toContainEqual(
      {
        id: expect.any(String),
        name: 'ts-react-json-table',
        owner: 'agracio',
        description: 'Simple React table component to display JSON data.',
        license: 'MIT License',
        url: 'https://github.com/agracio/ts-react-json-table',
        starred: false,
        language: 'TypeScript',
        starCount: 13,
        forkCount: 4,
        issueCount: 5,
        commitCount: 46
      }
    );
    expect(response.repos).toContainEqual(
      {
        id: expect.any(String),
        name: 'react_table_ts',
        owner: 'tomo0613',
        description: null,
        license: null,
        url: 'https://github.com/tomo0613/react_table_ts',
        starred: false,
        language: 'TypeScript',
        starCount: 0,
        forkCount: 0,
        issueCount: 0,
        commitCount: 2
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



describe(`can star and unstar a repository by id`, () => {
  
  test(`using 'star' and 'unstar' methods`, async () => {
    //Get id
    let searchResponse = await repoSearch({
      searchQuery: 'kolesan/react-ts-table',
      count: 1
    });
    const repoId = searchResponse.repos[0].id;

    //Star
    const starResponse: StarMutationResponse = await star(repoId);
    expect(starResponse.starred).toBe(true);
    
    searchResponse = await repoSearch({
      searchQuery: 'kolesan/react-ts-table',
      count: 1
    });
    expect(searchResponse.repos[0].starred).toBe(true);

    //Unstar
    const unstarResponse: StarMutationResponse = await unstar(repoId);
    expect(unstarResponse.starred).toBe(false);
    
    searchResponse = await repoSearch({
      searchQuery: 'kolesan/react-ts-table',
      count: 1
    });
    expect(searchResponse.repos[0].starred).toBe(false);
  });

});
