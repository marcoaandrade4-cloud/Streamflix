let catalogo = document.getElementById("catalogo");

/* IR PRO ADM */
function irADM(){
  location.href = "adm.html";
}

/* ABRIR SÉRIE */
function abrirSerie(serie){
  localStorage.setItem("serie", JSON.stringify(serie));
  location.href = "serie.html";
}

/* CARREGAR CATÁLOGO */
function carregar(){

  db.collection("conteudo").get().then(snap=>{

    catalogo.innerHTML = "";

    snap.forEach(doc=>{

      let data = doc.data();

      let card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${data.img}" width="150">
        <h3>${data.nome}</h3>
      `;

      card.onclick = ()=>{
        abrirSerie(data);
      };

      catalogo.appendChild(card);

    });

  });

}

/* INICIAR */
carregar();
