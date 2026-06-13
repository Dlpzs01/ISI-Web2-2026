const BASE_URL = 'https://localhost:7286/api/teams';


function getHeaders() {
    const h = { 'Content-Type': 'application/json' };
    const raw = localStorage.getItem('token');
    if (raw) {
        try {
            const t = JSON.parse(raw);
            if (t?.token) h['Authorization'] = `Bearer ${t.token}`;
        } catch (e) {}
    }
    return h;
}

// elementos del DOM 
const tbody    = document.getElementById('tbody');
const inpNombre = document.getElementById('inp-nombre');
const inpDesc   = document.getElementById('inp-desc');
const btnAgregar = document.getElementById('btn-agregar');

// estado local 
let equipos = [];

// LISTAR
async function cargar() {
    try {
        const res = await fetch(BASE_URL, {
            method: 'GET',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Error al cargar.');
        equipos = await res.json();
        render();
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="5">Error: ${e.message}</td></tr>`;
    }
}

// RENDER
function render() {
    tbody.innerHTML = '';
    equipos.forEach(eq => tbody.appendChild(crearFila(eq)));
}

function crearFila(eq) {
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${eq.id}</td>
        <td class="celda-nombre">${eq.name}</td>
        <td class="celda-desc">${eq.description}</td>
        <td>${eq.memberCount}</td>
        <td>
            <button class="btn-editar">Editar</button>
            <button class="btn-eliminar">Eliminar</button>
        </td>
    `;

    tr.querySelector('.btn-editar').addEventListener('click', () => modoEdicion(tr, eq));
    tr.querySelector('.btn-eliminar').addEventListener('click', () => eliminar(eq.id));

    return tr;
}

// EDITAR
function modoEdicion(tr, eq) {
    tr.querySelector('.celda-nombre').innerHTML = `<input type="text" value="${eq.name}" />`;
    tr.querySelector('.celda-desc').innerHTML   = `<input type="text" value="${eq.description}" />`;

    const tdAccion = tr.querySelector('td:last-child');
    tdAccion.innerHTML = `
        <button class="btn-guardar">Guardar</button>
        <button class="btn-cancelar">Cancelar</button>
    `;

    tdAccion.querySelector('.btn-guardar').addEventListener('click', async () => {
        const nuevoNombre = tr.querySelector('.celda-nombre input').value.trim();
        const nuevaDesc   = tr.querySelector('.celda-desc input').value.trim();

        if (!nuevoNombre || !nuevaDesc) {
            alert('Los campos no pueden estar vacíos.');
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/${eq.id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ name: nuevoNombre, description: nuevaDesc })
            });
            if (!res.ok) throw new Error('Error al actualizar.');
            await cargar(); // recarga desde el servidor
        } catch (e) {
            alert(`Error: ${e.message}`);
        }
    });

    tdAccion.querySelector('.btn-cancelar').addEventListener('click', () => render());
}

// ELIMINAR 
async function eliminar(id) {
    if (!confirm(`¿Eliminar el equipo con ID ${id}?`)) return;

    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Error al eliminar.');
        await cargar(); // recarga desde el servidor
    } catch (e) {
        alert(`Error: ${e.message}`);
    }
}

// CREAR
btnAgregar.addEventListener('click', async () => {
    const nombre = inpNombre.value.trim();
    const desc   = inpDesc.value.trim();

    if (!nombre || !desc) {
        alert('Completa los campos.');
        return;
    }

    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ name: nombre, description: desc })
        });
        if (!res.ok) throw new Error('Error al crear.');
        inpNombre.value = '';
        inpDesc.value   = '';
        await cargar(); // recarga desde el servidor
    } catch (e) {
        alert(`Error: ${e.message}`);
    }
});

// Carga inicial
cargar();