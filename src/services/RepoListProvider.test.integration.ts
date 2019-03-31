import log from '../utils/Logging';
import repoList from './RepoListProvider';

test(`returns a list of repositories from github api that match the provided query`, async () => {
  const response = await repoList({
    searchQuery: 'react-ts-table',
    count: 10 
  });

  expect(response).toEqual({
    total: 3,
    nextPageCursor: expect.any(String),
    repos: [
      { 
        name: 'ts-react-json-table',
        owner: 'agracio',
        description: 'Simple React table component to display JSON data.',
        license: 'MIT License',
        url: 'https://github.com/agracio/ts-react-json-table',
        starred: false,
        language: 'TypeScript',
        starCount: 13,
        forkCount: 4,
        issueCount: 5
      },
      {
        name: 'react-ts-table',
        owner: 'kolesan',
        description: 'Sortable table with react and typescript',
        license: null,
        url: 'https://github.com/kolesan/react-ts-table',
        starred: false,
        language: 'TypeScript',
        starCount: 0,
        forkCount: 0,
        issueCount: 0 
      },
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
    ]
  });
});