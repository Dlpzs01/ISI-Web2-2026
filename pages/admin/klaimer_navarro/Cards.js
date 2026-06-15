import CardsService from './CardsService.js';
import AddCardLabelsRequest from './AddCardLabelsRequest.js';

const cardsService = new CardsService();

const cardIdInput = document.getElementById('card-id');
const searchButton = document.getElementById('btn-search');
const addLabelsButton = document.getElementById('btn-add-labels');

const cardTableBody = document.getElementById('card-table-body');
const labelsTableBody = document.getElementById('labels-table-body');
const messageContainer = document.getElementById('message-container');

let currentCardId = null;

function showMessage(message) {
    messageContainer.textContent = message;
}

async function loadCard(id) {

    try {

        const card = await cardsService.getById(id);

        cardTableBody.innerHTML = '';

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${card.id}</td>
            <td>${card.title}</td>
            <td>${card.description}</td>
            <td>${card.order}</td>
            <td>${card.ownerName ?? 'Sin asignar'}</td>
        `;

        cardTableBody.appendChild(row);

    } catch (error) {

        showMessage(error.message);

        throw error;

    }
}

async function loadLabels(id) {

    try {

        const labels = await cardsService.getLabels(id);

        labelsTableBody.innerHTML = '';

        labels.forEach(label => {

            const row = document.createElement('tr');

            const deleteButton = document.createElement('button');

            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('delete-button');

            deleteButton.addEventListener('click', async () => {

                await removeLabel(
                    id,
                    label.id
                );

            });

            row.innerHTML = `
                <td>${label.id}</td>
                <td>${label.name}</td>
                <td>${label.color}</td>
            `;

            const actionCell = document.createElement('td');

            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);

            labelsTableBody.appendChild(row);

        });

    } catch (error) {

        showMessage(error.message);

        throw error;

    }
}

async function searchCard() {

    try {

        const id = Number(cardIdInput.value);

        if (!id) {

            showMessage(
                'Ingrese un ID válido.'
            );

            return;
        }

        currentCardId = id;

        await loadCard(id);

        await loadLabels(id);

        showMessage(
            'Card cargada correctamente.'
        );

    } catch (error) {

        showMessage(
            error.message
        );

    }

}
async function addLabels() {

    try {

        if (!currentCardId) {

            showMessage(
                'Primero debe buscar una card.'
            );

            return;
        }

        const input =
            document.getElementById('label-ids');

        const labelIds =
            input.value
                .split(',')
                .map(id => Number(id.trim()))
                .filter(id => !isNaN(id));

        const request =
            new AddCardLabelsRequest(labelIds);

        await cardsService.addLabels(
            currentCardId,
            request
        );

        input.value = '';

        await loadLabels(currentCardId);

        showMessage(
            'Etiquetas agregadas correctamente.'
        );

    } catch (error) {

        showMessage(error.message);

    }
}

async function removeLabel(cardId, labelId) {

    try {

        await cardsService.removeLabel(
            cardId,
            labelId
        );

        await loadLabels(cardId);

        showMessage(
            'Etiqueta eliminada correctamente.'
        );

    } catch (error) {

        showMessage(error.message);

    }
}

searchButton.addEventListener(
    'click',
    searchCard
);

addLabelsButton.addEventListener(
    'click',
    addLabels
); 