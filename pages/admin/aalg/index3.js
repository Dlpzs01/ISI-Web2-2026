import TeamsService from "../../../shared/services/teams.service.js";

const teamsService = new TeamsService();

document
    .getElementById("delete-team-form")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const id = document.getElementById("team-id").value;

        try {

            await teamsService.delete(id);

            alert("Team deleted successfully");

            document.getElementById("delete-team-form").reset();

        } catch (error) {

            console.error(error);
            alert("Error deleting team");

        }
    });