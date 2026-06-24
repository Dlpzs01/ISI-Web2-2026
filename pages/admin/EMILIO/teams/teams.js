import TeamsService from "../../../../shared/services/EMILIO_services/teams.services.js";
import TeamRequest from "../../../../shared/models/request/EMILIO_request/teams.request.js";

const teamService = new TeamsService();
let editingId = null; // Si es null, estamos en modo creacion


// Referencias al DOM
const tableBody = document.getElementById('teams-table-body');
const form = document.getElementById('team-form');
const teamIdInput = document.getElementById('team-id');
const teamNameInput = document.getElementById('team-name');
const teamDescInput = document.getElementById('team-description');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');


// ---- CARGAR Y RENDERIZAR TABLA ----
async function loadTeams() {
    try {
        const teams = await teamService.get();
        renderTable(teams);
        
    } catch (error) {
        alert('Error al cargar equipos: ' + error.message);

    }

}

function renderTable(teams) {
    if (!teams || teams.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">No hay equipos registrados.</td></tr>`;
        return;

    }

    // Generamos las filas con botones usando backticks
    let html = '';

    teams.forEach(team => {
        html += `
            <tr>
                <td>${team.name}</td>
                <td>${team.description || '-'}</td>
                <td>${team.memberCount}</td>
                <td class="actions">
                    <button class="view-btn" data-id="${team.id}">🔎 Ver ID</button>
                    <button class="edit-btn" data-id="${team.id}">✏️ Editar</button>
                    <button class="delete-btn" data-id="${team.id}">🗑️ Eliminar</button>
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;

    // Asignar eventos a los botones (usamos delegacion o asignacion directa)
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => viewTeam(btn.dataset.id));

    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editTeam(btn.dataset.id));

    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteTeam(btn.dataset.id));

    });

}


// ---- VER DETALLE (GET by ID) ----
/*
NOTA: Debido a que este endpoint del profesor siempre envia un json con memberCount = 0 entonces decidi ignorarlo este campo 
y el resto de campos que no son el ID, por ende solo mostrare el resto de campos de teams
*/
async function viewTeam(id) {
    try {
        const team = await teamService.getById(id);

        if(team.description == "" || team.description == null){
            alert(`El ID de éste registro con:\nNombre = ${team.name}\ny con cero Descripción\nes el ${team.id}`);

        }else{
        //alert(`ID: ${team.id}\nNombre: ${team.name}\nDescripción: ${team.description}\nMiembros: ${team.memberCount}`);
        alert(`El ID de éste registro con:\nNombre = ${team.name}\nDescripción = ${team.description}\nes el ${team.id}`);

        }

    } catch (error) {
        alert('Error al obtener el equipo: ' + error.message);

    }

}


// ---- EDITAR (cargar datos en el formulario) ----
async function editTeam(id) {
    try {
        const team = await teamService.getById(id);
        // Rellenar el formulario
        teamIdInput.value = team.id;
        teamNameInput.value = team.name;
        teamDescInput.value = team.description;
        editingId = team.id;
        formTitle.textContent = '✏️ Editar equipo';
        cancelBtn.style.display = 'inline-block';

        // Enfocar el primer campo
        teamNameInput.focus();
        
    } catch (error) {
        alert('Error al cargar equipo para editar: ' + error.message);

    }

}


// ---- CANCELAR EDICION ----
function cancelEdit() {
    // Limpiar formulario
    teamIdInput.value = '';
    teamNameInput.value = '';
    teamDescInput.value = '';
    editingId = null;
    formTitle.textContent = 'Crear nuevo equipo';
    cancelBtn.style.display = 'none';

}


// ---- ELIMINAR ----
async function deleteTeam(id) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el equipo con ID ${id}?`)) {
        return;

    }
    try {
        await teamService.delete(id);
        alert('Equipo eliminado correctamente.');
        
        // Limpiar formulario, cancelar edición y recargar tabla
        cancelEdit();
        await loadTeams();

    } catch (error) {
        alert('Error al eliminar: ' + error.message);

    }
}


// ---- GUARDAR (CREATE o PATCH) ----
async function handleSubmit(event) {
    event.preventDefault();

    const name = teamNameInput.value.trim();
    const description = teamDescInput.value.trim();

    if (!name) {
        alert('El nombre es obligatorio');
        return;

    }

    const teamRequest = new TeamRequest(name, description);

    try {
        if (editingId) {
            // Actualizacion parcial (PUT)
            await teamService.put(editingId, teamRequest);
            alert('Equipo actualizado correctamente.');

        } else {
            // Creación (POST)
            await teamService.create(teamRequest);
            alert('Equipo creado correctamente.');

        }

        // Limpiar formulario, cancelar edición y recargar tabla
        cancelEdit();
        await loadTeams();

    } catch (error) {
        alert('Error al guardar: ' + error.message);

    }
    
}


// ---- EVENTOS ----
form.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', cancelEdit);


// ---- INICIALIZAR ----
loadTeams();