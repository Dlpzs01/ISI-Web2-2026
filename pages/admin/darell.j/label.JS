import LabelsService from "../darell.j/services/label.service.js";
import LabelRequest from "../darell.j/models/Request/label.request.js";

const service = new LabelsService();

//  ID  del grupo agregado en el swagger
const teamId = 1001; 



async function loadLabels() {

const labels = await service.get(teamId);
const table = document.getElementById("tableLabels");

    table.innerHTML = "";

    labels.forEach(label => {
        table.innerHTML += `
        <tr>
            <td>${label.id}</td>
            <td>${label.name}</td>
            <td>
                <span class="color-icon" style="background-color:${label.color}"></span>
            </td>

        <td>
        <button onclick="editLabel(${label.id}, '${label.name}', '${label.color}')">
                Editar
        </button>

        <button onclick="deleteLabel(${label.id})">
                Eliminar
        </button>
        </td>
        </tr>
        `;
    });
}


async function createLabel() {

const name = document.getElementById("name").value;
const color = document.getElementById("color").value;

const request = new LabelRequest(name, color);
await service.create(teamId, request);
await loadLabels();
}


function editLabel(id, name, color) {

document.getElementById("name").value = name;
document.getElementById("color").value = color;

const btn = document.getElementById("btnSave");
    btn.innerText = "Actualizar";

    btn.onclick = async function () {

 const request = new LabelRequest(
            document.getElementById("name").value,
            document.getElementById("color").value
        );

        await service.update(teamId, id, request);
        btn.innerText = "Guardar";
        btn.onclick = createLabel;
        await loadLabels();
    };
}


async function deleteLabel(id) {
await service.delete(teamId, id);
await loadLabels();
}

window.loadLabels = loadLabels;
window.createLabel = createLabel;
window.editLabel = editLabel;
window.deleteLabel = deleteLabel;

loadLabels();