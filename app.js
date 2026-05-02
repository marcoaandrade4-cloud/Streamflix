let db = JSON.parse(localStorage.getItem("db")) || [];

function salvarDB(){
  localStorage.setItem("db", JSON.stringify(db));
}

/* ===== HOME ===== */

if(document.getElementById("catalogo")){
  let cat = document.getElementById("catalogo");

  db.forEach((item,i)=>{
    cat.innerHTML += `
    <div class="card" onclick="abrirSerie(${i})">
      <img src="${item.capa}">
      <p>${item.titulo}</p>
    </div>`;
  });
}

function abrirSerie(i){
  location.href = "serie.html?id="+i;
}

/* ===== SERIE ===== */

if(location.pathname.includes("serie")){
  let id = new URLSearchParams(location.search).get("id");
  let serie = db[id];

  document.getElementById("titulo").innerText = serie.titulo;

  let tDiv = document.getElementById("temporadas");
  let eDiv = document.getElementById("episodios");

  serie.temporadas?.forEach((t,ti)=>{
    let btn = document.createElement("button");
    btn.innerText = "Temporada "+(ti+1);

    btn.onclick = ()=>{
      eDiv.innerHTML = "";
      t.episodios.forEach((ep,ei)=>{
        eDiv.innerHTML += `
        <div onclick="abrirPlayer(${id},${ti},${ei})">
        Episódio ${ei+1}
        </div>`;
      });
    }

    tDiv.appendChild(btn);
  });
}

function abrirPlayer(s,t,e){
  location.href = `player.html?s=${s}&t=${t}&e=${e}`;
}

/* ===== PLAYER ===== */

if(location.pathname.includes("player")){
  let p = new URLSearchParams(location.search);
  let s = p.get("s"), t=p.get("t"), e=p.get("e");

  let ep = db[s].temporadas[t].episodios[e];

  document.getElementById("nomeEp").innerText = ep.nome;

  let select = document.getElementById("idioma");

  for(let lang in ep.links){
    let op = document.createElement("option");
    op.value = ep.links[lang];
    op.innerText = lang;
    select.appendChild(op);
  }

  select.onchange = ()=>{
    document.getElementById("player").src = select.value;
  }

  select.onchange();
}

/* ===== ADMIN ===== */

function abrirAdmin(){
  location.href = "admin.html";
}

function logar(){
  if(document.getElementById("senha").value === "1234"){
    document.getElementById("login").style.display="none";
    document.getElementById("painel").style.display="block";
    carregarLista();
  }
}

function salvar(){
  let item = {
    titulo:titulo.value,
    capa:capa.value,
    tipo:tipo.value,
    sinopse:sinopse.value,
    ano:ano.value,
    temporadas:[]
  };

  db.push(item);
  salvarDB();
  alert("Salvo!");
}

function carregarLista(){
  let sel = document.getElementById("lista");
  sel.innerHTML="";

  db.forEach((i,index)=>{
    sel.innerHTML += `<option value="${index}">${i.titulo}</option>`;
  });
}

let editando = null;

function carregar(){
  editando = lista.value;
  let i = db[editando];

  titulo.value=i.titulo;
  capa.value=i.capa;
}

function addTemp(){
  let t = {episodios:[]};
  db[editando].temporadas.push(t);
  renderTemps();
}

function renderTemps(){
  let div = document.getElementById("temps");
  div.innerHTML="";

  db[editando].temporadas.forEach((t,ti)=>{
    div.innerHTML += `
    <div>
      <h4>Temp ${ti+1}</h4>
      <button onclick="addEp(${ti})">+ Ep</button>
    </div>`;
  });
}

function addEp(ti){
  db[editando].temporadas[ti].episodios.push({
    nome:"Novo episódio",
    links:{ "PT-BR":"" }
  });
  renderTemps();
}

function salvarTudo(){
  salvarDB();
  alert("Atualizado!");
  }
