import TeamsService from '../../../shared/services/teams.service.js';

const teamsService  = new TeamsService();
const inputId       = document.getElementById('input-eliminar-id');
const btnEliminar   = document.getElementById('btn-eliminar');
const resultado     = document.getElementById('resultado-eliminar');

btnEliminar.addEventListener('click', async () => {
    const id = inputId.value.trim();

    if (!id) {
        resultado.textContent = 'Ingresa un ID válido.';
        return;
    }

    const confirmar = confirm(`¿Eliminar el equipo con ID ${id}?`);
    if (!confirmar) return;

    try {
        await teamsService.deleteById(id); // DELETE /teams/{id}
        resultado.textContent = ` Equipo con ID ${id} eliminado.`;
        inputId.value = '';
    } catch (error) {
        resultado.textContent = `Error: ${error.message}`;
    }
});