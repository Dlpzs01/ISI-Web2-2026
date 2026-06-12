import CardsService from "./models/services/cards.services.js";
import CardRequest from "./models/request/card.request.js";

const service = new CardsService();

document.getElementById("btnCrear").addEventListener("click", async () => {

    try {

        const teamId = document.getElementById("teamId").value;

        const card = new CardRequest(
            document.getElementById("title").value,
            document.getElementById("description").value,
            1,
            1,
            1,
            1
        );

        const response = await service.create(teamId, card);
        alert("Card creada correctamente");
        console.log(response);

    } catch (error) {
        console.error(error);
        alert(error.message);

    }

});