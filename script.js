let db = JSON.parse(localStorage.getItem("db") || "[]");
let tempLinks = {};

/* SALVAR */
function salvar(){
  localStorage.setItem("db", JSON.stringify(db));
}

/* LOGIN */
function login(){
  if(user.value==="marco" && pass.value==="22510827"){
    painel.style.display="block";
    atualizarLista();
  }else alert("erro");
}

/* CRIAR */
function criar(){
  db.push({
    nome:nome.value,
    img:img.value,
    ano:ano.value,
    sinopse:sinopse.value,
    categoria:categoria.value,
    tipo:tipo.value,
    temporadas:[{episodios:[]}]
  });
  salvar();
}

/* LISTA */
function atualizarLista(){
  lista.innerHTML="";
  db.forEach((s,i)=>{
    lista.innerHTML+=`<option value="${i}">${s.nome}</option>`;
  });
}

/* TEMP */
function addTemp(){
  db[lista.value].temporadas.push({episodios:[]});
  salvar();
}

/* IDIOMA */
function addIdioma(){
  tempLinks[lang.value] = link.value;
}

/* EP */
function salvarEp(){
  let s = db[lista.value];
  let t = temp.value;

  db.forEach(s=>s.temporadas.forEach(t=>t.episodios.forEach(ep=>ep.novo=false)));

  s.temporadas[t].episodios.push({
    titulo:epTitulo.value,
    links:{...tempLinks},
    novo:novo.checked
  });

  tempLinks={};
  salvar();
}

/* HOME */
function render(){

  let conteudo = document.getElementById("conteudo");
  if(!conteudo) return;

  conteudo.innerHTML="";

  let cats=[...new Set(db.map(s=>s.categoria||"Outros"))];

  cats.forEach(cat=>{
    conteudo.innerHTML+=`<h2>${cat}</h2><div class="grid">`;

    db.filter(s=>s.categoria===cat)
    .forEach((s,i)=>{
      conteudo.innerHTML+=`
      <div class="card" onclick="abrirSerie(${i})">
        <img src="${s.img}">
        <p>${s.nome}</p>
      </div>`;
    });

    conteudo.innerHTML+="</div>";
  });

  let destaque;
  db.forEach(s=>s.temporadas.forEach(t=>t.episodios.forEach(ep=>{
    if(ep.novo) destaque=ep;
  })));

  if(destaque){
    novoEp.innerHTML=`<button onclick='abrirPlayer(${JSON.stringify(destaque)})'>${destaque.titulo}</button>`;
  }
}

/* BUSCA */
function buscar(){
  let v=busca.value.toLowerCase();
  conteudo.innerHTML="";

  db.filter(s=>s.nome.toLowerCase().includes(v))
  .forEach((s,i)=>{
    conteudo.innerHTML+=`<div onclick="abrirSerie(${i})">${s.nome}</div>`;
  });
}

/* SERIE */
function abrirSerie(i){
  localStorage.setItem("serieIndex",i);
  location.href="serie.html";
}

function carregarSerie(){
  let i=localStorage.getItem("serieIndex");
  if(i==null) return;

  let s=db[i];

  titulo.innerText=s.nome;
  info.innerText=s.sinopse+" ("+s.ano+")";

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

  Object.keys(ep.links).forEach(l=>{
    let b=document.createElement("button");
    b.innerText=l;

    b.onclick=()=>{
      let url=ep.links[l];

      if(url.includes("youtube")){
        let id=url.includes("v=")?url.split("v=")[1]:url.split("/").pop();
        player.src="https://www.youtube.com/embed/"+id;
      }else if(url.includes("drive")){
        let id=url.split("/d/")[1]?.split("/")[0];
        player.src="https://drive.google.com/file/d/"+id+"/preview";
      }else{
        player.src=url;
      }
    };

    idiomas.appendChild(b);
  });
}

/* AUTO */
render();
carregarSerie();
carregarPlayer();
