import { NotificationType } from "../utils/enums";

export const getTeamInvites = notifications => notifications && notifications.list
    ? notifications.list.filter(n => n.type === NotificationType.TEAM_INVITE)
    : [];
