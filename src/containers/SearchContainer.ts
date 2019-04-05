import { connect } from "react-redux";
import Search from "../components/Search";
import { Dispatch } from "redux";
import log from "../utils/Logging";
import searchStateChanged from "../actions/SearchStateChangedAction";
import { SearchState } from "../state_model/SearchState";


function mapStateToProps({ searchQuery, searchState }: any) {
  log("updating state", searchQuery, searchState);
  return { searchQuery, searchState };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    searchStateChanged: (searchState: SearchState) => {
      dispatch(searchStateChanged(searchState))
    }
  }
}

const SearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);

export default SearchContainer;