import TeamsService from "../../../shared/services/teams.service.js";
import TeamRequest from "../../../shared/models/request/team.request.js";
import MembersService from "../../../shared/services/member.services.js";
import MemberRequest from "../../../shared/models/request/member.request.js";

const teamsService  = new TeamsService();
const membersService = new MembersService();

// Referencias DOM Teams 
const form        = document.getElementById('team-form');
const formTitle   = document.getElementById('form-title');
const submitBtn   = document.getElementById('submit-btn');
const cancelBtn   = document.getElementById('cancel-btn');
const teamIdInput = document.getElementById('team-id');
const nameInput   = document.getElementById('team-name');
const descInput   = document.getElementById('team-description');
const message     = document.getElementById('form-message');
const tableBody   = document.getElementById('teams-table-body');

// Referencias DOM Members 
const membersSection   = document.getElementById('members-section');
const membersTitle     = document.getElementById('members-title');
const currentTeamId    = document.getElementById('current-team-id');
const memberUserIdInput = document.getElementById('member-user-id');
const memberRoleInput  = document.getElementById('member-role');
const addMemberBtn     = document.getElementById('add-member-btn');
const closeMembersBtn  = document.getElementById('close-members-btn');
const memberMessage    = document.getElementById('member-message');
const membersTableBody = document.getElementById('members-table-body');

// Mensajes 
function showMessage(text, type = 'success') {
    message.textContent = text;
    message.className = `message ${type}`;
    setTimeout(() => { message.textContent = ''; message.className = 'message'; }, 3000);
}

function showMemberMessage(text, type = 'success') {
    memberMessage.textContent = text;
    memberMessage.className = `message ${type}`;
    setTimeout(() => { memberMessage.textContent = ''; memberMessage.className = 'message'; }, 3000);
}

// Teams: Cargar tabla 
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
                    <button class="btn-members">Miembros</button>
                    <button class="btn-edit">Editar</button>
                    <button class="btn-delete">Eliminar</button>
                </td>
            `;

            row.querySelector('.btn-members').addEventListener('click', () => openMembers(team));
            row.querySelector('.btn-edit').addEventListener('click', () => startEdit(team));
            row.querySelector('.btn-delete').addEventListener('click', () => handleDelete(team.id, team.name));

            tableBody.appendChild(row);
        });
    } catch (e) {
        tableBody.innerHTML = `<tr><td colspan="5" class="empty">Error: ${e.message}</td></tr>`;
    }
}

// Teams: Crear o editar
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id   = teamIdInput.value;
    const name = nameInput.value.trim();
    const desc = descInput.value.trim();

    if (!name) { showMessage('El nombre es obligatorio.', 'error'); return; }

    const teamRequest = new TeamRequest(name, desc);
    try {
        if (id) {
            await teamsService.update(id, teamRequest);
            showMessage('Team actualizado correctamente.');
        } else {
            await teamsService.create(teamRequest);
            showMessage('Team creado correctamente.');
        }
        resetForm();
        await buildTable();
    } catch (e) {
        showMessage(e.message, 'error');
    }
});

function startEdit(team) {
    teamIdInput.value = team.id;
    nameInput.value   = team.name;
    descInput.value   = team.description ?? '';
    formTitle.textContent   = 'Editar Team';
    submitBtn.textContent   = 'Guardar cambios';
    cancelBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    teamIdInput.value = '';
    nameInput.value   = '';
    descInput.value   = '';
    formTitle.textContent   = 'Crear Team';
    submitBtn.textContent   = 'Crear';
    cancelBtn.style.display = 'none';
}

async function handleDelete(id, name) {
    if (!confirm(`¿Eliminar el team "${name}"?`)) return;
    try {
        await teamsService.delete(id);
        showMessage(`Team "${name}" eliminado.`);
        membersSection.style.display = 'none';
        await buildTable();
    } catch (e) {
        showMessage(e.message, 'error');
    }
}

// Members: Abrir sección
async function openMembers(team) {
    currentTeamId.value = team.id;
    membersTitle.textContent = `Miembros — ${team.name}`;
    membersSection.style.display = 'block';
    membersSection.scrollIntoView({ behavior: 'smooth' });
    await buildMembersTable(team.id);
}

closeMembersBtn.addEventListener('click', () => {
    membersSection.style.display = 'none';
    memberUserIdInput.value = '';
    memberRoleInput.value   = '';
});

// Members: Cargar tabla 
async function buildMembersTable(teamId) {
    membersTableBody.innerHTML = '<tr><td colspan="5" class="empty">Cargando...</td></tr>';
    try {
        const members = await membersService.getByTeam(teamId);
        membersTableBody.innerHTML = '';

        if (members.length === 0) {
            membersTableBody.innerHTML = '<tr><td colspan="5" class="empty">No hay miembros.</td></tr>';
            return;
        }

        members.forEach(m => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${m.userId}</td>
                <td>${m.displayName ?? ''}</td>
                <td>${m.email ?? ''}</td>
                <td>${m.role ?? ''}</td>
                <td class="actions">
                    <button class="btn-delete">Quitar</button>
                </td>
            `;
            row.querySelector('.btn-delete').addEventListener('click', () => handleRemoveMember(teamId, m.userId, m.displayName));
            membersTableBody.appendChild(row);
        });
    } catch (e) {
        membersTableBody.innerHTML = `<tr><td colspan="5" class="empty">Error: ${e.message}</td></tr>`;
    }
}

// Members: Agregar 
addMemberBtn.addEventListener('click', async () => {
    const teamId = currentTeamId.value;
    const userId = parseInt(memberUserIdInput.value);
    const role   = memberRoleInput.value.trim();

    if (!userId || !role) { showMemberMessage('User ID y rol son obligatorios.', 'error'); return; }

    const memberRequest = new MemberRequest(userId, role);
    try {
        await membersService.add(teamId, memberRequest);
        showMemberMessage('Miembro agregado.');
        memberUserIdInput.value = '';
        memberRoleInput.value   = '';
        await buildMembersTable(teamId);
        await buildTable();
    } catch (e) {
        showMemberMessage(e.message, 'error');
    }
});

// Members: Quitar
async function handleRemoveMember(teamId, userId, name) {
    if (!confirm(`¿Quitar a "${name}" del team?`)) return;
    try {
        await membersService.remove(teamId, userId);
        showMemberMessage('Miembro eliminado.');
        await buildMembersTable(teamId);
        await buildTable();
    } catch (e) {
        showMemberMessage(e.message, 'error');
    }
}

// Iniciar
buildTable();