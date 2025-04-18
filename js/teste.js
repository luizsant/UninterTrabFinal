function executarTeste() {
  // Pacientes
  const pacientes = [
    {
      nome: "Maria Alves",
      cpf: "12345678901",
      data: "1990-05-12",
      internado: "Não",
      dataInternacao: "",
    },
    {
      nome: "João Pedro",
      cpf: "98765432100",
      data: "1985-03-22",
      internado: "Sim",
      dataInternacao: "2025-05-15",
    },
    {
      nome: "Ana Beatriz",
      cpf: "11122233344",
      data: "2000-08-09",
      internado: "Não",
      dataInternacao: "",
    },
  ];
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  registrarLog("Teste", "3 pacientes cadastrados");

  // Profissionais
  const profissionais = [
    { nome: "Dr. Carlos", funcao: "Médico", especialidade: "Cardiologia" },
    { nome: "Enf. Juliana", funcao: "Enfermeiro", especialidade: "UTI" },
  ];
  localStorage.setItem("profissionais", JSON.stringify(profissionais));
  registrarLog("Teste", "2 profissionais cadastrados");

  // Consultas
  const consultas = [
    { paciente: "Maria Alves", data: "2025-06-01", hora: "10:00" },
    { paciente: "João Pedro", data: "2025-06-03", hora: "14:30" },
  ];
  localStorage.setItem("consultas", JSON.stringify(consultas));
  registrarLog("Teste", "2 consultas agendadas");

  // Unidades com leitos
  const unidades = [
    {
      nome: "Hospital Centro",
      endereco: "Av. Brasil, 100",
      leitos: [
        { id: "Leito 01", status: "disponível" },
        { id: "Leito 02", status: "ocupado" },
      ],
    },
  ];
  localStorage.setItem("unidades", JSON.stringify(unidades));
  registrarLog("Teste", "1 unidade com 2 leitos cadastrada");

  // Financeiro
  const financeiro = [
    {
      tipo: "Receita",
      descricao: "Consulta particular",
      valor: 300.0,
      data: "2025-06-01",
    },
    {
      tipo: "Despesa",
      descricao: "Compra de luvas",
      valor: 90.0,
      data: "2025-06-02",
    },
  ];
  localStorage.setItem("financeiro", JSON.stringify(financeiro));
  registrarLog("Teste", "2 lançamentos financeiros adicionados");

  // Suprimentos
  const suprimentos = [
    { nome: "Luvas Cirúrgicas", qtd: 150 },
    { nome: "Soro Fisiológico", qtd: 40 },
  ];
  localStorage.setItem("suprimentos", JSON.stringify(suprimentos));
  registrarLog("Teste", "2 itens de suprimento adicionados");

  mostrarToast("Teste automatizado concluído!", "sucesso");
}
