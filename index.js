let catalogo = document.getElementById("catalogo");

function irADM(){
  location.href = "adm.html";
}

function abrirSerie(serie){
  localStorage.setItem("serie", JSON.stringify(serie));
  location.href = "serie.html";
}

function carregar(){

  db.collection("conteudo").get().then(snap=>{

    catalogo.innerHTML = "";

    if(snap.empty){
      catalogo.innerHTML = "<p style='color:white'>Nenhum conteúdo ainda</p>";
      return;
    }

    snap.forEach(doc=>{

      let data = doc.data();

      let card = document.createElement("div");

      card.innerHTML = `
        <img src="${data.img || ''}" width="150">
        <h3>${data.nome || 'Sem nome'}</h3>
      `;

      card.onclick = ()=>{
        abrirSerie(data);
      };

      catalogo.appendChild(card);

    });

  }).catch(err=>{
    console.error(err);
    catalogo.innerHTML = "<p style='color:red'>Erro ao carregar</p>";
  });

}

carregar();
