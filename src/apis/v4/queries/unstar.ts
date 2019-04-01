const unstarMutation = `mutation unstar($input: RemoveStarInput!) {
  removeStar(input: $input) {
    starrable {
      viewerHasStarred
    }
  }
}
`;
export default unstarMutation;