const senhaADM = "1234";
let db = JSON.parse(localStorage.getItem("db") || "[]");

/* BOTÃO ADM (FIX) */
document.addEventListener("DOMContentLoaded", ()=>{
  let btn = document.getElementById("btnADM");
  if(btn){
    btn.addEventListener("click", ()=>{
      window.location.href = "./adm.html";
    });
  }
});

/* LOGIN */
function login(){
  if(document.getElementById("senha").value === senhaADM){
    loginBox.style.display="none";
    painel.style.display="block";
    atualizarLista();
  } else alert("Senha errada");
}

/* DB */
function salvar(){localStorage.setItem("db", JSON.stringify(db));}

/* CRIAR */
function criarSerie(){
  db.push({nome:nomeSerie.value,capa:capaSerie.value,temporadas:[]});
  salvar(); atualizarLista();
}

/* LISTA */
function atualizarLista(){
  if(!listaSeries) return;
  listaSeries.innerHTML="";
  db.forEach((s,i)=>{
    listaSeries.innerHTML+=`<option value="${i}">${s.nome}</option>`;
  });
}

/* TEMP */
function addTemp(){
  let i = listaSeries.value;
  db[i].temporadas.push({episodios:[]});
  salvar();
}

/* EP */
function addEp(){
  let i = listaSeries.value;
  let t = tempNum.value;

  if(!db[i] || !db[i].temporadas[t]) return alert("Temporada inválida");

  db.forEach(s=>{
    s.temporadas.forEach(t=>{
      t.episodios.forEach(ep=>ep.novo=false);
    });
  });

  let ep={
    titulo:tituloEpADM.value,
    links:{}
  };

  ep.links[lang.value]=link.value;

  if(novoEp.checked) ep.novo=true;

  db[i].temporadas[t].episodios.push(ep);

  salvar();
  alert("Salvo!");
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
      location.href="./player.html";
    };
  }
}

/* SERIE */
function abrirSerie(i){
  localStorage.setItem("serieIndex",i);
  location.href="./serie.html";
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
          location.href="./player.html";
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
  idiomas.innerHTML="";

  Object.keys(ep.links).forEach(lang=>{
    let b=document.createElement("button");
    b.innerText=lang;

    b.onclick=()=>{
      let url=ep.links[lang];

      if(url.includes("youtube")){
        let id=url.includes("v=")?url.split("v=")[1].split("&")[0]:url.split("/").pop();
        player.src="https://www.youtube.com/embed/"+id;
      }
      else if(url.includes("drive")){
        let id=url.split("/d/")[1]?.split("/")[0];
        player.src="https://drive.google.com/file/d/"+id+"/preview";
      }
      else{
        player.src=url;
      }
    };

    idiomas.appendChild(b);
  });

  idiomas.querySelector("button")?.click();
}

/* AUTO */
carregarHome();
carregarSeriePage();
carregarPlayer();
