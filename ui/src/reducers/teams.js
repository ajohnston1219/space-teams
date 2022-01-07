import {
    SET_TEAMS,
    TEAMS_LOADING,
    SET_TEAM_TO_CREATE,
    CREATE_TEAM_LOADING,
    SET_TEAM_INVITE,
    SET_INVITE_BY,
    CLEAR_INVITE_BY,
    TEAM_INVITE_LOADING,
    SET_TEAM_TO_JOIN,
    JOIN_TEAM_LOADING,
    SET_TEAM_MEMBERS,
    SET_TEAM_MEMBERS_LOADING,
    CLEAR_TEAM_MEMBERS,
    SET_SIM_INVITE_LOADING,
    SET_SIM_INVITE,
    CLEAR_SIM_INVITE,
    LOGOUT
} from "../actions/types";

const initialState = {
    list: [],
    invite: {
        team: "",
        username: "",
        email: ""
    },
    inviteBy: "",
    simInvite: {
        usersToInvite: [],
        mentorsToInvite: [],
        team: "",
        activityName: ""
    },
    loading: false,
    teamToCreate: {
        name: "",
        competitionId: "",
        league: ""
    },
    createTeamLoading: false,
    inviteLoading: false,
    simInviteLoading: false,
    teamToJoin: null,
    joinTeamLoading: false,
    members: null,
    teamMembersLoading: false
};

const teams = (state = initialState, action) => {
    switch (action.type) {
        case SET_TEAMS: {
            return { ...state, list: [ ...action.payload ], loading: false };
        }
        case TEAMS_LOADING: {
            return { ...state, loading: action.payload };
        }
        case SET_TEAM_TO_CREATE: {
            if (!action.payload) {
                return {
                    ...state,
                    teamToCreate: {
                        name: ""
                    }
                };
            }
            return {
                ...state,
                teamToCreate: {
                    ...state.teamToCreate,
                    ...action.payload
                }
            };
        }
        case CREATE_TEAM_LOADING: {
            return { ...state, createTeamLoading: action.payload };
        }
        case SET_TEAM_INVITE: {
            return { ...state, invite: { ...state.invite, ...action.payload }};
        }
        case SET_INVITE_BY: {
            return { ...state, inviteBy: action.payload };
        }
        case CLEAR_INVITE_BY: {
            return { ...state, inviteBy: initialState.inviteBy };
        }
        case TEAM_INVITE_LOADING: {
            return { ...state, inviteLoading: action.payload };
        }
        case SET_TEAM_TO_JOIN: {
            return { ...state, teamToJoin: action.payload };
        }
        case JOIN_TEAM_LOADING: {
            return { ...state, joinTeamLoading: action.payload };
        }
        case SET_TEAM_MEMBERS: {
            return { ...state, members: action.payload };
        }
        case CLEAR_TEAM_MEMBERS: {
            return { ...state, teamMembers: null };
        }
        case SET_SIM_INVITE: {
            return { ...state, simInvite: { ...state.simInvite, ...action.payload } };
        }
        case CLEAR_SIM_INVITE: {
            return { ...state, simInvite: initialState.simInvite };
        }
        case SET_TEAM_MEMBERS_LOADING: {
            return { ...state, membersLoading: action.payload };
        }
        case SET_SIM_INVITE_LOADING: {
            return { ...state, simInviteLoading: action.payload };
        }
        case LOGOUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default teams;
