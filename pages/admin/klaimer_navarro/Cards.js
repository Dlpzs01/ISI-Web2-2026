import CardsService from "../../../shared/services/cards.service.js";

const cardsService = new CardsService();

async function loadCards() {
    const cards = await cardsService.get();
    return cards;
}

async function buildTable() {

    const cards = await loadCards();

    const tableBody = document.getElementById('cards-table-body');

    tableBody.innerHTML = '';

    cards.forEach(card => {

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${card.id}</td>
            <td>${card.title}</td>
            <td>${card.description}</td>
            <td>${card.status}</td>
            <td>${card.createdAt}</td>
        `;

        tableBody.appendChild(row);

    });
}

buildTable();