// ===== BANCO =====
let db = JSON.parse(localStorage.getItem("db") || "[]");
let tempLinks = {};

// ===== SALVAR =====
function salvar(){
  localStorage.setItem("db", JSON.stringify(db));
}

// ===== LOGIN ADM =====
function login(){
  const u = document.getElementById("user");
  const p = document.getElementById("pass");
  const painel = document.getElementById("painel");

  if(!u || !p || !painel) return;

  if(u.value === "marco" && p.value === "22510827"){
    painel.style.display = "block";
    atualizarLista();
  }else{
    alert("Senha errada");
  }
}

// ===== ATUALIZAR LISTA =====
function atualizarLista(){
  const lista = document.getElementById("lista");
  if(!lista) return;

  lista.innerHTML = "";

  db.forEach((s,i)=>{
    let opt = document.createElement("option");
    opt.value = i;
    opt.textContent = s.nome;
    lista.appendChild(opt);
  });
}

// ===== CRIAR FILME/SÉRIE =====
function criar(){
  const nome = document.getElementById("nome");
  const img = document.getElementById("img");
  const categoria = document.getElementById("categoria");
  const tipo = document.getElementById("tipo");

  if(!nome || !img) return;

  db.push({
    nome: nome.value,
    img: img.value,
    categoria: categoria.value || "Outros",
    tipo: tipo.value,
    temporadas: [{episodios:[]}]
  });

  salvar();
  atualizarLista();

  alert("Criado!");
}

// ===== ADICIONAR TEMPORADA =====
function addTemp(){
  const lista = document.getElementById("lista");
  if(!lista) return;

  let s = db[lista.value];
  if(!s) return;

  s.temporadas.push({episodios:[]});

  salvar();
  alert("Temporada adicionada");
}

// ===== ADICIONAR IDIOMA =====
function addIdioma(){
  const idioma = document.getElementById("idioma");
  const link = document.getElementById("link");

  if(!idioma.value || !link.value){
    alert("Preencha idioma e link");
    return;
  }

  tempLinks[idioma.value] = link.value;

  idioma.value = "";
  link.value = "";

  alert("Idioma adicionado");
}

// ===== SALVAR EPISÓDIO =====
function salvarEp(){
  const lista = document.getElementById("lista");
  const temp = document.getElementById("temp");
  const titulo = document.getElementById("tituloEp");
  const novo = document.getElementById("novo");

  if(!lista || !temp || !titulo) return;

  let s = db[lista.value];
  let tIndex = parseInt(temp.value);

  if(!s || !s.temporadas[tIndex]){
    alert("Temporada inválida");
    return;
  }

  // remove antigo destaque
  db.forEach(s=>s.temporadas.forEach(t=>t.episodios.forEach(ep=>ep.novo=false)));

  s.temporadas[tIndex].episodios.push({
    titulo: titulo.value,
    links: {...tempLinks},
    novo: novo.checked
  });

  tempLinks = {};
  titulo.value = "";

  salvar();

  alert("Episódio salvo!");
}

// ===== AUTO =====
document.addEventListener("DOMContentLoaded", ()=>{
  atualizarLista();
});
