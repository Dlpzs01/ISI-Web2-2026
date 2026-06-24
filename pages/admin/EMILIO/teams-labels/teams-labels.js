import Teams_LabelsService from "../../../../shared/services/EMILIO_services/teams-labels.services.js";
import Team_LabelRequest from "../../../../shared/models/request/EMILIO_request/teams-labels.request.js";

const team_labelService = new Teams_LabelsService();
let editingId = null;
let currentTeamId = null;

// Referencias al DOM
const tableBody = document.getElementById('teams_labels-table-body');
const form = document.getElementById('team_label-form');
const team_labelIdInput = document.getElementById('team_label-id');
const team_labelNameInput = document.getElementById('team_label-name');
const team_labelColorInput = document.getElementById('team_label-color');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');
const searchContainer = document.getElementById('search-container');
const formContainer = document.getElementById('form-container');
const teamIdInput = document.getElementById('team_label-teamId');
const confirmBtn = document.getElementById('confirm-teamId-btn');
const backToSearchBtn = document.getElementById('back-to-search-btn');


// ---- FUNCION PARA MOSTRAR MENSAJE EN TABLA ----
function showEmptyMessage(message) {
    tableBody.innerHTML = `<tr><td colspan="3">${message}</td></tr>`;

}


// ---- CARGAR Y RENDERIZAR TABLA (con teamId) ----
async function loadTeams_Labels(teamId) {
    if (!teamId) {
        showEmptyMessage('Por favor, ingresa un teamId válido.');
        return;

    }
    try {
        const teams_labels = await team_labelService.getById(teamId);
        renderTable(teams_labels, teamId);

    } catch (error) {
        console.error('Error al cargar labels:', error);
        alert('Error al cargar labels de teams: ' + error.message);

        if (error.message.includes('404')) {
            showEmptyMessage(`No se encontraron labels para el teamId ${teamId}.`);

        } else {
            showEmptyMessage('Error: ' + error.message);

        }

    }

}

function renderTable(teams_labels, teamId) {
    if (!teams_labels || teams_labels.length === 0) {
        showEmptyMessage(`No hay labels registrados para el teamId ${teamId}.`);
        return;

    }

    let html = '';
    teams_labels.forEach(team_label => {
        html += `
    <tr>
        <td>${team_label.name}</td>
        <td>${team_label.color}</td>
        <td class="actions">
            <button class="view-btn" data-label='${JSON.stringify(team_label)}'>🔎 Ver ID</button>
            <button class="edit-btn" data-label='${JSON.stringify(team_label)}'>✏️ Editar</button>
            <button class="delete-btn" data-teamid="${teamId}" data-id="${team_label.id}">🗑️ Eliminar</button>
        </td>
    </tr>
    `;
    });
    tableBody.innerHTML = html;

    // Asignar eventos a los botones
    document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const label = JSON.parse(btn.dataset.label);
        viewTeam_Label(label);

        });

    });

document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const label = JSON.parse(btn.dataset.label);
        editTeam_Label(label);

        });

    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteTeam_Label(btn.dataset.teamid, btn.dataset.id));

    });

}


// ---- VER DETALLE (GET by ID) ----
function viewTeam_Label(label) {
    alert(`ID del label: ${label.id}\nNombre: ${label.name}\nColor: ${label.color}\nNormalizado: ${label.normalizedName}\nCreado: ${label.createdAt}\nActualizado: ${label.updatedAt}`);

}

function editTeam_Label(label) {
    team_labelIdInput.value = label.id;
    team_labelNameInput.value = label.name;
    team_labelColorInput.value = label.color;
    editingId = label.id;
    formTitle.textContent = `✏️ Editar label de equipo ${currentTeamId}`;
    cancelBtn.style.display = 'inline-block';
    team_labelNameInput.focus();

}


// ---- CANCELAR EDICION ----
function cancelEdit() {
    team_labelIdInput.value = '';
    team_labelNameInput.value = '';
    team_labelColorInput.value = '';
    editingId = null;
    formTitle.textContent = `Crear nuevo label de equipo ${currentTeamId}`;
    cancelBtn.style.display = 'none';

}


// ---- ELIMINAR ----
async function deleteTeam_Label(teamId, id) {
    if (!id) {
        alert('ID del label no válido para eliminar.');
        return;

    }

    if (!confirm(`¿Estás seguro que deseas eliminar el label con ID ${id} del teamId ${teamId}?`)) {
        return;

    }

    try {
        await team_labelService.delete(teamId, id);
        alert('Label de equipo eliminado correctamente.');

        // Recargar la tabla con el mismo teamId
        await loadTeams_Labels(teamId);

    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar: ' + error.message);

    }

    cancelEdit();

}


// ---- GUARDAR (CREATE o PUT) ----
async function handleSubmit(event) {
    event.preventDefault();

    if (!currentTeamId) {
        alert('No hay un teamId válido. Por favor, confirma un teamId primero.');
        return;

    }

    const name = team_labelNameInput.value.trim();
    const color = team_labelColorInput.value.trim();

    if (!name || !color) {
        alert('Nombre y color son obligatorios.');
        return;

    }

    const team_labelRequest = new Team_LabelRequest(name, color);
    console.log('📦 Enviando al servidor:', team_labelRequest.toJson());

    try {
        if (editingId) {
            // Actualizacion completa (PUT)
            await team_labelService.put(currentTeamId, editingId, team_labelRequest);
            alert('Label de equipo actualizado correctamente.');

            // Recargar la tabla después de actualizar
            await loadTeams_Labels(currentTeamId);
            cancelEdit();

        } else {
            // Creacion (POST)
            await team_labelService.create(currentTeamId, team_labelRequest);
            alert('Label de equipo creado correctamente.');
            
            // Volver al formulario de busqueda despues de crear
            //goBackToSearch();
            cancelEdit();
            loadTeams_Labels(currentTeamId);
            
            return; // Salir para que no ejecute el codigo de abajo

        }
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);

    }

}


// ---- FUNCIONES PARA MOSTRAR/OCULTAR FORMULARIOS ----
function showFormContainer() {
    searchContainer.style.display = 'none';
    formContainer.style.display = 'block';
    // Mostrar el teamId en el titulo cuando se abre el formulario
    formTitle.textContent = `Crear nuevo label de equipo ${currentTeamId}`;

}

function showSearchContainer() {
    searchContainer.style.display = 'flex';
    formContainer.style.display = 'none';
    showEmptyMessage('Ingresa un teamId para ver sus labels.');
    cancelEdit();
    teamIdInput.value = '';
    currentTeamId = null;

}

// ---- VALIDAR Y CARGAR AL CONFIRMAR TEAM ID ----
async function confirmTeamId() {
    const teamId = parseInt(teamIdInput.value.trim());

    if (!teamId || isNaN(teamId)) {
        alert('Por favor, ingresa un número de teamId válido.');
        return;

    }

    try {
        // Validar que el equipo existe
        const { default: TeamsService } = await import('../../../../shared/services/EMILIO_services/teams.services.js');

        const teamsService = new TeamsService();
        await teamsService.getById(teamId);

        // Si existe, continuamos
        currentTeamId = teamId;
        showFormContainer();
        await loadTeams_Labels(teamId);

    } catch (error) {
        console.error('Error al validar teamId:', error);
        alert(`El teamId ${teamId} no existe o no se pudo validar. Error: ${error.message}`);

    }

}


// --- Funcion goBackToSearch ---
function goBackToSearch() {
    showSearchContainer();
    // Limpiar cualquier estado pendiente
    editingId = null;
    currentTeamId = null;
    cancelEdit();
}


// ---- EVENTOS ----
form.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', cancelEdit);
confirmBtn.addEventListener('click', confirmTeamId);
backToSearchBtn.addEventListener('click', goBackToSearch);


// ---- INICIALIZAR ----
showSearchContainer();