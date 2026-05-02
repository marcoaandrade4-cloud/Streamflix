const senhaADM = "22510827";
let db = JSON.parse(localStorage.getItem("db") || "[]");

/* ================= ADM ================= */

function abrirADM(){
  window.location.href="adm.html";
}

function login(){
  if(senha.value === senhaADM){
    loginBox.style.display="none";
    painel.style.display="block";
    atualizarLista();
  } else alert("Senha errada");
}

function salvarDB(){
  localStorage.setItem("db", JSON.stringify(db));
}

function criarSerie(){
  db.push({
    nome: nomeSerie.value,
    capa: capaSerie.value,
    temporadas:[]
  });
  salvarDB();
  atualizarLista();
}

function atualizarLista(){
  listaSeries.innerHTML="";
  db.forEach((s,i)=>{
    listaSeries.innerHTML+=`<option value="${i}">${s.nome}</option>`;
  });
}

function carregarSerie(){
}

function addTemp(){
  let s = db[listaSeries.value];
  s.temporadas.push({episodios:[]});
  salvarDB();
}

function addEp(){
  let s = db[listaSeries.value];
  let t = s.temporadas[tempNum.value];

  if(!t) return alert("Temporada inválida");

  db.forEach(s=>s.novo=false);

  let ep = {
    titulo: tituloEpADM.value,
    links:{}
  };

  ep.links[lang.value] = link.value;

  t.episodios.push(ep);

  if(novoEp.checked) ep.novo = true;

  salvarDB();
}

/* ================= HOME ================= */

function carregarHome(){
  let grid = document.getElementById("grid");
  if(!grid) return;

  grid.innerHTML="";

  db.forEach((s,i)=>{
    grid.innerHTML+=`
      <div class="card" onclick="abrirSerie(${i})">
        <img src="${s.capa}">
      </div>
    `;
  });

  let epNovo;
  db.forEach(s=>{
    s.temporadas.forEach(t=>{
      t.episodios.forEach(ep=>{
        if(ep.novo) epNovo = ep;
      });
    });
  });

  if(epNovo){
    epNome.innerText = epNovo.titulo;
  }
}

/* ================= SERIE ================= */

function abrirSerie(i){
  localStorage.setItem("serieIndex", i);
  location.href="serie.html";
}

function carregarSeriePage(){
  let i = localStorage.getItem("serieIndex");
  if(i===null) return;

  let s = db[i];
  titulo.innerText = s.nome;

  s.temporadas.forEach((t,ti)=>{
    let btn = document.createElement("button");
    btn.innerText = "Temporada "+(ti+1);

    btn.onclick=()=>{
      episodios.innerHTML="";
      t.episodios.forEach((ep,ei)=>{
        let b = document.createElement("button");
        b.innerText = ep.titulo;

        b.onclick=()=>{
          localStorage.setItem("ep", JSON.stringify(ep));
          location.href="player.html";
        };

        episodios.appendChild(b);
      });
    };

    temporadas.appendChild(btn);
  });
}

/* ================= PLAYER ================= */

function carregarPlayer(){
  let ep = JSON.parse(localStorage.getItem("ep"));
  if(!ep) return;

  tituloEp.innerText = ep.titulo;

  Object.keys(ep.links).forEach(lang=>{
    let b = document.createElement("button");
    b.innerText = lang;

    b.onclick=()=>{
      player.src = ep.links[lang];
    };

    idiomas.appendChild(b);
  });
}

/* AUTO */
carregarHome();
carregarSeriePage();
carregarPlayer();
