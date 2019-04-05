import { connect } from "react-redux";
import ListView from "../components/ListView";
import { Dispatch } from "redux";
import searchQueryChanged from "../actions/SearchQueryChangedAction";
import log from "../utils/Logging";


function mapStateToProps(state: any) {
  log("Mapping state")
  return { searchQuery: state.searchQuery };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    searchQueryChanged: (query: string) => {
      dispatch(searchQueryChanged(query))
    }
  }
}

const ListViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListView);

export default ListViewContainer