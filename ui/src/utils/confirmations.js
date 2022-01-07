import { handleRemoveNotificationClick } from "../actions/notifications";
import { leaveTeam, deleteTeam } from "../actions/teams";
import { openConfirmation } from "../actions/ui";
import store from "../store";

export const declineInviteConfirmation = invite => ({
  header: "Decline Invite?",
  message: `Are you sure you want to decline your invitation ` +
    `to join team '${invite.teamName}'?`,
  onConfirm: () => store.dispatch(handleRemoveNotificationClick(invite))
});

export const leaveTeamConfirmation = team => ({
  header: "Leave Team?",
  message: `Are you sure you want to leave the team '${team.name}'`,
  onConfirm: () => store.dispatch(leaveTeam(team.id))
});

export const deleteTeamConfirmation = team => ({
  header: "Delete Team?",
  message: `Are you sure you want to delete the team '${team.name}'` +
    ` and remove all your teammates? This action cannnot be undone.`,
  onConfirm: () => store.dispatch(deleteTeam(team.id))
});

export const organizationRegistrationThankYou = () => ({
    header: "Thank You",
    message: "Thank you for registering your organization. " +
        "Please check your email for next steps to sign up individual students.",
    onConfirm: () => {},
    okayOnly: true
});

export const organizationRegistrationConfirmation = (orgId, compId, history) => {
    let nextURL = "/competition-bulk-pay?organization_id=" + orgId;
    if (compId) {
        nextURL += "&competition_id=" + compId;
    }
    return {
        header: "Success",
        message: "You've successfully created your organization. " +
            "You will receive a welcome email with a student registration " +
            "form along with a link that you can use to pay for " +
            "student registrations. If you know approximately how many " +
            "students you will be registering, you can pay now and make " +
            "changes later. Proceed to payment page?",
        onConfirm: () => history.push(nextURL),
        onCancel: () => store.dispatch(openConfirmation(organizationRegistrationThankYou())),
        newModalOnCancel: true
    };
};

export const inviteToSimConfirmation = () => {
    return {
        header: "Invite Successful",
        message: "You've successfully invited your team member(s) to your sim. " +
            "They will receive an email instructing them to wait for you in the lobby. " +
            "Go ahead and log into the SpaceCRAFT application and wait for them to join you " +
            "in the lobby (the main menu with all the activities). " +
            "Do NOT start the sim until you've met your teammate(s) in the " +
            "lobby. If you start the sim without them, they won't be able to join you.",
        okayOnly: true,
        onConfirm: () => {},
        onCancel: () => {}
    };
};
