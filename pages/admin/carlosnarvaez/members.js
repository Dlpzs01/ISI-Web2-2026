import { membersService } from "./service.js"; 
import { MemberRequest } from "./member-request.js";

const listaContenedor = document.getElementById("miembros-lista");

async function cargarMiembros() {
    try {
        const miembros = await membersService.getAll();
        listaContenedor.innerHTML = ""; 

        if (miembros.length === 0) {
            listaContenedor.innerHTML = "<p>No hay miembros registrados todavía.</p>";
            return;
        }

        miembros.forEach(function(miembro) {
            const tarjeta = document.createElement("div");
            tarjeta.style.border = "1px solid #ccc";
            tarjeta.style.padding = "15px";
            tarjeta.style.margin = "10px 0";
            tarjeta.style.maxWidth = "300px";
            tarjeta.style.borderRadius = "8px";
            tarjeta.style.backgroundColor = "white";
            
            tarjeta.innerHTML = `
                <p><strong>ID Usuario:</strong> ${miembro.id}</p>
                <p><strong>Nombre:</strong> ${miembro.fullName}</p>
                <p><strong>Rol:</strong> ${miembro.role}</p>
            `;

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.style.marginRight = "8px";
            btnEditar.style.cursor = "pointer";
            btnEditar.addEventListener("click", function() {
                abrirModalMiembro(miembro);
            });

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.style.backgroundColor = "#ff4d4d";
            btnEliminar.style.color = "white";
            btnEliminar.style.border = "none";
            btnEliminar.style.padding = "2px 8px";
            btnEliminar.style.borderRadius = "4px";
            btnEliminar.style.cursor = "pointer";

            btnEliminar.addEventListener("click", async function() {
                if (confirm(`¿Estás seguro de que deseas eliminar a ${miembro.fullName}?`)) {
                    try {
                        await membersService.delete(miembro.id);
                        alert("Miembro eliminado con éxito.");
                        cargarMiembros(); 
                    } catch (error) {
                        alert("Error al eliminar: " + error.message);
                    }
                }
            });

            tarjeta.appendChild(btnEditar);
            tarjeta.appendChild(btnEliminar);
            listaContenedor.appendChild(tarjeta);
        }); 

    } catch (err) {
        listaContenedor.innerHTML = "<p style='color:red;'>Error al conectar con la API.</p>";
    }
}

function abrirModalMiembro(registro = null) {
    const modalViejo = document.getElementById("modal-dinamico");
    if (modalViejo) modalViejo.remove();

    const idRegistroActual = registro ? registro.id : null;

    const fondoModal = document.createElement("div");
    fondoModal.id = "modal-dinamico";
    fondoModal.style.position = "fixed";
    fondoModal.style.top = "0";
    fondoModal.style.left = "0";
    fondoModal.style.width = "100%";
    fondoModal.style.height = "100%";
    fondoModal.style.backgroundColor = "rgba(0,0,0,0.5)";
    fondoModal.style.display = "flex";
    fondoModal.style.justifyContent = "center";
    fondoModal.style.alignItems = "center";
    fondoModal.style.zIndex = "1000";

    const contenidoModal = document.createElement("div");
    contenidoModal.style.backgroundColor = "white";
    contenidoModal.style.padding = "20px";
    contenidoModal.style.borderRadius = "8px";
    contenidoModal.style.width = "320px";

    const titulo = registro ? "Modificar Miembro" : "Registrar Miembro";

    contenidoModal.innerHTML = `
        <h3 style="margin-top:0;">${titulo}</h3>
        
        <label>ID del Usuario:</label><br>
        <input type="number" id="txt-userid" value="${idRegistroActual ? idRegistroActual : ''}" style="width:100%; margin-bottom:10px;" ${registro ? 'disabled' : ''}><br>
        
        <label>Nombre:</label><br>
        <input type="text" id="txt-firstname" value="${registro ? registro.firstName : ''}" style="width:100%; margin-bottom:10px;" placeholder="Ej: Juan"><br>
        
        <label>Apellido:</label><br>
        <input type="text" id="txt-lastname" value="${registro ? registro.lastName : ''}" style="width:100%; margin-bottom:10px;" placeholder="Ej: Pérez"><br>

        <label>Rol:</label><br>
        <input type="text" id="txt-rol" value="${registro ? registro.role : ''}" style="width:100%; margin-bottom:20px;" placeholder="Ej: Owner o Miembro"><br>
        
        <div style="text-align: right;">
            <button id="btn-cancelar" style="margin-right:10px;">Cancelar</button>
            <button id="btn-guardar" style="background-color:#4CAF50; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Guardar</button>
        </div>
    `;

    fondoModal.appendChild(contenidoModal);
    document.body.appendChild(fondoModal);

    document.getElementById("btn-cancelar").addEventListener("click", function() {
        fondoModal.remove();
    });

    document.getElementById("btn-guardar").addEventListener("click", async function() {
        const userIdInput = document.getElementById("txt-userid").value.trim();
        const firstNameVal = document.getElementById("txt-firstname").value.trim();
        const lastNameVal = document.getElementById("txt-lastname").value.trim();
        const rolVal = document.getElementById("txt-rol").value.trim();

        if (!firstNameVal || !rolVal) {
            alert("Por favor, rellene los campos obligatorios (Nombre y Rol).");
            return; 
        }

        const userIdVal = registro ? idRegistroActual : (parseInt(userIdInput) || 0);

        const datosEnviar = new MemberRequest(userIdVal, firstNameVal, lastNameVal, rolVal);

        try {
            if (registro && idRegistroActual) {
                await membersService.update(idRegistroActual, datosEnviar);
                alert("¡Miembro modificado con éxito!");
            } else {
                await membersService.create(datosEnviar);
                alert("¡Miembro registrado correctamente!");
            }
            
            fondoModal.remove(); 
            cargarMiembros(); 
        } catch (error) {
            alert("Error al guardar: " + error.message);
        }
    });
}

const btnNuevo = document.getElementById("btnGet"); 
if (btnNuevo) {
    btnNuevo.textContent = "Agregar Nuevo Miembro"; 
    btnNuevo.addEventListener("click", function() {
        abrirModalMiembro();
    });
}

cargarMiembros();