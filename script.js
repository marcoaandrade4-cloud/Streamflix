const senhaADM = "22510827";
let db = JSON.parse(localStorage.getItem("db") || "[]");

/* LOGIN */
function login(){
  if(document.getElementById("senha").value === senhaADM){
    document.getElementById("loginBox").style.display="none";
    document.getElementById("painel").style.display="block";
    atualizarLista();
  } else alert("Senha errada");
}

/* DB */
function salvar(){
  localStorage.setItem("db", JSON.stringify(db));
}

/* CRIAR */
function criarSerie(){
  db.push({
    nome: document.getElementById("nomeSerie").value,
    capa: document.getElementById("capaSerie").value,
    temporadas:[]
  });

  salvar();
  atualizarLista();
}

/* LISTA */
function atualizarLista(){
  let select = document.getElementById("listaSeries");
  if(!select) return;

  select.innerHTML = "";

  db.forEach((s,i)=>{
    select.innerHTML += `<option value="${i}">${s.nome}</option>`;
  });
}

/* TEMP */
function addTemp(){
  let i = document.getElementById("listaSeries").value;
  if(i === "") return alert("Selecione uma série");

  db[i].temporadas.push({episodios:[]});
  salvar();
}

/* EP */
function addEp(){
  let i = document.getElementById("listaSeries").value;
  let t = document.getElementById("tempNum").value;

  if(!db[i] || !db[i].temporadas[t]){
    return alert("Temporada inválida");
  }

  db.forEach(s=>{
    s.temporadas.forEach(t=>{
      t.episodios.forEach(ep=>ep.novo=false);
    });
  });

  let ep = {
    titulo: document.getElementById("tituloEpADM").value,
    links:{}
  };

  ep.links[document.getElementById("lang").value] =
    document.getElementById("link").value;

  if(document.getElementById("novoEp").checked){
    ep.novo = true;
  }

  db[i].temporadas[t].episodios.push(ep);

  salvar();
  alert("Salvo!");
}

/* HOME */
function carregarHome(){
  let grid = document.getElementById("grid");
  if(!grid) return;

  grid.innerHTML = "";

  db.forEach((s,i)=>{
    grid.innerHTML += `
      <div class="card" onclick="abrirSerie(${i})">
        <img src="${s.capa}">
      </div>
    `;
  });

  let destaque;

  db.forEach(s=>{
    s.temporadas.forEach(t=>{
      t.episodios.forEach(ep=>{
        if(ep.novo) destaque = ep;
      });
    });
  });

  if(destaque){
    document.getElementById("epNome").innerText = destaque.titulo;

    document.getElementById("btnAssistir").onclick = ()=>{
      localStorage.setItem("ep", JSON.stringify(destaque));
      location.href = "player.html";
    };
  }
}

/* SERIE */
function abrirSerie(i){
  localStorage.setItem("serieIndex", i);
  location.href = "serie.html";
}

function carregarSeriePage(){
  let i = localStorage.getItem("serieIndex");
  if(i == null) return;

  let s = db[i];
  document.getElementById("titulo").innerText = s.nome;

  let temporadasDiv = document.getElementById("temporadas");
  let episodiosDiv = document.getElementById("episodios");

  s.temporadas.forEach((t,ti)=>{
    let b = document.createElement("button");
    b.innerText = "Temporada " + (ti+1);

    b.onclick = ()=>{
      episodiosDiv.innerHTML = "";

      t.episodios.forEach(ep=>{
        let e = document.createElement("button");
        e.innerText = ep.titulo;

        e.onclick = ()=>{
          localStorage.setItem("ep", JSON.stringify(ep));
          location.href = "player.html";
        };

        episodiosDiv.appendChild(e);
      });
    };

    temporadasDiv.appendChild(b);
  });
}

/* PLAYER */
function carregarPlayer(){
  let ep = JSON.parse(localStorage.getItem("ep"));
  if(!ep) return;

  document.getElementById("tituloEp").innerText = ep.titulo;
  let idiomasDiv = document.getElementById("idiomas");

  idiomasDiv.innerHTML = "";

  Object.keys(ep.links).forEach(lang=>{
    let b = document.createElement("button");
    b.innerText = lang;

    b.onclick = ()=>{
      let url = ep.links[lang];

      if(url.includes("youtube")){
        let id = url.includes("v=")
          ? url.split("v=")[1].split("&")[0]
          : url.split("/").pop();

        document.getElementById("player").src =
          "https://www.youtube.com/embed/" + id;
      }
      else if(url.includes("drive")){
        let id = url.split("/d/")[1]?.split("/")[0];

        document.getElementById("player").src =
          "https://drive.google.com/file/d/"+id+"/preview";
      }
      else{
        document.getElementById("player").src = url;
      }
    };

    idiomasDiv.appendChild(b);
  });

  if(idiomasDiv.firstChild){
    idiomasDiv.firstChild.click();
  }
}

/* AUTO */
carregarHome();
carregarSeriePage();
carregarPlayer();
