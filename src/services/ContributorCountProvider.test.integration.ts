import contributorCount from './ContributorCountProvider';

describe('provides the number of contributors for a repo with', () => {

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