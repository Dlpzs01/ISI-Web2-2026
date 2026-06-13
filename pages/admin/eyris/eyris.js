import TeamsService from "./service.js";
import TeamRequest from "../shared/models/request/team.request.js";

const teamsService = new TeamsService();

document
.getElementByID("teamForm")
.addEventListener("submit, createTeam");

async function createTeam (event) {
    event.preventDefault();git

    const name = 
    document.getElementByID("name").value;

    const description = 
    document.getElementByID("description").value;

    const teamRequest = 
    new TeamRequest(name, description);

    try {
        const team = 
        await teamsService.create(TeamRequest);
        
        console.log(team);

        alert("Team created successfully");

    } catch (error) {

        console.error(error);

        alert("Error creating team");
    }

    }