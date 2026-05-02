const app = document.getElementById("app");

// 📦 BANCO DE DADOS SIMPLES
const data = {
  temporadas: [
    {
      nome: "1ª Temporada",
      capa: "https://i.imgur.com/1.jpg",
      episodios: [
        {
          nome: "Origens Parte 1",
          thumb: "https://i.imgur.com/a.jpg",
          video: "https://www.youtube.com/embed/SEU_VIDEO"
        },
        {
          nome: "Origens Parte 2",
          thumb: "https://i.imgur.com/b.jpg",
          video: "https://www.youtube.com/embed/SEU_VIDEO"
        }
      ]
    },
    {
      nome: "2ª Temporada",
      capa: "https://i.imgur.com/2.jpg",
      episodios: []
    }
  ]
};

// 🏠 HOME
function home(){
  app.innerHTML = "<h2>Temporadas</h2><div class='grid' id='grid'></div>";
  const grid = document.getElementById("grid");

  data.temporadas.forEach((t, i) => {
    grid.innerHTML += `
      <div class="card" onclick="abrirTemporada(${i})">
        <img src="${t.capa}">
        <p>${t.nome}</p>
      </div>
    `;
  });
}

// 📺 ABRIR TEMPORADA
function abrirTemporada(index){
  const temp = data.temporadas[index];

  app.innerHTML = `
    <button class="btn" onclick="home()">⬅ Voltar</button>
    <h2>${temp.nome}</h2>
    <div class="grid" id="grid"></div>
  `;

  const grid = document.getElementById("grid");

  temp.episodios.forEach(ep => {
    grid.innerHTML += `
      <div class="card" onclick="abrirPlayer('${ep.nome}','${ep.video}')">
        <img src="${ep.thumb}">
        <p>${ep.nome}</p>
      </div>
    `;
  });
}

// ▶ PLAYER
function abrirPlayer(nome, video){
  window.location.href = `player.html?nome=${encodeURIComponent(nome)}&video=${encodeURIComponent(video)}`;
}

// START
home();
