const starMutation = `mutation star($input: AddStarInput!) {
  addStar(input: $input) {
    starrable {
      viewerHasStarred
    }
  }
}
`;
export default starMutation;