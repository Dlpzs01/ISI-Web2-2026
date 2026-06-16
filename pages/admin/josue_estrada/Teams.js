import TeamsService from "./teams.services";
 

const teamsService = new TeamsService();

let editingTeamId = null;

/*

* GET TEAMS
  */
  async function loadTeams() {

  return await teamsService.getTeams();
  }

/*

* BUILD TABLE
  */
  async function buildTable() {

  const teams = await loadTeams();

  const tableBody =
  document.getElementById(
  "teams-table-body"
  );

  tableBody.innerHTML = "";

  teams.forEach(team => {

  
   const row =
       document.createElement("tr");

   /*
    * EDIT BUTTON
    */
   const editButton =
       document.createElement(
           "button"
       );

   editButton.textContent =
       "Edit";

   editButton.classList.add(
       "edit-btn"
   );

   editButton.addEventListener(
       "click",
       () => {

           editingTeamId =
               team.id;

           document.getElementById(
               "team-name"
           ).value =
               team.name;

           document.getElementById(
               "team-description"
           ).value =
               team.description ?? "";

           document.getElementById(
               "create-team-btn"
           ).textContent =
               "Update Team";

           document.getElementById(
               "cancel-edit-btn"
           ).hidden =
               false;
       }
   );

   /*
    * DELETE BUTTON
    */
   const deleteButton =
       document.createElement(
           "button"
       );

   deleteButton.textContent =
       "Delete";

   deleteButton.classList.add(
       "delete-btn"
   );

   deleteButton.addEventListener(
       "click",
       async () => {

           const confirmed =
               confirm(
                   "Delete this team?"
               );

           if (!confirmed) {
               return;
           }

           await teamsService.deleteTeam(
               team.id
           );

           await buildTable();
       }
   );

   /*
    * ACTIONS COLUMN
    */
   const td =
       document.createElement(
           "td"
       );

   td.appendChild(
       editButton
   );

   td.appendChild(
       deleteButton
   );

   row.innerHTML = `
       <td>${team.id}</td>
       <td>${team.name}</td>
       <td>${team.description ?? "-"}</td>
       <td>${team.memberCount ?? 0}</td>
   `;

   row.appendChild(td);

   tableBody.appendChild(row);
  

  });
  }

/*

* FORM
  */
  function initializeForm() {

  const form =
  document.getElementById(
  "create-team-form"
  );

  form.addEventListener(
  "submit",
  async event => {

  
       event.preventDefault();

       const name =
           document
               .getElementById(
                   "team-name"
               )
               .value
               .trim();

       const description =
           document
               .getElementById(
                   "team-description"
               )
               .value
               .trim();

       if (!name) {

           alert(
               "Team name is required"
           );

           return;
       }

       const request =
           new TeamRequest(
               name,
               description
           );

       if (
           editingTeamId !== null
       ) {

           await teamsService.updateTeam(
               editingTeamId,
               request
           );

           editingTeamId =
               null;

           document.getElementById(
               "create-team-btn"
           ).textContent =
               "Save Team";

           document.getElementById(
               "cancel-edit-btn"
           ).hidden =
               true;

       } else {

           await teamsService.createTeam(
               request
           );
       }

       form.reset();

       await buildTable();
   }
  

  );
  }

/*

* CANCEL EDIT
  */
  function initializeCancelButton() {

  document
  .getElementById(
  "cancel-edit-btn"
  )
  .addEventListener(
  "click",
  () => {


           editingTeamId =
               null;

           document
               .getElementById(
                   "create-team-form"
               )
               .reset();

           document
               .getElementById(
                   "create-team-btn"
               )
               .textContent =
               "Save Team";

           document
               .getElementById(
                   "cancel-edit-btn"
               )
               .hidden =
               true;
       }
   );
  

}

/*

* INIT
  */
  async function init() {

  initializeForm();

  initializeCancelButton();

  await buildTable();
  }

init();
