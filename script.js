let db = JSON.parse(localStorage.getItem("db") || "[]");
let tempLinks = {};

/* SALVAR */
function salvar(){
  localStorage.setItem("db", JSON.stringify(db));
}

/* LOGIN ADM */
function login(){
  let u = document.getElementById("user");
  let p = document.getElementById("pass");
  let painel = document.getElementById("painel");

  if(!u || !p || !painel) return;

  if(u.value === "marco" && p.value === "22510827"){
    painel.style.display = "block";
    atualizarLista();
  }else{
    alert("Senha errada");
  }
}

/* ATUALIZAR LISTA */
function atualizarLista(){
  let lista = document.getElementById("lista");
  if(!lista) return;

  lista.innerHTML = "";

  db.forEach((s,i)=>{
    lista.innerHTML += `<option value="${i}">${s.nome}</option>`;
  });
}

/* CRIAR */
function criar(){
  let nome = document.getElementById("nome").value;
  let img = document.getElementById("img").value;
  let categoria = document.getElementById("categoria").value;
  let tipo = document.getElementById("tipo").value;

  db.push({
    nome,
    img,
    categoria,
    tipo,
    temporadas:[{episodios:[]}]
  });

  salvar();
  atualizarLista();

  alert("Criado!");
}

/* TEMP */
function addTemp(){
  let lista = document.getElementById("lista");

  let s = db[lista.value];
  if(!s) return;

  s.temporadas.push({episodios:[]});

  salvar();
  alert("Temporada criada");
}

/* IDIOMA */
function addIdioma(){
  let idioma = document.getElementById("idioma");
  let link = document.getElementById("link");

  if(!idioma.value || !link.value){
    alert("Preencha idioma e link");
    return;
  }

  tempLinks[idioma.value] = link.value;

  idioma.value = "";
  link.value = "";

  alert("Idioma adicionado");
}

/* EP */
function salvarEp(){
  let lista = document.getElementById("lista");
  let temp = document.getElementById("temp");
  let titulo = document.getElementById("tituloEp");
  let novo = document.getElementById("novo");

  let s = db[lista.value];
  let t = parseInt(temp.value);

  if(!s || !s.temporadas[t]){
    alert("Temporada inválida");
    return;
  }

  // limpa destaque antigo
  db.forEach(s=>s.temporadas.forEach(t=>t.episodios.forEach(ep=>ep.novo=false)));

  s.temporadas[t].episodios.push({
    titulo: titulo.value,
    links: {...tempLinks},
    novo: novo.checked
  });

  tempLinks = {};
  titulo.value = "";

  salvar();

  alert("Episódio salvo!");
}

/* HOME */
function render(){
  let conteudo = document.getElementById("conteudo");
  if(!conteudo) return;

  conteudo.innerHTML = "";

  db.forEach((s,i)=>{
    conteudo.innerHTML += `
    <div class="card" onclick="abrirSerie(${i})">
      <img src="${s.img}">
      <p>${s.nome}</p>
    </div>`;
  });

  // NOVO EPISÓDIO (SIMPLES MAS BONITO)
  let destaque;

  db.forEach(s=>s.temporadas.forEach(t=>t.episodios.forEach(ep=>{
    if(ep.novo) destaque = ep;
  })));

  if(destaque){
    document.getElementById("novoEp").innerHTML = `
      <button onclick='abrirPlayer(${JSON.stringify(destaque)})'>
        ▶ Assistir agora: ${destaque.titulo}
      </button>
    `;
  }
}

/* BUSCA */
function buscar(){
  let v = document.getElementById("busca").value.toLowerCase();
  let conteudo = document.getElementById("conteudo");

  conteudo.innerHTML = "";

  db.filter(s=>s.nome.toLowerCase().includes(v))
  .forEach((s,i)=>{
    conteudo.innerHTML += `
    <div class="card" onclick="abrirSerie(${i})">
      <img src="${s.img}">
      <p>${s.nome}</p>
    </div>`;
  });
}

/* SERIE */
function abrirSerie(i){
  localStorage.setItem("serieIndex",i);
  location.href = "serie.html";
}

/* PLAYER */
function abrirPlayer(ep){
  localStorage.setItem("ep", JSON.stringify(ep));
  location.href = "player.html";
}

/* AUTO */
render();
