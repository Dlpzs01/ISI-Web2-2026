import TeamsService from '../../../shared/services/teams.service.js';

const teamsService = new TeamsService();
const btnListar    = document.getElementById('btn-listar');
const listaEquipos = document.getElementById('lista-equipos');

btnListar.addEventListener('click', async () => {
    listaEquipos.innerHTML = 'Cargando...'; // feedback inmediato

    try {
        const teams = await teamsService.get(); // llama el get /teams
        listaEquipos.innerHTML = '';           // limpia

        if (teams.length === 0) {
            listaEquipos.innerHTML = '<li>No hay equipos registrados.</li>';
            return;
        }

        // Por cada equipo crea una lista y lo agrega a la lista
        teams.forEach(team => {
            const li = document.createElement('li');
            li.textContent = `[${team.id}] ${team.name} — ${team.description}`;
            listaEquipos.appendChild(li);
        });

    } catch (error) {
        listaEquipos.innerHTML = `<li>Error: ${error.message}</li>`;
    }
});