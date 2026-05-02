const senhaADM="1234";
let db=JSON.parse(localStorage.getItem("db")||"[]");
let idiomasTemp={};

/* NAV */
function abrirADM(){location.href="adm.html";}

/* LOGIN */
function login(){
if(senha.value===senhaADM){
loginBox.style.display="none";
painel.style.display="block";
atualizarLista();
}else alert("Senha errada");
}

/* DB */
function salvar(){localStorage.setItem("db",JSON.stringify(db));}

/* CRIAR */
function criarSerie(){
db.push({
nome:nomeSerie.value,
capa:capaSerie.value,
sinopse:sinopseSerie.value,
ano:anoSerie.value,
tipo:tipo.value,
temporadas:[]
});
salvar();atualizarLista();
}

/* LISTA */
function atualizarLista(){
listaSeries.innerHTML="";
db.forEach((s,i)=>listaSeries.innerHTML+=`<option value="${i}">${s.nome}</option>`);
}

/* TEMP */
function addTemp(){
db[listaSeries.value].temporadas.push({episodios:[]});
salvar();
}

/* MULTI IDIOMA */
function addIdioma(){
idiomasTemp[lang.value]=link.value;
alert("Idioma adicionado");
}

/* ADD EP */
function addEp(){
let s=db[listaSeries.value];
let t=tempNum.value;

if(s.tipo==="filme"){
t=0;
if(!s.temporadas[0]) s.temporadas[0]={episodios:[]};
}

db.forEach(s=>s.temporadas.forEach(t=>t.episodios.forEach(ep=>ep.novo=false)));

let ep={
titulo:tituloEpADM.value,
capa:capaEpADM.value,
links:{...idiomasTemp},
novo:novoEp.checked
};

s.temporadas[t].episodios.push(ep);

idiomasTemp={};

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
db.forEach(s=>s.temporadas.forEach(t=>t.episodios.forEach(ep=>{
if(ep.novo)destaque=ep;
})));

if(destaque){
epNome.innerText=destaque.titulo;
epInfo.innerText="Novo episódio disponível";
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
sinopse.innerText=s.sinopse;
ano.innerText=s.ano;

s.temporadas.forEach((t,ti)=>{
let b=document.createElement("button");
b.innerText="Temporada "+(ti+1);

b.onclick=()=>{
episodios.innerHTML="";
t.episodios.forEach(ep=>{
let e=document.createElement("div");
e.innerHTML=`
<img src="${ep.capa}" width="120">
<p>${ep.titulo}</p>
`;
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
capaEp.src=ep.capa;

Object.keys(ep.links).forEach(l=>{
let b=document.createElement("button");
b.innerText=l;

b.onclick=()=>{
let url=ep.links[l];

if(url.includes("youtube")){
let id=url.includes("v=")?url.split("v=")[1]:url.split("/").pop();
player.src="https://www.youtube.com/embed/"+id;
}
else if(url.includes("drive")){
let id=url.split("/d/")[1]?.split("/")[0];
player.src="https://drive.google.com/file/d/"+id+"/preview";
}
else player.src=url;
};

idiomas.appendChild(b);
});

idiomas.querySelector("button")?.click();
}

/* AUTO */
carregarHome();
carregarSeriePage();
carregarPlayer();
