let tempLinks = {};
let listaDB = [];

/* LOGIN */
function login(){
  const userInput = document.getElementById("user");
  const passInput = document.getElementById("pass");
  const painel = document.getElementById("painel");

  if(userInput.value === "marco" && passInput.value === "22510827"){
    painel.style.display = "block";
    carregarLista();
  }else{
    alert("Senha errada");
  }
}

/* CARREGAR LISTA */
function carregarLista(){
  const lista = document.getElementById("lista");

  db.collection("conteudo").get().then(snapshot=>{
    lista.innerHTML = "";
    listaDB = [];

    snapshot.forEach(doc=>{
      listaDB.push({id:doc.id, ...doc.data()});
    });

    listaDB.forEach((s,i)=>{
      lista.innerHTML += `<option value="${i}">${s.nome}</option>`;
    });
  });
}

/* CRIAR */
function criar(){
  const nome = document.getElementById("nome").value;
  const img = document.getElementById("img").value;
  const categoria = document.getElementById("categoria").value;
  const tipo = document.getElementById("tipo").value;

  db.collection("conteudo").add({
    nome,
    img,
    categoria,
    tipo,
    temporadas:[{episodios:[]}]
  }).then(()=>{
    alert("Criado!");
    carregarLista();
  });
}

/* ADD TEMP */
function addTemp(){
  const lista = document.getElementById("lista");
  let item = listaDB[lista.value];

  if(!item) return alert("Selecione algo");

  item.temporadas.push({episodios:[]});

  db.collection("conteudo").doc(item.id).set(item).then(()=>{
    alert("Temporada adicionada");
  });
}

/* ADD IDIOMA */
function addIdioma(){
  const idioma = document.getElementById("idioma");
  const link = document.getElementById("link");

  if(!idioma.value || !link.value){
    alert("Preencha idioma e link");
    return;
  }

  tempLinks[idioma.value] = link.value;

  idioma.value="";
  link.value="";

  alert("Idioma adicionado");
}

/* SALVAR EP */
function salvarEp(){
  const lista = document.getElementById("lista");
  const temp = document.getElementById("temp");
  const titulo = document.getElementById("tituloEp");
  const novo = document.getElementById("novo");

  let item = listaDB[lista.value];
  let t = parseInt(temp.value);

  if(!item || !item.temporadas[t]){
    alert("Temporada inválida");
    return;
  }

  item.temporadas.forEach(t=>{
    t.episodios.forEach(ep=>ep.novo=false);
  });

  item.temporadas[t].episodios.push({
    titulo: titulo.value,
    links: {...tempLinks},
    novo: novo.checked
  });

  db.collection("conteudo").doc(item.id).set(item).then(()=>{
    alert("Episódio salvo!");
  });

  tempLinks = {};
    }
