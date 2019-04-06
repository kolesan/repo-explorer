import { connect } from "react-redux";
import { Dispatch } from "redux";
import repoStarStateChanged, { RepoStarStateActionPayload } from "../actions/RepoStarStateAction";
import log from "../utils/Logging";
import RepoView from "../components/repo_view/RepoView";


function mapDispatchToProps(dispatch: Dispatch) {
  return {
    repoStarStateChanged: (query: RepoStarStateActionPayload) => {
      dispatch(repoStarStateChanged(query))
    }
  }
}

const RepoViewContainer = connect(
  () => ({}),
  mapDispatchToProps
)(RepoView);

export default RepoViewContainer;