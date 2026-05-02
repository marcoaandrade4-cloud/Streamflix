let tempLinks = {};
let listaDB = [];
let atual = null;

/* LOGIN */
function login(){
  const u = document.getElementById("user").value;
  const p = document.getElementById("pass").value;

  if(u==="marco" && p==="22510827"){
    document.getElementById("painel").style.display="block";
    carregarLista();
  }else{
    alert("Senha errada");
  }
}

/* CARREGAR LISTA */
function carregarLista(){
  const lista = document.getElementById("lista");

  db.collection("conteudo").get().then(snap=>{
    lista.innerHTML="";
    listaDB=[];

    snap.forEach(doc=>{
      listaDB.push({id:doc.id, ...doc.data()});
    });

    listaDB.forEach((s,i)=>{
      lista.innerHTML += `<option value="${i}">${s.nome}</option>`;
    });
  });
}

/* SELECIONAR */
function selecionarSerie(){
  const lista = document.getElementById("lista");
  atual = listaDB[lista.value];

  if(!atual) return;

  mostrarTemporadas();
  document.getElementById("areaEps").innerHTML="";
}

/* MOSTRAR TEMPORADAS */
function mostrarTemporadas(){
  let area = document.getElementById("areaTemp");
  area.innerHTML="";

  (atual.temporadas || []).forEach((t,i)=>{
    area.innerHTML += `
      <div>
        Temporada ${i}
        <button onclick="abrirTemp(${i})">Abrir</button>
        <button onclick="removerTemp(${i})">❌</button>
      </div>
    `;
  });
}

/* ABRIR TEMP */
function abrirTemp(i){
  let area = document.getElementById("areaEps");
  area.innerHTML="";

  let eps = atual.temporadas[i].episodios || [];

  if(eps.length === 0){
    area.innerHTML = "<p>Sem episódios</p>";
    return;
  }

  eps.forEach((ep,index)=>{
    area.innerHTML += `
      <div>
        ${ep.titulo}
        <button onclick="editarEp(${i},${index})">✏️</button>
        <button onclick="removerEp(${i},${index})">❌</button>
      </div>
    `;
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
  }).then(()=>{
    alert("Criado!");
    carregarLista();
  });
}

/* ADD TEMP */
function addTemp(){
  if(!atual) return alert("Selecione uma série");

  atual.temporadas.push({episodios:[]});
  salvarAtual();
}

/* REMOVER TEMP */
function removerTemp(i){
  atual.temporadas.splice(i,1);
  salvarAtual();
}

/* ADD IDIOMA */
function addIdioma(){
  tempLinks[idioma.value] = link.value;
  idioma.value="";
  link.value="";
}

/* SALVAR EP */
function salvarEp(){
  if(!atual) return alert("Selecione uma série");

  let t = parseInt(temp.value);

  if(!atual.temporadas[t]){
    alert("Temporada inválida");
    return;
  }

  atual.temporadas[t].episodios.push({
    titulo:tituloEp.value,
    links:{...tempLinks},
    novo:novo.checked
  });

  tempLinks={};
  salvarAtual();
}

/* EDITAR EP */
function editarEp(t,i){
  let ep = atual.temporadas[t].episodios[i];

  tituloEp.value = ep.titulo;
  temp.value = t;
  tempLinks = {...ep.links};

  atual.temporadas[t].episodios.splice(i,1);

  salvarAtual();
}

/* REMOVER EP */
function removerEp(t,i){
  atual.temporadas[t].episodios.splice(i,1);
  salvarAtual();
}

/* SALVAR FIREBASE */
function salvarAtual(){
  db.collection("conteudo").doc(atual.id).set(atual).then(()=>{
    carregarLista();
    setTimeout(()=>selecionarSerie(), 300);
  });
}
