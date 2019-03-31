import { contributorCount, commitStats } from './GitHubApiV3';
import log from '../utils/Logging';

describe('"contributorCount" provides the number of contributors for a repo with', () => {

  test(`1 page of contributors (no link header)`, async () => {
    const count = await contributorCount("kolesan", "repo-explorer");
    expect(count).toEqual(1);
  });

  test(`2 pages of contributors`, async () => {
    const count = await contributorCount("jest-community", "vscode-jest");
    expect(count).toEqual(32);
  });

  test(`>2 pages of contributors`, async () => {
    const count = await contributorCount("axios", "axios");
    expect(count).toEqual(159);
  });

});

describe('"commitStats" provides last year participation statistics for a repo', () => {

  test(`returns a 52 elements long number array`, async () => {
    const participation = await commitStats("kolesan", "repo-explorer");
    // log(participation);

    expect(participation.all).toHaveLength(52);
    expect(participation.owner).toHaveLength(52);
    expect(participation).toEqual({
      all: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8
      ],
      owner: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8
      ]
    });
  });

});