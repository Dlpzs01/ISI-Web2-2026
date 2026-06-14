import TeamsService from "../../../shared/services/teams.service.js";
import TeamRequest from "../../../shared/models/request/team.request.js";

const teamsService = new TeamsService();

let editingTeamId = null;

/*

* BUILD TABLE
  */
  async function buildTable() {

  try {

  ```
   showLoading();

   const teams =
       await teamsService.getTeams();

   const tableBody =
       document.getElementById(
           "teams-table-body"
       );

   tableBody.innerHTML = "";

   teams.forEach(team => {

       const row =
           document.createElement("tr");

       row.innerHTML = `
           <td>${team.id}</td>
           <td>${team.name}</td>
           <td>${team.description ?? "-"}</td>
           <td>${team.memberCount ?? 0}</td>
       `;

       const actionsTd =
           document.createElement("td");

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
           "action-btn",
           "edit-btn"
       );

       editButton.addEventListener(
           "click",
           () => editTeam(team)
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
           "action-btn",
           "delete-btn"
       );

       deleteButton.addEventListener(
           "click",
           async () => {

               const confirmed =
                   confirm(
                       "Are you sure you want to delete this team?"
                   );

               if (!confirmed) {
                   return;
               }

               await deleteTeam(
                   team.id
               );
           }
       );

       actionsTd.appendChild(
           editButton
       );

       actionsTd.appendChild(
           deleteButton
       );

       row.appendChild(
           actionsTd
       );

       tableBody.appendChild(
           row
       );
   });
  ```

  } catch (error) {

  ```
   console.error(error);

   showErrorMessage(
       error.message
   );
  ```

  } finally {

  ```
   hideLoading();
  ```

  }
  }

/*

* CREATE TEAM
  */
  async function createTeam(
  request
  ) {

  try {

  ```
   showLoading();

   await teamsService.createTeam(
       request
   );

   showSuccessMessage(
       "Team created successfully"
   );

   await buildTable();
  ```

  } catch (error) {

  ```
   console.error(error);

   showErrorMessage(
       error.message
   );
  ```

  } finally {

  ```
   hideLoading();
  ```

  }
  }

/*

* UPDATE TEAM
  */
  async function updateTeam(
  id,
  request
  ) {

  try {

  ```
   showLoading();

   await teamsService.updateTeam(
       id,
       request
   );

   showSuccessMessage(
       "Team updated successfully"
   );

   cancelEdit();

   await buildTable();
  ```

  } catch (error) {

  ```
   console.error(error);

   showErrorMessage(
       error.message
   );
  ```

  } finally {

  ```
   hideLoading();
  ```

  }
  }

/*

* DELETE TEAM
  */
  async function deleteTeam(
  id
  ) {

  try {

  ```
   showLoading();

   await teamsService.deleteTeam(
       id
   );

   showSuccessMessage(
       "Team deleted successfully"
   );

   await buildTable();
  ```

  } catch (error) {

  ```
   console.error(error);

   showErrorMessage(
       error.message
   );
  ```

  } finally {

  ```
   hideLoading();
  ```

  }
  }

/*

* EDIT TEAM
  */
  function editTeam(team) {

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
  "form-title"
  ).textContent =
  "Edit Team";

  document.getElementById(
  "create-team-btn"
  ).textContent =
  "Update Team";

  document.getElementById(
  "cancel-edit-btn"
  ).hidden =
  false;
  }

/*

* CANCEL EDIT
  */
  function cancelEdit() {

  editingTeamId = null;

  document.getElementById(
  "create-team-form"
  ).reset();

  document.getElementById(
  "form-title"
  ).textContent =
  "Create New Team";

  document.getElementById(
  "create-team-btn"
  ).textContent =
  "Save Team";

  document.getElementById(
  "cancel-edit-btn"
  ).hidden =
  true;
  }

/*

* FORM
  */
  function initializeCreateTeamForm() {

  const form =
  document.getElementById(
  "create-team-form"
  );

  form.addEventListener(
  "submit",
  async event => {

  ```
       event.preventDefault();

       const name =
           document.getElementById(
               "team-name"
           )
           .value
           .trim();

       const description =
           document.getElementById(
               "team-description"
           )
           .value
           .trim();

       if (!name) {

           showErrorMessage(
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

           await updateTeam(
               editingTeamId,
               request
           );

       } else {

           await createTeam(
               request
           );
       }

       form.reset();
   }
  ```

  );
  }

/*

* SUCCESS MESSAGE
  */
  function showSuccessMessage(
  message
  ) {

  const successMessage =
  document.getElementById(
  "success-message"
  );

  const errorMessage =
  document.getElementById(
  "error-message"
  );

  errorMessage.hidden =
  true;

  successMessage.textContent =
  message;

  successMessage.hidden =
  false;

  setTimeout(() => {

  ```
   successMessage.hidden =
       true;
  ```

  }, 3000);
  }

/*

* ERROR MESSAGE
  */
  function showErrorMessage(
  message
  ) {

  const successMessage =
  document.getElementById(
  "success-message"
  );

  const errorMessage =
  document.getElementById(
  "error-message"
  );

  successMessage.hidden =
  true;

  errorMessage.textContent =
  message;

  errorMessage.hidden =
  false;

  setTimeout(() => {

  ```
   errorMessage.hidden =
       true;
  ```

  }, 4000);
  }

/*

* LOADING
  */
  function showLoading() {

  document.getElementById(
  "loading-message"
  ).hidden = false;
  }

function hideLoading() {

```
document.getElementById(
    "loading-message"
).hidden = true;
```

}

/*

* INIT
  */
  async function init() {

  initializeCreateTeamForm();

  document
  .getElementById(
  "cancel-edit-btn"
  )
  .addEventListener(
  "click",
  cancelEdit
  );

  await buildTable();
  }

init();
