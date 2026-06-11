
import { membersService } from "./service.js"; 

const contenedor = document.getElementById("miembros-lista");

// --- FUNCIÓN PARA PINTAR LAS TARJETAS ---
async function renderizarMiembros() {
    try {
        const miembros = await membersService.getAll();
        contenedor.innerHTML = ""; 

        if (miembros.length === 0) {
            contenedor.innerHTML = "<p>No hay miembros registrados todavía.</p>";
            return;
        }

        miembros.forEach(function(m) {
            const card = document.createElement("div");
            card.style.border = "1px solid #ccc";
            card.style.padding = "15px";
            card.style.margin = "10px 0";
            card.style.maxWidth = "300px";
            card.style.borderRadius = "8px";

            
            card.innerHTML = `
                <p><b>ID:</b> ${m.id}</p>
                <p><b>Nombre Completo:</b> ${m.fullName}</p>
                <p><b>Rol:</b> ${m.role}</p>
            `;

            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.style.marginRight = "8px";
            botonEditar.addEventListener("click", function() {
                abrirModal(m);
            });

            
            const botonBorrar = document.createElement("button");
            botonBorrar.textContent = "Eliminar";
            botonBorrar.style.backgroundColor = "#ff4d4d";
            botonBorrar.style.color = "white";

            botonBorrar.addEventListener("click", async function() {
                if (confirm(`¿Estás seguro de que deseas eliminar a ${m.firstName}?`)) {
                    try {
                        await membersService.delete(m.id);
                        alert("Miembro eliminado con éxito.");
                        renderizarMiembros(); 
                    } catch (err) {
                        alert("Error al eliminar: " + err.message);
                    }
                }
            });

            card.appendChild(botonEditar);
            card.appendChild(botonBorrar);
            contenedor.appendChild(card);
        });

    } catch (error) {
        contenedor.innerHTML = "<p style='color:red;'>Error al conectar con la API.</p>";
    }
}

// --- FUNCIÓN DEL MODAL INTEGRADO ---
function abrirModal(miembroAEditar = null) {
    const modalExistente = document.getElementById("modal-dinamico");
    if (modalExistente) modalExistente.remove();

    const modalBg = document.createElement("div");
    modalBg.id = "modal-dinamico";
    modalBg.style.position = "fixed";
    modalBg.style.top = "0";
    modalBg.style.left = "0";
    modalBg.style.width = "100%";
    modalBg.style.height = "100%";
    modalBg.style.backgroundColor = "rgba(0,0,0,0.5)";
    modalBg.style.display = "flex";
    modalBg.style.justifyContent = "center";
    modalBg.style.alignItems = "center";
    modalBg.style.zIndex = "1000";

    const modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "white";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "8px";
    modalContent.style.width = "300px";

    const tituloModal = miembroAEditar ? "Modificar Miembro" : "Registrar Miembro";

    modalContent.innerHTML = `
        <h3 style="margin-top:0;">${tituloModal}</h3>
        
        <label>Nombre:</label><br>
        <input type="text" id="modal-firstName" value="${miembroAEditar ? miembroAEditar.firstName : ''}" style="width:100%; margin-bottom:10px;"><br>
        
        <label>Apellido:</label><br>
        <input type="text" id="modal-lastName" value="${miembroAEditar ? miembroAEditar.lastName : ''}" style="width:100%; margin-bottom:10px;"><br>
        
        <label>Rol:</label><br>
        <input type="text" id="modal-role" value="${miembroAEditar ? miembroAEditar.role : ''}" style="width:100%; margin-bottom:20px;"><br>
        
        <div style="text-align: right;">
            <button id="modal-btnCancelar" style="margin-right:10px;">Cancelar</button>
            <button id="modal-btnGuardar" style="background-color:#4CAF50; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Guardar</button>
        </div>
    `;

    modalBg.appendChild(modalContent);
    document.body.appendChild(modalBg);

    document.getElementById("modal-btnCancelar").addEventListener("click", () => modalBg.remove());

document.getElementById("modal-btnGuardar").addEventListener("click", async function() {
    const firstNameVal = document.getElementById("modal-firstName").value.trim();
    const lastNameVal = document.getElementById("modal-lastName").value.trim();
    const roleVal = document.getElementById("modal-role").value.trim();

    if (!firstNameVal || !lastNameVal || !roleVal) {
        alert("Por favor, rellene todos los campos (Nombre, Apellido y Rol). No se permiten campos vacíos.");
        return; 
    }

    const payload = {
        firstName: firstNameVal,
        lastName: lastNameVal,
        role: roleVal
    };

    try {
        if (miembroAEditar) {
            await membersService.update(miembroAEditar.id, payload);
            alert("¡Miembro modificado con éxito!");
        } else {
            await membersService.create(payload);
            alert("¡Miembro registrado correctamente!");
        }
        modalBg.remove(); 
        renderizarMiembros(); 
    } catch (err) {
        alert("Error al guardar: " + err.message);
    }
});
}

const btnAgregar = document.getElementById("btnGet"); 
if (btnAgregar) {
    btnAgregar.textContent = "Agregar Nuevo Miembro"; 
    btnAgregar.addEventListener("click", () => abrirModal());
}

renderizarMiembros();