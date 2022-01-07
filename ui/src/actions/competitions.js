import {
    SET_USER_COMPETITIONS,
    SET_COMPETITION_BY_ID,
    SET_ACTIVE_COMPETITIONS, 
    SET_COMPETITIONS_ACTIVITIES,
    SET_LEADERBOARD,
    SET_SELECTED_LEADERBOARD,
    COMPETITIONS_LOADING,
    LEADERBOARD_LOADING,
    ACTIVITY_DATA_LOADING,
    SET_SCORECARD,
    SET_COMPETITION_TO_CREATE,
    SET_SCORECARD_COMPARISON,
    CLEAR_SCORECARD_COMPARISON,
    SET_SCORECARD_COMPARISON_LOADING,
    SET_CURRENT_COMPETITION
} from "./types";

import moment from "moment";
import { ErrorTag, } from "../utils/enums";
import { addError, clearErrors } from "./errors";
import compServer from "../api/comp";
import { getToken } from "./user";
import { closeJoinCompetitionModal } from "./ui";

const _getUserCompetitions = async (token) => {
    try {
        const userCompetitions = await compServer.get("/", { headers: { Authorization: token } });
        return userCompetitions.data;
    } catch (err) {
        throw err;
    }
};

const _getCompletedActivities = async (token, teamName, compId) => {
    try {
        const completedActivities = await compServer.get(
            `/activities/completed?team_name=${teamName}&competition_id=${compId}`,
            { headers: { Authorization: token } }
        );
        return completedActivities.data;
    } catch (err) {
        throw err;
    }
};

const _joinCompetition = async (token, compId, teamId) => {
    try {

        const body = {
            id: compId,
            teamId: teamId,
        };

        await compServer.post("/join", body, { headers: { Authorization: token } });
    } catch (err) {
        throw err;
    }
}

const _getAllActiveCompetitions = async () => {
    try {
        const activeCompetitionsResults = await compServer.get(
            "/active"
        );
        return activeCompetitionsResults.data;
    } catch (err) {
        throw err;
    }
};

const _getCompetitionById = async (token, id) => {
    try {
        const competitionResults = await compServer.get(`/?id=${id}`, { headers: { Authorization: token } });
        return competitionResults.data;
    } catch (err) {
        throw err;
    }
};

const _getLeaderboard = async (token, compId) => {
    try {
        const leaderboardResult = await compServer.get(
            `/leaderboard?competition_id=${encodeURI(compId)}`,
            { headers: { Authorization: token } }
        );
        return leaderboardResult.data.map(s => ({
            team: { id: s.teamId, name: s.teamName },
            score: s.score,
            league: s.league
        }));
    } catch (err) {
        throw err;
    }
};

const _getActivityLeaderboard = async (token, compId, activityId) => {
    try {
        const compParam = encodeURI(compId);
        const actParam = encodeURI(activityId);
        const leaderboardResult = await compServer.get(
            `/activity-leaderboard?competition_id=${compParam}&activity_id=${actParam}`,
            { headers: { Authorization: token } }
        );
        return leaderboardResult.data.map(s => ({
            team: { id: s.teamId, name: s.teamName },
            score: s.score,
            league: s.league
        }));
    } catch (err) {
        throw err;
    }
};

const _getScorecard = async (token, teamId, activityId) => {
    try {
        const scorecard = await compServer.get(
            `/activities/score?team_id=${teamId}&activity_id=${activityId}`,
            { headers: { Authorization: token } }
        );
        return scorecard.data;
    } catch (err) {
        throw err;
    }
};

export const setCurrentCompetition = (comp) => ({
    type: SET_CURRENT_COMPETITION,
    payload: comp
});

export const getUserCompetitions = () => async (dispatch, getState) => {
    try {
        dispatch(clearErrors(ErrorTag.COMPETITIONS));
        dispatch({ type: COMPETITIONS_LOADING, payload: true });
        // TODO(adam): Handle this better
        dispatch({ type: SET_COMPETITIONS_ACTIVITIES, payload: [] });

        const token = getToken();
        if (!token) {
            return;
        }

        const userCompetitions = await _getUserCompetitions(token);
        const teams = getState().teams.list;
        await Promise.all(userCompetitions.map(async (c, i) => {
            const team = teams.find(t => t.id === c.teamId);
            if (team) {
                const completedActivities = await _getCompletedActivities(token, team.name, c.id);
                userCompetitions[i].activities.forEach((a, j) => {
                    const completedActivity = completedActivities.find(ca => ca.activity_id === a.id);
                    if (completedActivity) {
                        userCompetitions[i].activities[j].score = completedActivity.score;
                        userCompetitions[i].activities[j].scorecard = completedActivity.scorecard;
                    }
                });
            }
        }));

        // Set current competition
        const sortedUserComps = userCompetitions.sort((a, b) => {
            const aStart = moment(a.startDate);
            const bStart = moment(a.startDate);
            return aStart.diff(bStart);
        });
        const activeUserComps = sortedUserComps.filter(c => {
            const now = moment();
            const end = moment(c.endDate);
            return end > now;
        });
        // If none are active, select most recent
        if (activeUserComps.length === 0) {
            dispatch(setCurrentCompetition(sortedUserComps[0]));
        } else { // Select newest active comp
            dispatch(setCurrentCompetition(activeUserComps[0]));
        }

        dispatch({
            type: SET_USER_COMPETITIONS,
            payload: userCompetitions
        });

    } catch (err) {
        err.tag = ErrorTag.COMPETITIONS;
        dispatch(addError(err));
    } finally {
        dispatch({ type: COMPETITIONS_LOADING, payload: false });
    }
};

export const joinCompetition = (compId, teamId) => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.COMPETITIONS));
        dispatch({ type: COMPETITIONS_LOADING, payload: true });

        const token = getToken();
        if (!token) {
            return;
        }

        await _joinCompetition(token, compId, teamId);

        dispatch(getUserCompetitions(token));
        dispatch(closeJoinCompetitionModal());

    } catch (err) {
        err.tag = ErrorTag.COMPETITIONS;
        dispatch(addError(err));
    } finally {
        dispatch({ type: COMPETITIONS_LOADING, payload: false });
    }
};

export const getAllActiveCompetitions = () => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.COMPETITIONS));
        dispatch({ type: COMPETITIONS_LOADING, payload: true });

        const activeCompetitions = await _getAllActiveCompetitions();
        dispatch({
            type: SET_ACTIVE_COMPETITIONS,
            payload: activeCompetitions
        });

    } catch (err) {
        err.tag = ErrorTag.COMPETITIONS;
        dispatch(addError(err));
    } finally {
        dispatch({ type: COMPETITIONS_LOADING, payload: false });
    }
};

export const getCompetitionById = (id) => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.COMPETITIONS));
        dispatch({ type: COMPETITIONS_LOADING, payload: true });

        const token = getToken();
        if (!token) {
            return;
        }

        const competition = await _getCompetitionById(token, id);
        dispatch({
            type: SET_COMPETITION_BY_ID,
            payload: competition
        });

    } catch (err) {
        err.tag = ErrorTag.COMPETITIONS;
        dispatch(addError(err));
    } finally {
        dispatch({ type: COMPETITIONS_LOADING, payload: false });
    }
};

export const getCompetitionLeaderboard = (compId, activityId) => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.LEADERBOARD));
        dispatch({ type: LEADERBOARD_LOADING, payload: true });

        const token = getToken();
        if (!token) {
            return;
        }

        let leaderboard;
        if (activityId && activityId !== "Total") {
            leaderboard = await _getActivityLeaderboard(token, compId, activityId);
        } else {
            leaderboard = await _getLeaderboard(token, compId);
        }
        dispatch({
            type: SET_LEADERBOARD,
            payload: leaderboard
        });
    } catch (err) {
        err.tag = ErrorTag.LEADERBOARD;
        dispatch(addError(err));
    } finally {
        dispatch({ type: LEADERBOARD_LOADING, payload: false });
    }
};

export const getScorecard = (teamId, activityId) => async (dispatch, getState) => {
    try {
        dispatch(clearErrors(ErrorTag.SCORECARD));
        dispatch({ type: ACTIVITY_DATA_LOADING, payload: true });

        const token = getToken();
        if (!token) {
            return;
        }

        const scorecard = await _getScorecard(token, teamId, activityId);
        dispatch({
            type: SET_SCORECARD,
            payload: { id: activityId, scorecard }
        });

    } catch (err) {
        err.tag = ErrorTag.SCORECARD;
        dispatch(addError(err));
    } finally {
        dispatch({ type: ACTIVITY_DATA_LOADING, payload: false });
    }
};

export const getScorecardComparison = (myTeamId, theirTeamId, activity) => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.SCORECARD));
        dispatch({ type: SET_SCORECARD_COMPARISON_LOADING, payload: true });

        const token = getToken();
        if (!token) {
            return;
        }

        const [myScorecard, theirScorecard] = await Promise.all([
            _getScorecard(token, myTeamId, activity.id),
            _getScorecard(token, theirTeamId, activity.id)
        ]);
        dispatch({
            type: SET_SCORECARD_COMPARISON,
            payload: {
                activityName: activity.name,
                myScorecard,
                theirScorecard
            }
        });

    } catch (err) {
        err.tag = ErrorTag.SCORECARD;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_SCORECARD_COMPARISON_LOADING, payload: false });
    }
};

export const clearScorecardComparison = () => ({
    type: CLEAR_SCORECARD_COMPARISON
});

export const setSelectedLeaderboard = (compName) => ({
    type: SET_SELECTED_LEADERBOARD,
    payload: compName
});

export const setCompetitionToCreate = (comp) => ({
    type: SET_COMPETITION_TO_CREATE,
    payload: comp
});
