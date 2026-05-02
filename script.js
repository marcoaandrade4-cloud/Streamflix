const senhaADM="22510827";
let db=JSON.parse(localStorage.getItem("db")||"[]");
let idiomasTemp={};

/* NAV */
function abrirADM(){
  location.href="adm.html";
}

/* LOGIN */
function login(){
  if(senha.value===senhaADM){
    loginBox.style.display="none";
    painel.style.display="block";
    atualizarLista();
  }else alert("Senha errada");
}

/* SALVAR */
function salvar(){localStorage.setItem("db",JSON.stringify(db));}

/* CRIAR */
function criar(){
  db.push({nome:nome.value,capa:capa.value,tipo:tipo.value,temporadas:[]});
  salvar();atualizarLista();
}

/* LISTA */
function atualizarLista(){
  lista.innerHTML="";
  db.forEach((s,i)=>lista.innerHTML+=`<option value="${i}">${s.nome}</option>`);
}

/* TEMP */
function addTemp(){
  db[lista.value].temporadas.push({episodios:[]});
  salvar();carregarADM();
}

/* MULTI IDIOMA */
function addIdioma(){
  idiomasTemp[idioma.value]=link.value;
  alert("Idioma adicionado");
}

/* SALVAR EP */
function salvarEp(){
  let s=db[lista.value];
  let t=temp.value;

  if(!s.temporadas[t]) return alert("Temporada inválida");

  db.forEach(s=>s.temporadas.forEach(t=>t.episodios.forEach(ep=>ep.novo=false)));

  let ep={
    titulo:tituloEp.value,
    links:{...idiomasTemp},
    novo:novo.checked
  };

  s.temporadas[t].episodios.push(ep);

  idiomasTemp={};

  salvar();
  carregarADM();
}

/* ADM VIEW */
function carregarADM(){
  let s=db[lista.value];
  conteudo.innerHTML="";

  s.temporadas.forEach((t,ti)=>{
    let div=document.createElement("div");
    div.innerHTML=`<h4>Temporada ${ti+1}</h4>`;

    t.episodios.forEach((ep,ei)=>{
      div.innerHTML+=`
        ${ep.titulo}
        <button onclick="editar(${ti},${ei})">Editar</button>
        <button onclick="del(${ti},${ei})">Excluir</button>
      `;
    });

    conteudo.appendChild(div);
  });
}

/* EDITAR */
function editar(t,e){
  let ep=db[lista.value].temporadas[t].episodios[e];

  let novoTitulo=prompt("Título",ep.titulo);
  if(novoTitulo) ep.titulo=novoTitulo;

  salvar();carregarADM();
}

/* DELETE */
function del(t,e){
  db[lista.value].temporadas[t].episodios.splice(e,1);
  salvar();carregarADM();
}

/* HOME */
function carregarHome(){
  let grid=document.getElementById("grid");
  if(!grid)return;

  grid.innerHTML="";

  db.forEach((s,i)=>{
    grid.innerHTML+=`
      <div class="card" onclick="abrirSerie(${i})">
        <img src="${s.capa}">
      </div>`;
  });

  let destaque;
  db.forEach(s=>s.temporadas.forEach(t=>t.episodios.forEach(ep=>{
    if(ep.novo)destaque=ep;
  })));

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
  if(i==null)return;

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
  if(!ep)return;

  tituloEp.innerText=ep.titulo;

  Object.keys(ep.links).forEach(l=>{
    let b=document.createElement("button");
    b.innerText=l;

    b.onclick=()=>{
      let url=ep.links[l];

      if(url.includes("youtube")){
        let id=url.includes("v=")?url.split("v=")[1]:url.split("/").pop();
        player.src="https://www.youtube.com/embed/"+id;
      }else{
        player.src=url;
      }
    };

    idiomas.appendChild(b);
  });
}

/* AUTO */
carregarHome();
carregarSeriePage();
carregarPlayer();
