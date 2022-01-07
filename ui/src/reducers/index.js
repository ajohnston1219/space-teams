import { combineReducers } from "redux";
import ui from "./ui";
import user from "./user";
import teams from "./teams";
import organization from "./organization";
import sims from "./sims";
import competitions from "./competitions";
import search from "./search";
import notifications from "./notifications";
import messages from "./messages";
import billing from "./billing";
import resources from "./resources";
import errors from "./errors";

export default combineReducers({
    ui,
    user,
    teams,
    organization,
    sims,
    competitions,
    search,
    notifications,
    errors,
    messages,
    resources,
    billing
});
