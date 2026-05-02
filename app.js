const app = document.getElementById("app");

// 🔥 DADOS BASEADOS NO SEU EXEMPLO
const banco = [
  {
    nome: "1ª Temporada",
    capa: "https://i.imgur.com/8Km9tLL.jpg",
    episodios: [
      {
        nome: "Origens Parte 1",
        thumb: "https://i.imgur.com/8Km9tLL.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      {
        nome: "Origens Parte 2",
        thumb: "https://i.imgur.com/8Km9tLL.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ]
  },
  {
    nome: "2ª Temporada",
    capa: "https://i.imgur.com/5tj6S7Ol.jpg",
    episodios: []
  },
  {
    nome: "3ª Temporada",
    capa: "https://i.imgur.com/3ZQ3Z6Gl.jpg",
    episodios: []
  }
];

// 🏠 HOME
function carregarHome(){
  let html = "<h2>Temporadas</h2><div class='grid'>";

  banco.forEach((t, i) => {
    html += `
      <div class="card" onclick="abrirTemporada(${i})">
        <img src="${t.capa}">
        <p>${t.nome}</p>
      </div>
    `;
  });

  html += "</div>";
  app.innerHTML = html;
}

// 📺 TEMPORADA
function abrirTemporada(index){
  const temp = banco[index];

  let html = `
    <button class="btn" onclick="carregarHome()">⬅ Voltar</button>
    <h2>${temp.nome}</h2>
    <div class="grid">
  `;

  if(temp.episodios.length === 0){
    html += "<p>Sem episódios ainda</p>";
  }

  temp.episodios.forEach(ep => {
    html += `
      <div class="card" onclick="abrirPlayer('${ep.nome}','${ep.video}')">
        <img src="${ep.thumb}">
        <p>${ep.nome}</p>
      </div>
    `;
  });

  html += "</div>";
  app.innerHTML = html;
}

// ▶ PLAYER
function abrirPlayer(nome, video){
  window.location.href = `player.html?nome=${encodeURIComponent(nome)}&video=${encodeURIComponent(video)}`;
}

// 🚀 INICIO GARANTIDO
window.onload = carregarHome;
