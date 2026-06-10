import CardsService from "./cards.service.js";
import Card from "../../../shared/models/cards.model.js";//hacemos las impotaciones


const service = new CardsService();
const tbody = document.getElementById('cardsTableBody');
const cardForm = document.getElementById('cardForm');
const loadBtn = document.getElementById('loadBtn');

// Función para listar
async function loadCards(teamId) {
    const cards = await service.getAll(teamId);
    tbody.innerHTML = cards.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.title}</td>
            <td>    
            <button onclick="window.editCard(${c.id}, '${c.title}', '${c.description}', '${c.etag || '*'}')">Editar</button>
                <button onclick="window.deleteCard('${teamId}', '${c.id}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}


// Evento Crear
cardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const teamId = document.getElementById('teamId').value;
    
    // Aquí estamos creando un objeto plano con la clave 'title' en lugar de 'name'
    const newCard = {
        id: null,
        title: document.getElementById('cardName').value, 
        description: document.getElementById('cardDesc').value,
        teamId: teamId
    };
    
    await service.create(teamId, newCard);
    loadCards(teamId);
});

// Evento Cargar
loadBtn.addEventListener('click', () => {
    const teamId = document.getElementById('teamId').value;
    loadCards(teamId);
});

// Función global para borrar
window.deleteCard = async (teamId, cardId) => {
    await service.delete(teamId, cardId);
    loadCards(teamId);
};