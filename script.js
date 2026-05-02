let db = JSON.parse(localStorage.getItem("db") || "[]");

/* SALVAR */
function salvar(){
  localStorage.setItem("db", JSON.stringify(db));
}

/* CRIAR */
function criar(){
  db.push({
    nome: nome.value,
    capa: capa.value,
    temporadas:[]
  });
  salvar();
  atualizarLista();
}

/* LISTA */
function atualizarLista(){
  if(!lista) return;
  lista.innerHTML="";
  db.forEach((s,i)=>{
    lista.innerHTML+=`<option value="${i}">${s.nome}</option>`;
  });
}

/* TEMP */
function addTemp(){
  let i = lista.value;
  if(!db[i]) return;

  db[i].temporadas.push({episodios:[]});
  salvar();
}

/* EP */
function addEp(){
  let i = lista.value;
  let t = temp.value;

  if(!db[i] || !db[i].temporadas[t]){
    return alert("Temporada inválida");
  }

  // novo episódio (mantido)
  db.forEach(s=>{
    s.temporadas.forEach(t=>{
      t.episodios.forEach(ep=>ep.novo=false);
    });
  });

  let ep = {
    titulo: tituloEp.value,
    links:{}
  };

  ep.links[lang.value] = link.value;

  if(novo.checked){
    ep.novo = true;
  }

  db[i].temporadas[t].episodios.push(ep);

  salvar();
}

/* HOME */
function carregarHome(){
  let grid=document.getElementById("grid");
  if(!grid) return;

  grid.innerHTML="";

  db.forEach((s,i)=>{
    grid.innerHTML+=`
      <div class="card" onclick="abrirSerie(${i})">
        <img src="${s.capa}">
      </div>`;
  });

  let destaque;
  db.forEach(s=>{
    s.temporadas.forEach(t=>{
      t.episodios.forEach(ep=>{
        if(ep.novo) destaque=ep;
      });
    });
  });

  if(destaque){
    epNome.innerText=destaque.titulo;

    btnAssistir.onclick=()=>{
      localStorage.setItem("ep",JSON.stringify(destaque));
      location.href="player.html";
    };
  }
}

/* SERIE */
function abrirSerie(i){
  localStorage.setItem("serieIndex",i);
  location.href="serie.html";
}

function carregarSeriePage(){
  let i=localStorage.getItem("serieIndex");
  if(i==null) return;

  let s=db[i];
  titulo.innerText=s.nome;

  s.temporadas.forEach((t,ti)=>{
    let b=document.createElement("button");
    b.innerText="Temporada "+(ti+1);

    b.onclick=()=>{
      episodios.innerHTML="";
      t.episodios.forEach(ep=>{
        let e=document.createElement("button");
        e.innerText=ep.titulo;

        e.onclick=()=>{
          localStorage.setItem("ep",JSON.stringify(ep));
          location.href="player.html";
        };

        episodios.appendChild(e);
      });
    };

    temporadas.appendChild(b);
  });
}

/* PLAYER */
function carregarPlayer(){
  let ep=JSON.parse(localStorage.getItem("ep"));
  if(!ep) return;

  tituloEp.innerText=ep.titulo;

  Object.keys(ep.links).forEach(lang=>{
    let b=document.createElement("button");
    b.innerText=lang;

    b.onclick=()=>{
      let url=ep.links[lang];

      if(url.includes("youtube")){
        let id=url.includes("v=")?url.split("v=")[1]:url.split("/").pop();
        player.src="https://www.youtube.com/embed/"+id;
      }else{
        player.src=url;
      }
    };

    idiomas.appendChild(b);
  });

  idiomas.firstChild?.click();
}

/* AUTO */
carregarHome();
carregarSeriePage();
carregarPlayer();
