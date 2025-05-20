function mostrarCadastro() {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("cadastro-form").classList.remove("hidden");
}

function mostrarLogin() {
  document.getElementById("cadastro-form").classList.add("hidden");
  document.getElementById("login-form").classList.remove("hidden");
}

document.getElementById("cadastro-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("novo-email").value;
  const senha = document.getElementById("nova-senha").value;
  if (email && senha) {
    localStorage.setItem("usuario", JSON.stringify({ email, senha }));
    alert("Conta criada com sucesso!");
    mostrarLogin();
  }
});

document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));

  if (usuarioSalvo && email === usuarioSalvo.email && senha === usuarioSalvo.senha) {
    localStorage.setItem("autenticado", "true");
    window.location.href = "index.html";
  } else {
    alert("E-mail ou senha inválidos!");
  }
});

if (window.location.pathname.includes("index.html") && !localStorage.getItem("autenticado")) {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("autenticado");
  window.location.href = "login.html";
}


const formCarro = document.getElementById('form-carro');
const resumoDiv = document.getElementById('resumo-aluguel');
const detalhesResumo = document.getElementById('detalhes-resumo');

let cidadeSelecionada = "";
let marcaSelecionada = "";

formCarro?.addEventListener('submit', function (event) {
  event.preventDefault();

  cidadeSelecionada = document.getElementById('cidade-retirada').value;
  marcaSelecionada = document.getElementById('marca-carro').value;

  detalhesResumo.innerHTML = `
    <p><strong>Cidade de Retirada:</strong> ${cidadeSelecionada}</p>
    <p><strong>Marca do Carro:</strong> ${marcaSelecionada}</p>
  `;

  formCarro.classList.add('d-none');
  resumoDiv.classList.remove('d-none');
});

document.getElementById('btn-editar')?.addEventListener('click', () => {
  resumoDiv.classList.add('d-none');
  formCarro.classList.remove('d-none');
});

document.getElementById('btn-confirmar')?.addEventListener('click', () => {
  window.location.href = `carros.html?cidade=${encodeURIComponent(cidadeSelecionada)}&marca=${encodeURIComponent(marcaSelecionada)}`;
});

