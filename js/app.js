document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (usuario === "admin" && senha === "1234") {
    // Simula login persistente
    localStorage.setItem("logado", "true");
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("mensagemErro").textContent =
      "Usuário ou senha inválidos!";
  }
});
