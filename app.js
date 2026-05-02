let db = JSON.parse(localStorage.getItem("db")) || [];

function salvarDB(){
  localStorage.setItem("db", JSON.stringify(db));
}

/* ===== HOME ===== */

if(document.getElementById("catalogo")){

  if(db.length === 0){
    db.push({
      titulo:"Miraculous",
      capa:"https://i.imgur.com/3ZQ3ZQm.jpg",
      temporadas:[]
    });
    salvarDB();
  }

  render();

  function render(){
    let cat = document.getElementById("catalogo");
    cat.innerHTML = "";

    db.forEach((item,i)=>{
      cat.innerHTML += `
      <div class="card" onclick="abrirSerie(${i})">
        <img src="${item.capa}">
        <p>${item.titulo}</p>
      </div>`;
    });
  }

  document.getElementById("busca").oninput = function(){
    let v = this.value.toLowerCase();

    document.querySelectorAll(".card").forEach(c=>{
      c.style.display = c.innerText.toLowerCase().includes(v) ? "block":"none";
    });
  }
}

function abrirSerie(i){
  location.href = "serie.html?id="+i;
}

function irAdmin(){
  location.href = "admin.html";
}

/* ===== SERIE ===== */

if(location.pathname.includes("serie")){
  let id = new URLSearchParams(location.search).get("id");
  let serie = db[id];

  document.getElementById("titulo").innerText = serie.titulo;

  let tDiv = document.getElementById("temporadas");
  let eDiv = document.getElementById("episodios");

  serie.temporadas.forEach((t,ti)=>{
    let b = document.createElement("button");
    b.innerText = "Temporada "+(ti+1);

    b.onclick = ()=>{
      eDiv.innerHTML = "";

      t.episodios.forEach((ep,ei)=>{
        eDiv.innerHTML += `
        <div onclick="abrirPlayer(${id},${ti},${ei})">
          Episódio ${ei+1}
        </div>`;
      });
    }

    tDiv.appendChild(b);
  });
}

function abrirPlayer(s,t,e){
  location.href = `player.html?s=${s}&t=${t}&e=${e}`;
}

/* ===== PLAYER ===== */

if(location.pathname.includes("player")){
  let p = new URLSearchParams(location.search);

  let ep = db[p.get("s")].temporadas[p.get("t")].episodios[p.get("e")];

  document.getElementById("ep").innerText = ep.nome;

  let sel = document.getElementById("idioma");

  for(let l in ep.links){
    sel.innerHTML += `<option value="${ep.links[l]}">${l}</option>`;
  }

  sel.onchange = ()=>{
    document.getElementById("player").src = sel.value;
  }

  sel.onchange();
}

/* ===== ADMIN ===== */

function login(){
  if(senha.value === "1234"){
    login.style.display="none";
    painel.style.display="block";
    carregarLista();
  }
}

function salvarSerie(){
  db.push({
    titulo:titulo.value,
    capa:capa.value,
    temporadas:[]
  });

  salvarDB();
  alert("Salvo!");
}

function carregarLista(){
  lista.innerHTML="";

  db.forEach((i,index)=>{
    lista.innerHTML += `<option value="${index}">${i.titulo}</option>`;
  });
}

let atual = null;

function editar(){
  atual = lista.value;
  renderTemps();
}

function addTemp(){
  db[atual].temporadas.push({episodios:[]});
  renderTemps();
}

function renderTemps(){
  temps.innerHTML="";

  db[atual].temporadas.forEach((t,ti)=>{
    temps.innerHTML += `
    <div>
      <h4>Temp ${ti+1}</h4>
      <button onclick="addEp(${ti})">Novo episódio</button>
    </div>`;
  });
}

function addEp(ti){
  db[atual].temporadas[ti].episodios.push({
    nome:"Novo episódio",
    links:{"PT-BR":""}
  });

  renderTemps();
}

function salvarTudo(){
  salvarDB();
  alert("Atualizado!");
}
