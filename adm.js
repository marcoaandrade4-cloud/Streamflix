let tempLinks = {};
let listaDB = [];
let atual = null;
let tempAtual = 0;

/* LOGIN */
function login(){
  if(user.value==="marco" && pass.value==="22510827"){
    painel.style.display="block";
    carregarLista();
  }else alert("Senha errada");
}

/* CARREGAR */
function carregarLista(){
  db.collection("conteudo").get().then(snap=>{
    lista.innerHTML="";
    listaDB=[];

    snap.forEach(doc=>{
      let data = doc.data();

      // GARANTE estrutura
      if(!data.temporadas) data.temporadas = [];

      listaDB.push({id:doc.id,...data});
    });

    listaDB.forEach((s,i)=>{
      lista.innerHTML += `<option value="${i}">${s.nome}</option>`;
    });
  });
}

/* SELECIONAR */
function selecionarSerie(){
  atual = listaDB[lista.value];
  if(!atual) return;

  mostrarTemporadas();
  areaEps.innerHTML="";
}

/* MOSTRAR TEMP */
function mostrarTemporadas(){
  areaTemp.innerHTML="";

  atual.temporadas.forEach((t,i)=>{
    if(!t.episodios) t.episodios=[];

    areaTemp.innerHTML += `
      <div>
        Temporada ${i+1}
        <button onclick="abrirTemp(${i})">Abrir</button>
        <button onclick="removerTemp(${i})">❌</button>
      </div>
    `;
  });
}

/* ABRIR TEMP */
function abrirTemp(i){
  tempAtual = i;

  areaEps.innerHTML="";

  let eps = atual.temporadas[i].episodios;

  if(eps.length === 0){
    areaEps.innerHTML = "<p>Sem episódios</p>";
    return;
  }

  eps.forEach((ep,index)=>{
    areaEps.innerHTML += `
      <div>
        ${ep.titulo}
        <button onclick="editarEp(${index})">✏️</button>
        <button onclick="removerEp(${index})">❌</button>
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
    carregarLista();
  });
}

/* ADD TEMP */
function addTemp(){
  if(!atual) return alert("Selecione série");

  atual.temporadas.push({episodios:[]});
  salvarAtual();
}

/* REMOVER TEMP CORRETO */
function removerTemp(i){
  if(!confirm("Remover temporada?")) return;

  atual.temporadas.splice(i,1);
  salvarAtual();
}

/* IDIOMA */
function addIdioma(){
  tempLinks[idioma.value] = link.value;
  idioma.value="";
  link.value="";
}

/* SALVAR EP */
function salvarEp(){
  if(!atual) return alert("Selecione série");

  let t = parseInt(temp.value);

  if(isNaN(t)) t = tempAtual;

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

/* EDITAR */
function editarEp(i){
  let ep = atual.temporadas[tempAtual].episodios[i];

  tituloEp.value = ep.titulo;
  temp.value = tempAtual;
  tempLinks = {...ep.links};

  atual.temporadas[tempAtual].episodios.splice(i,1);
  salvarAtual();
}

/* REMOVER EP */
function removerEp(i){
  atual.temporadas[tempAtual].episodios.splice(i,1);
  salvarAtual();
}

/* SALVAR */
function salvarAtual(){
  db.collection("conteudo").doc(atual.id).set(atual).then(()=>{
    carregarLista();
    setTimeout(()=>selecionarSerie(), 200);
  });
}
