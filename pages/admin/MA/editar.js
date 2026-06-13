import TeamsService from '../../../shared/services/teams.service.js';
import TeamRequest from '../../../shared/models/request/team.request.js';

const teamsService  = new TeamsService();
const inputId       = document.getElementById('input-editar-id');
const inputNombre   = document.getElementById('input-editar-nombre');
const inputDesc     = document.getElementById('input-editar-descripcion');
const btnEditar     = document.getElementById('btn-editar');
const resultado     = document.getElementById('resultado-editar');

btnEditar.addEventListener('click', async () => {
    const id     = inputId.value.trim();
    const nombre = inputNombre.value.trim();
    const desc   = inputDesc.value.trim();

    if (!id || !nombre || !desc) {
        resultado.textContent = 'Completa todos los campos.';
        return;
    }

    try {
        const request = new TeamRequest(nombre, desc);
        const teamActualizado = await teamsService.update(id, request); // PUT /teams/{id}

        resultado.textContent = ` Equipo ${teamActualizado.id} actualizado correctamente.`;
    } catch (error) {
        resultado.textContent = `Error: ${error.message}`;
    }
});