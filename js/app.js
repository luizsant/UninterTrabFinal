// Função de log simples, compatível com localStorage
function registrarLog(acao, detalhe = "") {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  const usuario = localStorage.getItem("usuario") || "admin";
  const data = new Date().toLocaleString("pt-BR");

  logs.push({ usuario, acao, detalhe, data });
  localStorage.setItem("logs", JSON.stringify(logs));
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (usuario === "admin" && senha === "1234") {
    localStorage.setItem("logado", "true");
    localStorage.setItem("usuario", usuario); // Salva o usuário atual

    registrarLog("Login realizado", `Usuário ${usuario} acessou o sistema`);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("mensagemErro").textContent =
      "Usuário ou senha inválidos!";
  }
});
