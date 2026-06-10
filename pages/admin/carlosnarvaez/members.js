

// 1. IMPORTAMOS ÚNICAMENTE EL SERVICIO HTTP BASE DE LA APP
import HttpService from "../../../shared/services/http.service.js";

// 2. RECREAMOS LA CLASE DEL SERVICIO DIRECTAMENTE AQUÍ PARA EVITAR OTROS ARCHIVOS
class MembersService extends HttpService {
    // Usamos la ruta exacta del endpoint de miembros del profesor
endpoint = '/Teams/1/members';

    async getAll() {
        const json = await super.get(this.endpoint);
        return json || [];
    }

    async create(payload) {
        return await super.post(this.endpoint, payload);
    }

    async update(userId, payload) {
        return await super.put(`${this.endpoint}/${userId}`, payload);
    }

    async delete(userId) {
        return await super.delete(`${this.endpoint}/${userId}`);
    }
}

const service = new MembersService();

// 3. CAPTURA DE LOS INPUTS Y ELEMENTOS DEL HTML
const txtId = document.getElementById("userId");
const txtName = document.getElementById("firstName");
const txtLastName = document.getElementById("lastName");
const txtRole = document.getElementById("role");
const contenedor = document.getElementById("miembros-lista");

// 4. FUNCIÓN PARA PINTAR LOS MIEMBROS EN FORMA DE TARJETAS (DIFERENTE AL PROFE)
async function renderizarMiembros() {
    try {
        const miembros = await service.getAll();
        contenedor.innerHTML = ""; // Limpiar antes de renderizar

        if (miembros.length === 0) {
            contenedor.innerHTML = "<p>No hay miembros registrados todavía.</p>";
            return;
        }

        // Iteramos y creamos bloques HTML usando strings (sin createElement)
        miembros.forEach(function(m) {
            const htmlCard = `
                <div style="border: 1px solid #000; padding: 10px; margin: 10px 0; max-width: 300px;">
                    <p><b>ID:</b> ${m.id}</p>
                    <p><b>Nombre:</b> ${m.firstName} ${m.lastName}</p>
                    <p><b>Rol:</b> ${m.role}</p>
                    <button class="btn-borrar" data-id="${m.id}">Eliminar</button>
                </div>
            `;
            contenedor.innerHTML += htmlCard;
        });

        // Asignamos la función de eliminar a cada botón de las tarjetas
        const botonesBorrar = document.querySelectorAll(".btn-borrar");
        botonesBorrar.forEach(function(boton) {
            boton.addEventListener("click", async function() {
                const id = boton.getAttribute("data-id");
                try {
                    await service.delete(id);
                    alert("Miembro con ID " + id + " eliminado con éxito.");
                    renderizarMiembros(); // Recargar la lista automáticamente
                } catch (err) {
                    alert("Error al eliminar: " + err.message);
                }
            });
        });

    } catch (error) {
        contenedor.innerHTML = "<p style='color:red;'>Error al conectar con la API. Revisa que el backend en Visual Studio esté corriendo.</p>";
    }
}

// 5. EVENTOS DE LOS BOTONES DEL FORMULARIO
document.getElementById("btnGet").addEventListener("click", renderizarMiembros);

document.getElementById("btnPost").addEventListener("click", async function() {
    try {
        const payload = {
            firstName: txtName.value,
            lastName: txtLastName.value,
            role: txtRole.value
        };
        await service.create(payload);
        alert("¡Miembro registrado correctamente!");
        renderizarMiembros(); // Recargar lista
    } catch (err) {
        alert("Error al registrar: " + err.message);
    }
});

document.getElementById("btnPut").addEventListener("click", async function() {
    try {
        if (!txtId.value) return alert("Por favor, escribe un ID en la primera caja para modificar.");
        
        const payload = {
            firstName: txtName.value,
            lastName: txtLastName.value,
            role: txtRole.value
        };
        await service.update(txtId.value, payload);
        alert("¡Miembro modificado con éxito!");
        renderizarMiembros(); // Recargar lista
    } catch (err) {
        alert("Error al modificar: " + err.message);
    }
});

// Carga inicial automática al abrir la pantalla
renderizarMiembros();