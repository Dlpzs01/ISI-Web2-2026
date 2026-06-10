console.log("¡El archivo admin.js de Justin ha cargado con éxito!");

const BASE_URL = 'http://localhost:3000'; // Ajusta si la API usa otra URL

// Carga inicial
document.addEventListener('DOMContentLoaded', () => {
    getVehicles();
    getUsers();
    
    document.getElementById('form-vehicles').addEventListener('submit', handleVehicleSubmit);
    document.getElementById('form-users').addEventListener('submit', handleUserSubmit);
});

// Forzar a que switchTab sea visible para el HTML pase lo que pase
window.switchTab = function(target) {
    console.log("Cambiando a la pestaña:", target);
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.crud-section').forEach(sec => sec.classList.add('hidden'));

    if (target === 'vehicles') {
        document.getElementById('tab-vehicles').classList.add('active');
        document.getElementById('section-vehicles').classList.remove('hidden');
    } else {
        document.getElementById('tab-users').classList.add('active');
        document.getElementById('section-users').classList.remove('hidden');
    }
}

// ==================== CRUD VEHÍCULOS ====================
let editModeVehicle = false;

async function getVehicles() {
    try {
        const res = await fetch(`${BASE_URL}/vehicles`);
        if (!res.ok) throw new Error('Error al conectar');
        const data = await res.json();
        const tbody = document.getElementById('table-vehicles-body');
        tbody.innerHTML = '';
        data.forEach(v => {
            const id = v.id || v._id;
            tbody.innerHTML += `
                <tr>
                    <td>${id}</td>
                    <td>${v.model || v.name || ''}</td>
                    <td>${v.year || ''}</td>
                    <td>
                        <button class="btn-edit" onclick="loadVehicleEdit('${id}', '${v.model || v.name || ''}', ${v.year || 0})">Editar</button>
                        <button class="btn-delete" onclick="deleteVehicle('${id}')">Eliminar</button>
                    </td>
                </tr>`;
        });
    } catch (err) { 
        console.error("No se pudieron cargar los vehículos:", err); 
    }
}

async function handleVehicleSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('vehicle-id').value;
    const bodyData = {
        model: document.getElementById('vehicle-model').value,
        year: parseInt(document.getElementById('vehicle-year').value)
    };
    const url = editModeVehicle ? `${BASE_URL}/vehicles/${id}` : `${BASE_URL}/vehicles`;
    
    try {
        await fetch(url, {
            method: editModeVehicle ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });
        resetVehicleForm();
        getVehicles();
    } catch (err) {
        console.error("Error al guardar vehículo:", err);
    }
}

window.deleteVehicle = async function(id) {
    if(confirm('¿Eliminar vehículo?')) {
        await fetch(`${BASE_URL}/vehicles/${id}`, { method: 'DELETE' });
        getVehicles();
    }
}

window.loadVehicleEdit = function(id, model, year) {
    document.getElementById('vehicle-id').value = id;
    document.getElementById('vehicle-model').value = model;
    document.getElementById('vehicle-year').value = year;
    editModeVehicle = true;
    document.getElementById('btn-submit-vehicle').textContent = 'Actualizar Vehículo';
    document.getElementById('btn-cancel-vehicle').classList.remove('hidden');
}

window.resetVehicleForm = function() {
    document.getElementById('form-vehicles').reset();
    document.getElementById('vehicle-id').value = '';
    editModeVehicle = false;
    document.getElementById('btn-submit-vehicle').textContent = 'Guardar Vehículo';
    document.getElementById('btn-cancel-vehicle').classList.add('hidden');
}

// ==================== CRUD USUARIOS ====================
let editModeUser = false;

async function getUsers() {
    try {
        const res = await fetch(`${BASE_URL}/users`);
        if (!res.ok) throw new Error('Error al conectar');
        const data = await res.json();
        const tbody = document.getElementById('table-users-body');
        tbody.innerHTML = '';
        data.forEach(u => {
            const id = u.id || u._id;
            tbody.innerHTML += `
                <tr>
                    <td>${id}</td>
                    <td>${u.name || ''}</td>
                    <td>${u.email || ''}</td>
                    <td>
                        <button class="btn-edit" onclick="loadUserEdit('${id}', '${u.name || ''}', '${u.email || ''}')">Editar</button>
                        <button class="btn-delete" onclick="deleteUser('${id}')">Eliminar</button>
                    </td>
                </tr>`;
        });
    } catch (err) { 
        console.error("No se pudieron cargar los usuarios:", err); 
    }
}

async function handleUserSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('user-id').value;
    const bodyData = {
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value
    };
    const url = editModeUser ? `${BASE_URL}/users/${id}` : `${BASE_URL}/users`;
    
    try {
        await fetch(url, {
            method: editModeUser ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });
        resetUserForm();
        getUsers();
    } catch (err) {
        console.error("Error al guardar usuario:", err);
    }
}

window.deleteUser = async function(id) {
    if(confirm('¿Eliminar usuario?')) {
        await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
        getUsers();
    }
}

window.loadUserEdit = function(id, name, email) {
    document.getElementById('user-id').value = id;
    document.getElementById('user-name').value = name;
    document.getElementById('user-email').value = email;
    editModeUser = true;
    document.getElementById('btn-submit-user').textContent = 'Actualizar Usuario';
    document.getElementById('btn-cancel-user').classList.remove('hidden');
}

window.resetUserForm = function() {
    document.getElementById('form-users').reset();
    document.getElementById('user-id').value = '';
    editModeUser = false;
    document.getElementById('btn-submit-user').textContent = 'Guardar Usuario';
    document.getElementById('btn-cancel-user').classList.add('hidden');
}