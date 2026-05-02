let conteudoDB = [];

function carregar(){
  db.collection("conteudo").get().then(snapshot=>{
    conteudoDB = [];

    snapshot.forEach(doc=>{
      let d = doc.data();
      d.id = doc.id;
      conteudoDB.push(d);
    });

    render();
  });
}

function render(){
  let conteudo = document.getElementById("conteudo");
  if(!conteudo) return;

  conteudo.innerHTML = "";

  conteudoDB.forEach((s,i)=>{
    conteudo.innerHTML += `
    <div class="card" onclick="abrirSerie(${i})">
      <img src="${s.img}">
      <p>${s.nome}</p>
    </div>`;
  });

  let destaque;

  conteudoDB.forEach(s=>{
    (s.temporadas||[]).forEach(t=>{
      (t.episodios||[]).forEach(ep=>{
        if(ep.novo) destaque = ep;
      });
    });
  });

  if(destaque){
    document.getElementById("novoEp").innerHTML = `
      <button onclick='abrirPlayer(${JSON.stringify(destaque)})'>
        ▶ ${destaque.titulo}
      </button>
    `;
  }
}

function buscar(){
  let v = document.getElementById("busca").value.toLowerCase();
  let conteudo = document.getElementById("conteudo");

  conteudo.innerHTML = "";

  conteudoDB.filter(s=>s.nome.toLowerCase().includes(v))
  .forEach((s,i)=>{
    conteudo.innerHTML += `
    <div class="card" onclick="abrirSerie(${i})">
      <img src="${s.img}">
      <p>${s.nome}</p>
    </div>`;
  });
}

function abrirSerie(i){
  localStorage.setItem("serie", JSON.stringify(conteudoDB[i]));
  location.href="serie.html";
}

function abrirPlayer(ep){
  localStorage.setItem("ep", JSON.stringify(ep));
  location.href="player.html";
}

carregar();
