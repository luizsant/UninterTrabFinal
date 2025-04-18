const pacientesExemplo = [
  { nome: "Maria Silva", cpf: "123.456.789-00", data: "1990-01-01" },
  { nome: "João Souza", cpf: "987.654.321-00", data: "1985-12-25" }
];

localStorage.setItem("pacientes", JSON.stringify(pacientesExemplo));
