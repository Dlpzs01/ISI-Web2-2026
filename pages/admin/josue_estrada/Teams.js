import TeamsService from "../../../shared/services/teams.service.js";

const teamsService = new TeamsService();

/* ========================================
   GET TEAMS
======================================== */

async function loadTeams() {
    const teams = await teamsService.get();
    return teams;
}

async function buildTable() {
    const teams = await loadTeams();

    const tableBody = document.getElementById("teams-table-body");

    tableBody.innerHTML = "";

    teams.forEach(team => {

        const row = document.createElement("tr");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", async () => {
            console.log(`Delete team with ID: ${team.id}`);
        });

        const td = document.createElement("td");
        td.appendChild(deleteButton);

        row.innerHTML = `
            <td>${team.id}</td>
            <td>${team.name}</td>
            <td>${team.description ?? "-"}</td>
            <td>${team.memberCount ?? 0}</td>
        `;

        row.appendChild(td);

        tableBody.appendChild(row);
    });
}

/* ========================================
   POST TEAM
======================================== */

async function createTeam(teamData) {

    try {

        await teamsService.create(teamData);

        showSuccessMessage("Team created successfully");

        // Recarga la tabla automáticamente
        await buildTable();

    } catch (error) {

        console.error(error);

        showErrorMessage("Error creating team");
    }
}

/* ========================================
   FORM SUBMIT
======================================== */

function initializeCreateTeamForm() {

    const form = document.getElementById("create-team-form");

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const teamName = document
            .getElementById("team-name")
            .value
            .trim();

        const teamDescription = document
            .getElementById("team-description")
            .value
            .trim();

        if (!teamName) {

            showErrorMessage("Team name is required");

            return;
        }

        const teamData = {
            name: teamName,
            description: teamDescription
        };

        await createTeam(teamData);

        form.reset();
    });
}

/* ========================================
   MESSAGES
======================================== */

function showSuccessMessage(message) {

    const successMessage =
        document.getElementById("success-message");

    const errorMessage =
        document.getElementById("error-message");

    errorMessage.hidden = true;

    successMessage.textContent = message;
    successMessage.hidden = false;
}

function showErrorMessage(message) {

    const successMessage =
        document.getElementById("success-message");

    const errorMessage =
        document.getElementById("error-message");

    successMessage.hidden = true;

    errorMessage.textContent = message;
    errorMessage.hidden = false;
}

/* ========================================
   INIT
======================================== */

async function init() {

    initializeCreateTeamForm();

    await buildTable();
}

init();