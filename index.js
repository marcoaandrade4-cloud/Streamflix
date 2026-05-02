const catalogo = document.getElementById("catalogo");

const temporadas = [
  {
    nome: "1ª Temporada",
    imagem: "img/t1.jpg",
    link: "temporada.html?t=1"
  },
  {
    nome: "2ª Temporada",
    imagem: "img/t2.jpg",
    link: "temporada.html?t=2"
  },
  {
    nome: "3ª Temporada",
    imagem: "img/t3.jpg",
    link: "temporada.html?t=3"
  }
];

temporadas.forEach(t => {
  catalogo.innerHTML += `
    <div class="card">
      <a href="${t.link}">
        <img src="${t.imagem}">
        <h3>${t.nome}</h3>
      </a>
    </div>
  `;
});
