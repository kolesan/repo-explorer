import { contributorCount, commitStats } from './GitHubApiV3';
import log from '../../utils/Logging';

jest.setTimeout(30000);

describe('"contributorCount" provides the number of contributors for a repo with', () => {

  test(`1 contributor`, async () => {
    const count = await contributorCount("kolesan", "repo-explorer");
    expect(count).toEqual(1);
  });

  test(`Lots of contributors`, async () => {
    const count = await contributorCount("axios", "axios");
    expect(count).toEqual(174);
  });

});

describe('"commitStats" provides last year participation statistics for a repo', () => {

  test(`returns a 52 elements long number array`, async () => {
    const participation = await commitStats("kolesan", "react-ts-table");
    // log(participation);

    expect(participation).toHaveLength(52);
    expect(participation).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 44
    ]);
  });

});