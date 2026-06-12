import CardsService from "./models/services/cards.services.js";

const service = new CardsService();

document
.getElementById("btnBuscar")
.addEventListener("click", async () => {

    const teamId =
        document.getElementById("teamId").value;

    console.log("TEAM ID:", teamId);

    const cards =
        await service.get(teamId);

    console.log(cards);
});