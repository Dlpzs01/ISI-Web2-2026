console.log("script.js conectado");

const TOKEN_REAL = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEwMDQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJrYWthc2hpLnVjaGloYUBkZXZzdGFjay5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoia2FrYXNoaS51Y2hpaGEiLCJlbWFpbF9jb25maXJtZWQiOiJUcnVlIiwiZXhwIjoxNzgxNzE2MzI0LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3Mjg2IiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzI4NiJ9.bJkqFj1H-c1PimKV-dh7rOie9ZT7WBL4FlrkNebb-Vg";

function buscarCards() {
  const teamId = document.getElementById("teamId").value;

  if (!teamId) {
    alert("Por favor, escribe un Team ID primero.");
    return;
  }

  const url = `https://localhost:7286/api/Teams/${teamId}/cards`;

  fetch(url, {
    headers: {
      "Authorization": TOKEN_REAL
    }
  })
  .then(res => {
    
    if (!res.ok) throw new Error(`Servidor respondió con código ${res.status}`);
    return res.json();
  })
  .then(data => {
    const tabla = document.getElementById("tablaCards");
    tabla.innerHTML = "";

    if (data.length === 0) {
      tabla.innerHTML = "<tr><td colspan='4'>No hay cards para este equipo.</td></tr>";
      return;
    }

    data.forEach(card => {
      tabla.innerHTML += `
        <tr>
          <td>${card.id}</td>
          <td>${card.title}</td>
          <td>${card.description || ""}</td>
          <td>
            <button onclick="editarCard(${card.id})">Editar</button>
            <button onclick="eliminarCard(${card.id})">Eliminar</button>
          </td>
        </tr>
      `;
    });
  })
  .catch(err => {
    console.error(err);
    alert(`Error al buscar cards: ${err.message}. Verifica los permisos del Team ID o el estado de tu Token.`);
  });
}

function crearCard() {
  const teamId = document.getElementById("teamId").value;
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  if (!teamId || !title) {
    alert("El Team ID y el Título son obligatorios para crear una card.");
    return;
  }

  const url = `https://localhost:7286/api/Teams/${teamId}/cards`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": TOKEN_REAL
    },
    body: JSON.stringify({
      title: title,
      description: description
    })
  })
  .then(res => {
    if (!res.ok) throw new Error(`Error en el servidor: Código ${res.status}`);
    console.log("Card creada exitosamente");
    
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    
    buscarCards();
  })
  .catch(err => {
    console.error(err);
    alert(`No se pudo crear la card: ${err.message}`);
  });
}

function editarCard(id) {
  const title = prompt("Nuevo título:");
  if (title === null) return;

  const description = prompt("Nueva descripción:");
  if (description === null) return;

  const teamId = document.getElementById("teamId").value;
  const url = `https://localhost:7286/api/Teams/${teamId}/cards/${id}`;

  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": TOKEN_REAL
    },
    body: JSON.stringify({
      id: id,
      title: title,
      description: description
    })
  })
  .then(res => {
    if (!res.ok) throw new Error(`Error en el servidor: Código ${res.status}`);
    console.log("Card editada exitosamente");
    buscarCards();
  })
  .catch(err => {
    console.error(err);
    alert(`No se pudo editar la card: ${err.message}`);
  });
}

function eliminarCard(id) {
  if (!confirm(`¿Estás seguro de que deseas eliminar la card con ID ${id}?`)) return;

  const teamId = document.getElementById("teamId").value;
  const url = `https://localhost:7286/api/Teams/${teamId}/cards/${id}`;

  fetch(url, {
    method: "DELETE",
    headers: {
      "Authorization": TOKEN_REAL
    }
  })
  .then(res => {
    if (!res.ok) throw new Error(`Error en el servidor: Código ${res.status}`);
    console.log("Card eliminada exitosamente");
    buscarCards();
  })
  .catch(err => {
    console.error(err);
    alert(`No se pudo eliminar la card: ${err.message}`);
  });
}