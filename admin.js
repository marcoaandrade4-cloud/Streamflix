let tempLinks = {};
let listaDB = [];

function login(){
  if(user.value==="marco" && pass.value==="22510827"){
    painel.style.display="block";
    carregarLista();
  }else alert("Senha errada");
}

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

function carregarLista(){
  db.collection("conteudo").get().then(snapshot=>{
    lista.innerHTML="";
    listaDB=[];

    snapshot.forEach(doc=>{
      listaDB.push({id:doc.id,...doc.data()});
    });

    listaDB.forEach((s,i)=>{
      lista.innerHTML += `<option value="${i}">${s.nome}</option>`;
    });
  });
}

function addTemp(){
  let item = listaDB[lista.value];
  item.temporadas.push({episodios:[]});

  db.collection("conteudo").doc(item.id).set(item);
}

function addIdioma(){
  tempLinks[idioma.value] = link.value;
}

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
