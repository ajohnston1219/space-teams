import {
    SET_USER_COMPETITIONS,
    SET_COMPETITION_BY_ID,
    SET_ACTIVE_COMPETITIONS,
    COMPETITIONS_LOADING,
    LEADERBOARD_LOADING,
    ACTIVITY_DATA_LOADING,
    SET_LEADERBOARD,
    SET_SELECTED_LEADERBOARD,
    SET_SELECTED_ACTIVITY,
    SET_SCORECARD,
    SET_SCORECARD_COMPARISON,
    CLEAR_SCORECARD_COMPARISON,
    SET_SCORECARD_COMPARISON_LOADING,
    LOGOUT,
    SET_COMPETITION_TO_CREATE,
    SET_SELECTED_COMPETITION_INFO,
    SET_CURRENT_COMPETITION
} from "../actions/types";

import { uniqueById } from "../utils/unique";

const initialState = {
    userComps: [],
    activeComps: [],
    compById: {},
    loading: false,
    activitiesLoading: false,
    activityDataLoading: false,
    currentCompetition: null,
    leaderboard: {
        competition: "",
        list: [],
        loading: false
    },
    selectedActivity: {},
    scorecardComparison: {
        loading: false,
        activityName: "",
        myScorecard: null,
        theirScorecard: null
    },
    competitionToCreate: {
        name: "",
        startDate: null,
        endDate: null,
        activities: [],
        leagues: [""]
    },
    selectedCompetitionInfo: {},
}

const competitions = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_COMPETITIONS: {
            return {
                ...state,
                userComps: action.payload,
                loading: false
            };
        }
        case SET_CURRENT_COMPETITION: {
            return {
                ...state,
                currentCompetition: action.payload
            };
        }
        case SET_ACTIVE_COMPETITIONS: {
            return { ...state, activeComps: uniqueById([...action.payload]), loading: false };
        }
        case SET_COMPETITION_BY_ID: {
            return { ...state, compById: Object.assign(action.payload), loading: false };
        }
        case SET_LEADERBOARD: {
            return {
                ...state,
                leaderboard: {
                    ...state.leaderboard,
                    list: action.payload,
                    loading: false
                }
            };
        }
        case SET_SELECTED_LEADERBOARD: {
            return {
                ...state,
                leaderboard: {
                    ...state.leaderboard,
                    competition: action.payload
                }
            };
        }
        case SET_SELECTED_ACTIVITY: {
            return {
                ...state,
                selectedActivity: action.payload
            };
        }
        case SET_SCORECARD: {
            const newState = { ...state };
            if (newState.selectedActivity.id === action.payload.id) {
                newState.selectedActivity = {
                    ...newState.selectedActivity,
                    scorecard: action.payload.scorecard
                };
            }
            return {
                ...newState,
                userComps: newState.userComps.map(c => ({
                    ...c,
                    activities: c.activities.map(a => {
                        if (a.id === action.payload.id) {
                            return { ...a, scorecard: action.payload.scorecard };
                        }
                        else {
                            return a;
                        }
                    })
                }))
            };
        }
        case SET_SCORECARD_COMPARISON: {
            return {
                ...state,
                scorecardComparison: {
                    ...state.scorecardComparison,
                    activityName: action.payload.activityName,
                    myScorecard: action.payload.myScorecard,
                    theirScorecard: action.payload.theirScorecard
                }
            };
        }
        case CLEAR_SCORECARD_COMPARISON: {
            return {
                ...state,
                scorecardComparison: initialState.scorecardComparison
            };
        }
        case SET_SCORECARD_COMPARISON_LOADING: {
            return {
                ...state,
                scorecardComparison: {
                    ...state.scorecardComparison,
                    loading: action.payload
                }
            };
        }
        case COMPETITIONS_LOADING: {
            return { ...state, loading: action.payload };
        }
        case ACTIVITY_DATA_LOADING: {
            return { ...state, activityDataLoading: action.payload };
        }
        case LEADERBOARD_LOADING: {
            return { ...state, leaderboard: { ...state.leaderboard, loading: action.payload } };
        }
        case SET_COMPETITION_TO_CREATE: {
            return { ...state, competitionToCreate: { ...state.competitionToCreate, ...action.payload } };
        }
        case SET_SELECTED_COMPETITION_INFO: {
            return { ...state, selectedCompetitionInfo: action.payload };
        }
        case LOGOUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default competitions;
