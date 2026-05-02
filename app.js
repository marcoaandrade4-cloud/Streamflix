const path = window.location.pathname;

// HOME
if (path.includes("index.html") || path === "/") {
  const grid = document.getElementById("grid");

  DB.temporadas.forEach(t => {
    grid.innerHTML += `
      <div class="card" onclick="abrirTemp(${t.id})">
        <img src="${t.capa}">
        <h3>${t.nome}</h3>
      </div>
    `;
  });
}

// TEMPORADA
if (path.includes("temporada.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("t");

  const temporada = DB.temporadas.find(t => t.id == id);

  document.getElementById("titulo").innerText = temporada.nome;

  const lista = document.getElementById("episodios");

  temporada.episodios.forEach(ep => {
    lista.innerHTML += `
      <div class="episodio" onclick="abrirPlayer(${id}, ${ep.id})">
        <img src="${ep.thumb}">
        <div>
          <h3>${ep.titulo}</h3>
          <p>${ep.descricao}</p>
        </div>
      </div>
    `;
  });
}

// PLAYER
if (path.includes("player.html")) {
  const params = new URLSearchParams(window.location.search);
  const t = params.get("t");
  const e = params.get("e");

  const temp = DB.temporadas.find(x => x.id == t);
  const ep = temp.episodios.find(x => x.id == e);

  document.getElementById("epTitulo").innerText = ep.titulo;
  document.getElementById("descricao").innerText = ep.descricao;
  document.getElementById("video").src = ep.video;
}

// FUNÇÕES
function abrirTemp(id) {
  window.location = `temporada.html?t=${id}`;
}

function abrirPlayer(t, e) {
  window.location = `player.html?t=${t}&e=${e}`;
}
