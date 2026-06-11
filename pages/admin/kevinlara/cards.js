import CardsService from "./cards.service.js";


const service = new CardsService();
const tbody = document.getElementById('cardsTableBody');
const cardForm = document.getElementById('cardForm');
const loadBtn = document.getElementById('loadBtn');

// Función para listar
async function loadCards(teamId) {
    const cards = await service.getAll(teamId);
    
    
    tbody.innerHTML = '';

    cards.forEach(c => {
        const tr = document.createElement('tr');

        // ID
        const tdId = document.createElement('td');
        tdId.textContent = c.id;
        tr.appendChild(tdId);

        // Nombre
        const tdTitle = document.createElement('td');
        tdTitle.textContent = c.title;
        tr.appendChild(tdTitle);

        // Acciones
        const tdActions = document.createElement('td');
        
        // Botón Editar
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => window.editCard(c.id, c.title, c.description, c.etag || '*'));
        
        // Botón Eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.addEventListener('click', () => window.deleteCard(teamId, c.id));
        
        tdActions.appendChild(editBtn);
        tdActions.appendChild(deleteBtn);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
}

// Evento Crear
cardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const teamId = document.getElementById('teamId').value;
    
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