import TeamsService from '../../../shared/services/teams.service.js';
import TeamRequest from '../../../shared/models/request/team.request.js';

const teamsService  = new TeamsService();
const inputNombre   = document.getElementById('input-crear-nombre');
const inputDesc     = document.getElementById('input-crear-descripcion');
const btnCrear      = document.getElementById('btn-crear');
const resultado     = document.getElementById('resultado-crear');

btnCrear.addEventListener('click', async () => {
    const nombre = inputNombre.value.trim();
    const desc   = inputDesc.value.trim();

    if (!nombre || !desc) {
        resultado.textContent = 'Completa todos los campos.';
        return;
    }

    try {
        // TeamRequest 
        const request = new TeamRequest(nombre, desc);
        const teamCreado = await teamsService.create(request); // POST /teams

        resultado.textContent = ` Equipo creado con ID: ${teamCreado.id}`;
        inputNombre.value = '';
        inputDesc.value   = '';
    } catch (error) {
        resultado.textContent = `Error: ${error.message}`;
    }
});