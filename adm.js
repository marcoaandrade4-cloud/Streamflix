let tempLinks = {};
let listaDB = [];

/* LOGIN */
function login(){
  const u = document.getElementById("user").value;
  const p = document.getElementById("pass").value;

  if(u==="marco" && p==="22510827"){
    document.getElementById("painel").style.display="block";
    carregarLista();
  }else alert("Senha errada");
}

/* LISTA */
function carregarLista(){
  db.collection("conteudo").get().then(snap=>{
    lista.innerHTML="";
    listaDB=[];

    snap.forEach(doc=>{
      listaDB.push({id:doc.id,...doc.data()});
    });

    listaDB.forEach((s,i)=>{
      lista.innerHTML+=`<option value="${i}">${s.nome}</option>`;
    });
  });
}

/* CRIAR */
function criar(){
  db.collection("conteudo").add({
    nome:nome.value,
    img:img.value,
    categoria:categoria.value,
    tipo:tipo.value,
    temporadas:[{episodios:[]}]
  }).then(()=>carregarLista());
}

/* TEMP */
function addTemp(){
  let item = listaDB[lista.value];
  item.temporadas.push({episodios:[]});
  db.collection("conteudo").doc(item.id).set(item);
}

/* IDIOMA */
function addIdioma(){
  tempLinks[idioma.value]=link.value;
  idioma.value="";
  link.value="";
}

/* SALVAR */
function salvarEp(){
  let item = listaDB[lista.value];
  let t = parseInt(temp.value);

  item.temporadas[t].episodios.push({
    titulo:tituloEp.value,
    links:{...tempLinks},
    novo:novo.checked
  });

  db.collection("conteudo").doc(item.id).set(item);

  tempLinks={};
}

/* MOSTRAR EPS */
function mostrarEpisodios(){
  let item = listaDB[lista.value];
  let t = parseInt(temp.value);

  let area = document.getElementById("areaEps");
  area.innerHTML="";

  (item.temporadas[t].episodios||[]).forEach((ep,i)=>{
    area.innerHTML+=`
      <div>
        ${ep.titulo}
        <button onclick="editarEp(${i})">✏️</button>
        <button onclick="removerEp(${i})">❌</button>
      </div>
    `;
  });
}

/* EDITAR */
function editarEp(i){
  let item = listaDB[lista.value];
  let t = parseInt(temp.value);

  let ep = item.temporadas[t].episodios[i];

  tituloEp.value = ep.titulo;
  tempLinks = {...ep.links};

  removerEp(i);
}

/* REMOVER */
function removerEp(i){
  let item = listaDB[lista.value];
  let t = parseInt(temp.value);

  item.temporadas[t].episodios.splice(i,1);

  db.collection("conteudo").doc(item.id).set(item)
  .then(()=>mostrarEpisodios());
}
