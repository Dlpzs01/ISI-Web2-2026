import TeamsService from "./teams.service.js";

const teamsService = new TeamsService();

function getFormElements() {
    return {
        formEquipo: document.getElementById("form-equipo"),
        nameInput: document.getElementById("name"),
        descInput: document.getElementById("descripcion"),
        submitBtn: document.querySelector('#form-equipo button[type="submit"]'),
        tableBody: document.getElementById("teams-table-body"),
        searchButton: document.getElementById("searchTeamButton"),
        teamIdInput: document.getElementById("teamId"),
    };
}

// Cargar los equipos desde el servicio de la API
async function loadTeams() {
    try {
        const teams = await teamsService.getAllTeams();
        return { teams, errorMessage: null }; 
    } catch (error) {
        console.error("Error al cargar los equipos en la interfaz:", error);
        if (error?.status === 401 || error?.status === 403) {
            return { teams: [], errorMessage: "Inicia sesión para ver y editar equipos." };
        }

        return { teams: [], errorMessage: "No hay equipos registrados o la API está desconectada." }; 
    }
}

// Construir la tabla dinámicamente mapeando los datos de la API
async function buildTable() {
    const { tableBody } = getFormElements();
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const { teams, errorMessage } = await loadTeams();

    if (teams.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#666;">${errorMessage}</td></tr>`;
        return;
    }

    teams.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team.id}</td>
            <td><strong>${team.name}</strong></td>
            <td>${team.description || 'Sin descripción'}</td>
            <td>${team.memberCount ?? 0}</td>
            <td>
                <button class="btn-edit" data-id="${team.id}" data-name="${team.name}" data-description="${team.description || ''}">Editar</button>
                <button class="btn-delete" data-id="${team.id}">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function startEditTeam(teamId, name, description) {
    const { formEquipo, nameInput, descInput, submitBtn } = getFormElements();
    if (!formEquipo || !nameInput || !descInput || !submitBtn) return;

    nameInput.value = name;
    descInput.value = description;
    formEquipo.setAttribute("data-edit-id", teamId);
    submitBtn.textContent = "Guardar Cambios";
}

async function deleteTeam(teamId) {
    if (!confirm("¿Estás seguro de que deseas eliminar el equipo?")) return;

    try {
        await teamsService.deleteTeam(teamId);
        alert("Equipo eliminado con éxito");

        const { formEquipo, submitBtn } = getFormElements();
        if (formEquipo?.getAttribute("data-edit-id") === String(teamId)) {
            formEquipo.removeAttribute("data-edit-id");
            formEquipo.reset();
            if (submitBtn) submitBtn.textContent = "Agregar equipo";
        }

        buildTable();
    } catch (error) {
        console.error("Error al eliminar el equipo:", error);
        alert("No se pudo eliminar el equipo.");
    }
}

function initActionEvents() {
    const { tableBody } = getFormElements();
    if (!tableBody) return;

    tableBody.addEventListener("click", (event) => {
        const deleteButton = event.target.closest(".btn-delete");
        if (deleteButton) {
            deleteTeam(deleteButton.dataset.id);
            return;
        }

        const editButton = event.target.closest(".btn-edit");
        if (editButton) {
            startEditTeam(
                editButton.dataset.id,
                editButton.dataset.name || "",
                editButton.dataset.description || ""
            );
        }
    });
}
// Ejecutar la función automáticamente al cargar el HTML
document.addEventListener('DOMContentLoaded', async () => {
    const { searchButton, formEquipo, submitBtn } = getFormElements();

    initActionEvents();
    await buildTable();


    if (searchButton) {
        searchButton.addEventListener('click', searchTeam);
    }

    if(formEquipo){
        formEquipo.addEventListener("submit", async (e) =>{
            e.preventDefault();

            const { nameInput, descInput } = getFormElements();

            const editId = formEquipo.getAttribute("data-edit-id");

            const teamData ={
                name: nameInput.value.trim(),
                description: descInput.value.trim()
            };

            if (!teamData.name) {
                alert("Escribe el nombre del equipo.");
                return;
            }

            try{
                if(editId){
                    await teamsService.updateTeam(editId, teamData);
                    alert("Equipo actualizado con exito");

                    formEquipo.removeAttribute("data-edit-id");
                    submitBtn.textContent = "Agregar equipo";
                }else{
                    await teamsService.createTeam(teamData);
                    alert("Equipo creado con exxito");
                }
                //lipiar los campo de la tbla
                formEquipo.reset()
                buildTable();
            }catch(error){
                console.error("Error",error);
            }
        })

    }

    // Función para buscar un equipo por id.
    async function searchTeam() {
        const { teamIdInput, tableBody } = getFormElements();
        if (!tableBody || !teamIdInput) return;

        if (!teamIdInput.value.trim()) {
            buildTable();
            return;
        }

        try {
            const team = await teamsService.getTeamById(teamIdInput.value.trim());
            tableBody.innerHTML = '';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${team.id}</td>
                <td><strong>${team.name}</strong></td>
                <td>${team.description || 'Sin descripción'}</td>
                <td>${team.memberCount ?? 0}</td>
                <td>
                    <button class="btn-edit" data-id="${team.id}" data-name="${team.name}" data-description="${team.description || ''}">Editar</button>
                    <button class="btn-delete" data-id="${team.id}">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#dc3545; font-weight:500;">El ID del equipo no existe.</td></tr>`;
        }
    }
});
