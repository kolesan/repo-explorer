This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `Tests`

`npm test` - runs all unit tests.
Launches the test runner in the interactive watch mode.

`npm test -- --no-watch` - runs all the tests once without the watch mode.

### `Integration tests`

Integration tests are special tests that interract with real world apis.<br>
Integration test suite files end with `.test.integration.ts`

`npm run integrationTests` - runs all integration tests.

`npm run integrationTests -- --testPathPattern=RepoList` - runs integration tests that match the provided pattern (`RepoList` in this case).

These tests have to be kept up to date since their asserts are susceptible to outside world changes.<br>
If they fail unexpectedly, first check if the data they are working with has not changed.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
