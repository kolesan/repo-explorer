# Github repository explorer

A web app that let's you search github repositories and displays results in a list.<br>
List items can be clicked on to enter a detailed view for a single repository.

## Development

`npm start` - Runs the app in development mode on `http://localhost:3000`

## Tests

`npm test` - runs all unit tests.
Launches the test runner in the interactive watch mode.

`npm test -- --no-watch` - runs all the tests once without the watch mode.

## Integration tests

Integration tests are special tests that interract with real world apis.<br>
Integration test suite files end with `.test.integration.ts`

`npm run integrationTests` - runs all integration tests.

`npm run integrationTests -- --testPathPattern=RepoList` - runs integration tests that match the provided pattern (`RepoList` in this case).

These tests have to be kept up to date since their asserts are susceptible to outside world changes.<br>
If they fail unexpectedly, first check if the data they are working with has not changed.

## Building production bundle

`npm run build` - builds the production bundle in the `build` folder.
