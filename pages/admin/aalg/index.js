import TeamsService from "../../../shared/services/teams.service.js";
import TeamRequest from "../shared/models/request/team.request.js";

const teamsService = new TeamsService();

document
    .getElementById("update-team-form")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const id = document.getElementById("team-id").value;

        const teamRequest = new TeamRequest(
            document.getElementById("team-name").value,
            document.getElementById("team-description").value
        );

        try {
            await teamsService.update(id, teamRequest);

            alert("Team updated successfully");
        } catch (error) {
            console.error(error);
            alert("Error updating team");
        }
    });