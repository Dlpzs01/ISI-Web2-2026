import TeamsService from "../../../shared/services/teams.service.js";
import TeamRequest from "../../../shared/models/request/team.request.js";

const teamsService = new TeamsService();

// Referencias al DOM 
const form        = document.getElementById('team-form');
const formTitle   = document.getElementById('form-title');
const submitBtn   = document.getElementById('submit-btn');
const cancelBtn   = document.getElementById('cancel-btn');
const teamIdInput = document.getElementById('team-id');
const nameInput   = document.getElementById('team-name');
const descInput   = document.getElementById('team-description');
const message     = document.getElementById('form-message');
const tableBody   = document.getElementById('teams-table-body');

function showMessage(text, type = 'success') {
    message.textContent = text;
    message.className = `message ${type}`;
    setTimeout(() => { message.textContent = ''; message.className = 'message'; }, 3000);
}

//Cargar y renderizar tabla
async function buildTable() {
    tableBody.innerHTML = '<tr><td colspan="5" class="empty">Cargando...</td></tr>';
    try {
        const teams = await teamsService.get();
        tableBody.innerHTML = '';

        if (teams.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="empty">No hay teams todavía.</td></tr>';
            return;
        }

        teams.forEach(team => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${team.id}</td>
                <td>${team.name}</td>
                <td>${team.description ?? ''}</td>
                <td>${team.memberCount}</td>
                <td class="actions">
                    <button class="btn-edit">Editar</button>
                    <button class="btn-delete">Eliminar</button>
                </td>
            `;

            row.querySelector('.btn-edit').addEventListener('click', () => startEdit(team));
            row.querySelector('.btn-delete').addEventListener('click', () => handleDelete(team.id, team.name));

            tableBody.appendChild(row);
        });
    } catch (e) {
        tableBody.innerHTML = `<tr><td colspan="5" class="empty">Error: ${e.message}</td></tr>`;
    }
}

// ── Crear o editar ──────────────────────────────────────────────
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id   = teamIdInput.value;
    const name = nameInput.value.trim();
    const desc = descInput.value.trim();

    if (!name) { showMessage('El nombre es obligatorio.', 'error'); return; }

    const teamRequest = new TeamRequest(name, desc);

    try {
        if (id) {
            // PUT — editar
            await teamsService.update(id, teamRequest);
            showMessage('Team actualizado correctamente.');
        } else {
            // POST — crear
            await teamsService.create(teamRequest);
            showMessage('Team creado correctamente.');
        }
        resetForm();
        await buildTable();
    } catch (e) {
        showMessage(e.message, 'error');
    }
});

// ── Iniciar edición ─────────────────────────────────────────────
function startEdit(team) {
    teamIdInput.value = team.id;
    nameInput.value   = team.name;
    descInput.value   = team.description ?? '';

    formTitle.textContent  = 'Editar Team';
    submitBtn.textContent  = 'Guardar cambios';
    cancelBtn.style.display = 'inline-block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Cancelar edición ────────────────────────────────────────────
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    teamIdInput.value = '';
    nameInput.value   = '';
    descInput.value   = '';

    formTitle.textContent   = 'Crear Team';
    submitBtn.textContent   = 'Crear';
    cancelBtn.style.display = 'none';
}

// ── Eliminar ────────────────────────────────────────────────────
async function handleDelete(id, name) {
    if (!confirm(`¿Eliminar el team "${name}"?`)) return;
    try {
        await teamsService.delete(id);
        showMessage(`Team "${name}" eliminado.`);
        await buildTable();
    } catch (e) {
        showMessage(e.message, 'error');
    }
}

// ── Iniciar ─────────────────────────────────────────────────────
buildTable();