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
    {
      nome: "Carlos Henrique",
      cpf: "33322211100",
      data: "1978-07-19",
      internado: "Sim",
      dataInternacao: "2025-05-20",
    },
    {
      nome: "Fernanda Lima",
      cpf: "99988877766",
      data: "1992-11-03",
      internado: "Não",
      dataInternacao: "",
    },
  ];
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  registrarLog("Teste", "5 pacientes cadastrados");

  // Profissionais
  const profissionais = [
    { nome: "Dr. Carlos", funcao: "Médico", especialidade: "Cardiologia" },
    { nome: "Enf. Juliana", funcao: "Enfermeiro", especialidade: "UTI" },
    { nome: "Tec. Marcos", funcao: "Técnico", especialidade: "Raio-X" },
    { nome: "Dra. Paula", funcao: "Médico", especialidade: "Pediatria" },
  ];
  localStorage.setItem("profissionais", JSON.stringify(profissionais));
  registrarLog("Teste", "4 profissionais cadastrados");

  // Consultas
  const consultas = [
    { paciente: "Maria Alves", data: "2025-06-01", hora: "10:00" },
    { paciente: "João Pedro", data: "2025-06-03", hora: "14:30" },
    { paciente: "Ana Beatriz", data: "2025-06-04", hora: "11:00" },
    { paciente: "Carlos Henrique", data: "2025-06-05", hora: "09:00" },
  ];
  localStorage.setItem("consultas", JSON.stringify(consultas));
  registrarLog("Teste", "4 consultas agendadas");

  // Unidades com leitos
  const unidades = [
    {
      nome: "Hospital Centro",
      endereco: "Av. Brasil, 100",
      leitos: [
        { id: "Leito 01", status: "disponível" },
        { id: "Leito 02", status: "ocupado" },
        { id: "Leito 03", status: "disponível" },
        { id: "Leito 04", status: "ocupado" },
      ],
    },
    {
      nome: "Clínica Norte",
      endereco: "Rua das Flores, 200",
      leitos: [
        { id: "Leito 01", status: "ocupado" },
        { id: "Leito 02", status: "disponível" },
      ],
    },
  ];
  localStorage.setItem("unidades", JSON.stringify(unidades));
  registrarLog("Teste", "2 unidades com 6 leitos cadastrados");

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
    {
      tipo: "Receita",
      descricao: "Exame laboratorial",
      valor: 180.0,
      data: "2025-06-03",
    },
  ];
  localStorage.setItem("financeiro", JSON.stringify(financeiro));
  registrarLog("Teste", "3 lançamentos financeiros adicionados");

  // Suprimentos
  const suprimentos = [
    { nome: "Luvas Cirúrgicas", qtd: 150 },
    { nome: "Soro Fisiológico", qtd: 40 },
    { nome: "Máscaras N95", qtd: 80 },
    { nome: "Algodão", qtd: 200 },
  ];
  localStorage.setItem("suprimentos", JSON.stringify(suprimentos));
  registrarLog("Teste", "4 itens de suprimento adicionados");

  mostrarToast("Teste automatizado concluído com sucesso!", "sucesso");
}
