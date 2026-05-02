const senhaADM = "22510827";

function entrar(){
  let s = document.getElementById("senha").value;
  if(s === senhaADM){
    document.getElementById("loginBox").style.display="none";
    document.getElementById("painel").style.display="block";
  }else{
    alert("Senha errada");
  }
}

function salvar(){
  let dados = JSON.parse(localStorage.getItem("dados") || "[]");

  dados.push({
    titulo: titulo.value,
    capa: capa.value,
    video: videoUrl.value,
    temporada: temporada.value
  });

  localStorage.setItem("dados", JSON.stringify(dados));
  alert("Salvo!");
}

function carregarHome(){
  let dados = JSON.parse(localStorage.getItem("dados") || "[]");

  if(dados.length > 0){
    let ultimo = dados[dados.length-1];

    epNome.innerText = ultimo.titulo;
    btnAssistir.href = "player.html?id=" + (dados.length-1);
  }

  let grid = document.getElementById("gridTemporadas");
  if(grid){
    dados.forEach((d,i)=>{
      grid.innerHTML += `
        <div class="card">
          <a href="player.html?id=${i}">
            <img src="${d.capa}">
          </a>
        </div>
      `;
    });
  }
}

function carregarPlayer(){
  let params = new URLSearchParams(location.search);
  let id = params.get("id");

  let dados = JSON.parse(localStorage.getItem("dados") || "[]");

  let ep = dados[id];

  if(ep){
    tituloEp.innerText = ep.titulo;
    video.src = ep.video;
  }
}

carregarHome();
carregarPlayer();
