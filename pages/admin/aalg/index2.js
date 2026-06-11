import TeamsService from "../../../shared/services/teams.service.js";
import TeamRequest from "../shared/models/request/team.request.js";

const teamsService = new TeamsService();

document
    .getElementById("create-team-form")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const teamRequest = new TeamRequest(
            document.getElementById("team-name").value,
            document.getElementById("team-description").value
        );

        try {
            await teamsService.create(teamRequest);

            alert("Team created successfully");

            document.getElementById("create-team-form").reset();

        } catch (error) {
            console.error(error);
            alert("Error creating team");
        }
    });