# Github repository explorer

A web app that let's you search github repositories and displays results in a list.<br>
List items can be clicked on to enter a detailed view for a single repository.

## Github token

This app uses GitHub api v4 which requires you to be authenticated.<br>
You have to provide access token in a special file `token.js` in your root directory for this application to work.<br>
You will need to grant `public_repo` and `gist` scopes to the access token in order for star/unstar functionality to work.

Example of `token.js` contents:
```
export default "358235691abc360e95e96eec1f9ca35c979acf92";
```

## Development

`npm start` - Runs the app in development mode on `http://localhost:3000`


## Tests

`npm test` - runs all unit tests.
Launches the test runner in the interactive watch mode.

`npm test -- --no-watch` - runs all the tests once without the watch mode.

## Integration tests

Integration tests are special tests that interract with real world apis.<br>
Integration test suite files end with `.test.integration.ts`

`npm run integrationTests` - runs all integration test suites.

`npm run integrationTests -- --testPathPattern=RepoList` - runs integration test suites that match the provided pattern (`RepoList` in this case).

`npm run integrationTests -- --testNamePattern=participation` - runs integration tests that match the provided pattern (describe or individual test name) (`participation` in this case).<br>
Can be combined with `--testPathPattern`


These tests have to be kept up to date since their asserts are susceptible to outside world changes.<br>
If they fail unexpectedly, first check if the data they are working with has not changed.

You will need to provide [github access token](#github-token) for these tests to work.

## Building production bundle

`npm run build` - builds the production bundle in the `build` folder.
