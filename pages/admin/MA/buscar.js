import TeamsService from '../../../shared/services/teams.service.js';

const teamsService = new TeamsService();

// elementos del DOM
const inputId    = document.getElementById('input-id');
const btnBuscar  = document.getElementById('btn-buscar');
const resultado  = document.getElementById('resultado');

btnBuscar.addEventListener('click', async () => {
    const id = inputId.value.trim();
    if (!id) {
        resultado.textContent = 'Por favor ingresa un ID.';
        return;
    }

    try {
        const team = await teamsService.getById(id);
        resultado.textContent = JSON.stringify(team, null, 2);
    } catch (error) {
        resultado.textContent = `Error: ${error.message}`;
    }
});