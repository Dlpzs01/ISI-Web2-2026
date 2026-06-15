import TeamsService from "/shared/services/teams.service.js";
import TeamRequest from "/shared/models/request/team.request.js";

// CORREGIDO: Apuntar al endpoint real de la API, no al HTML de Swagger
const API_URL = "https://localhost:44373/api/Teams";
let teams = [];
let editandoId = null;


const getHeaders = (includeContentType = false) => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    const token = tokenData?.token;
    const headers = { "Authorization": `Bearer ${token}` };
    if (includeContentType) headers["Content-Type"] = "application/json";
    return headers;
};


window.onload = function () {
    const tokenData = localStorage.getItem("token");
    if (!tokenData) {
        alert("Acceso denegado. Por favor inicia sesión.");
        window.location.href = window.location.origin + '/login.html'; 
        return;
    }
    cargarTeams();
};


async function apiFetch(url, method = "GET", body = null) {
    try {
        const config = { method, headers: getHeaders(!!body) };
        if (body) config.body = JSON.stringify(body);

        const response = await fetch(url, config);
        
        // Manejo explícito por si el token expiró o es inválido
        if (response.status === 401) {
            throw new Error("No autorizado: Sesión inválida o expirada.");
        }
        
        if (!response.ok) throw new Error(`Error en la acción: ${method}`);
        
        return response.status !== 200 ? await response.json() : true;
    } catch (error) {
        console.error(error);
        mostrarMensaje(error.message || "Error al procesar la solicitud en el servidor", true);
        return null;
    }
}


async function cargarTeams() {
    const data = await apiFetch(API_URL);
    if (data) {
        teams = data;
        mostrarTeams(teams);
    }
}


function mostrarTeams(lista) {
    const columnas = { pendiente: "", progreso: "", completada: "" };
    const contadores = { pendiente: 0, progreso: 0, completada: 0 };

    lista.forEach(team => {
        // CORREGIDO: Manejo flexible por si tu API devuelve las llaves en minúscula o mayúscula
        const id = team.id || team.Id;
        const name = team.name || team.Name;
        const description = team.description || team.Description;
        const estado = (team.status || team.Status || "pendiente").toLowerCase(); 
        
        if (contadores[estado] !== undefined) {
            contadores[estado]++;
        }

        columnas[estado] += `
        <div class="task-card">
            <h4>${name}</h4>
            <p style="font-size: 0.85rem; color: #666; margin: 4px 0 12px 0;">${description || 'Sin descripción'}</p>
            <div class="actions">
                <button onclick="cambiarEstado(${id}, '${estado}')">➡ Mover</button>
                <button onclick="editarTeam(${id}, '${name}', '${description}')">✏</button>
                <button onclick="eliminarTeam(${id})">❌</button>
            </div>
        </div>`;
    });

    document.getElementById("totalTareas").innerText = `Total de equipos: ${lista.length}`;
    ["pendiente", "progreso", "completada"].forEach(est => {
        document.getElementById(`tasks-${est}`).innerHTML = columnas[est];
        document.getElementById(`count-${est}`).innerText = contadores[est];
    });
}


async function guardarTeam() {
    const nombre = document.getElementById("teamName").value.trim();
    const descripcion = document.getElementById("teamDescription").value.trim();

    if (!nombre || !descripcion) {
        return mostrarMensaje("Debe ingresar nombre y descripción", true);
    }

    // CORREGIDO: Ajuste de la barra '/' en la URL para evitar rutas mal formadas
    const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;
    const metodo = editandoId ? "PUT" : "POST";
    
    // CORREGIDO: Propiedades con Mayúscula para hacer Match perfecto con tus clases de C# (.NET)
    const payload = { 
        Name: nombre, 
        Description: descripcion,
        Status: "pendiente" // Estado por defecto al crear
    };
    
    if (editandoId) {
        payload.Id = editandoId; 
    }

    const exito = await apiFetch(url, metodo, payload);
    if (exito !== null) {
        mostrarMensaje(editandoId ? "Equipo actualizado" : "Equipo creado");
        document.getElementById("teamName").value = "";
        document.getElementById("teamDescription").value = "";
        editandoId = null;
        cargarTeams();
    }
}


function editarTeam(id, nombre, descripcion) {
    editandoId = id;
    document.getElementById("teamName").value = nombre;
    document.getElementById("teamDescription").value = descripcion;
}

async function cambiarEstado(id, estadoActual) {
    const estados = ["pendiente", "progreso", "completada"];
    const siguienteEstado = estados[(estados.indexOf(estadoActual) + 1) % estados.length];
    
    // Buscar el equipo actual
    const team = teams.find(t => (t.id || t.Id) === id);
    if (team) {
        // CORREGIDO: Mapear el objeto completo respetando las mayúsculas de C# antes de enviarlo
        const payloadActualizado = {
            Id: id,
            Name: team.name || team.Name,
            Description: team.description || team.Description,
            Status: siguienteEstado
        };

        const exito = await apiFetch(`${API_URL}/${id}`, "PUT", payloadActualizado);
        if (exito !== null) cargarTeams();
    }
}

async function eliminarTeam(id) {
    if (!confirm("¿Desea eliminar este equipo?")) return;
    const exito = await apiFetch(`${API_URL}/${id}`, "DELETE");
    if (exito !== null) {
        mostrarMensaje("Equipo eliminado");
        cargarTeams();
    }
}


function buscarTeam() {
    const texto = document.getElementById("buscar").value.toLowerCase();
    mostrarTeams(teams.filter(t => {
        const name = t.name || t.Name || "";
        return name.toLowerCase().includes(texto);
    }));
}


function mostrarMensaje(mensaje, error = false) {
    const elemento = document.getElementById("mensaje");
    elemento.innerText = mensaje;
    elemento.style.color = error ? "red" : "green";
    setTimeout(() => { elemento.innerText = ""; }, 3000);
}


window.guardarTeam = guardarTeam;
window.editarTeam = editarTeam;
window.eliminarTeam = eliminarTeam;
window.buscarTeam = buscarTeam;
window.cambiarEstado = cambiarEstado;