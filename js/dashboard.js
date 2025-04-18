// Protege a página: redireciona para o login se não estiver autenticado
if (localStorage.getItem("logado") !== "true") {
  window.location.href = "index.html";
}

// Aplica modo escuro salvo (ao carregar a página)
window.onload = () => {
  const modoSalvo = localStorage.getItem("modo");
  if (modoSalvo === "escuro") {
    document.body.classList.add("dark-mode");
  }
};

// Alternar modo claro/escuro e salvar preferência
function alternarModo() {
  document.body.classList.toggle("dark-mode");
  const modo = document.body.classList.contains("dark-mode")
    ? "escuro"
    : "claro";
  localStorage.setItem("modo", modo);
}

// Navegação dinâmica entre telas
function mostrarConteudo(pagina) {
  const conteudo = document.getElementById("conteudo");
  window.scrollTo({ top: 0, behavior: "smooth" });

  switch (pagina) {
    case "home":
      conteudo.innerHTML = `<h1>Bem-vindo ao SGHSS</h1><p>Selecione uma opção no menu para começar.</p>`;
      break;
    case "auditoria":
      const logs = JSON.parse(localStorage.getItem("logs")) || [];

      let htmlLogs = `<h1>📋 Auditoria do Sistema</h1>`;

      if (logs.length === 0) {
        htmlLogs += `<p>Nenhuma ação registrada até o momento.</p>`;
      } else {
        htmlLogs += `<table class="tabela-consultas">
      <thead><tr><th>Usuário</th><th>Ação</th><th>Detalhes</th><th>Data/Hora</th></tr></thead>
      <tbody>`;

        logs.forEach((log) => {
          htmlLogs += `
        <tr>
          <td>${log.usuario}</td>
          <td>${log.acao}</td>
          <td>${log.detalhe}</td>
          <td>${log.data}</td>
        </tr>`;
        });

        htmlLogs += `</tbody></table>`;
      }

      conteudo.innerHTML = htmlLogs;
      break;

    case "teleconsulta":
      conteudo.innerHTML = `
    <h1>Teleconsulta</h1>
    <div style="display:flex; flex-direction: column; align-items: center; background:#fff; padding:30px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
      <img src="https://www.w3schools.com/howto/img_avatar.png" width="100" style="border-radius:50%; margin-bottom:20px;">
      <p>Dr. João Pedro (Clínico Geral)</p>
      <p><strong>Status:</strong> disponível</p>
      <button style="margin-top:20px;" onclick="window.open('https://meet.google.com/', '_blank')">🎥 Iniciar Chamada</button>
    </div>
  `;
      break;
    case "administracao":
      const lancamentos = JSON.parse(localStorage.getItem("financeiro")) || [];
      const suprimentos = JSON.parse(localStorage.getItem("suprimentos")) || [];

      let saldo = lancamentos.reduce((acc, l) => {
        return acc + (l.tipo === "Receita" ? l.valor : -l.valor);
      }, 0);

      let htmlAdmin = `
          <h1>💼 Administração Hospitalar</h1>
      
          <h2>📊 Relatórios Financeiros</h2>
          <form id="formFinanceiro" class="formulario">
            <label for="tipoFinanceiro">Tipo:</label>
            <select id="tipoFinanceiro" required>
              <option value="Receita">Receita</option>
              <option value="Despesa">Despesa</option>
            </select>
      
            <label for="descFinanceiro">Descrição:</label>
            <input type="text" id="descFinanceiro" required>
      
            <label for="valorFinanceiro">Valor (R$):</label>
            <input type="number" id="valorFinanceiro" step="0.01" required>
      
            <label for="dataFinanceiro">Data:</label>
            <input type="date" id="dataFinanceiro" required>
      
            <button type="submit">Lançar</button>
          </form>
      
          <table class="tabela-consultas" style="margin-top:20px;">
            <thead><tr><th>Tipo</th><th>Descrição</th><th>Valor</th><th>Data</th></tr></thead>
            <tbody>
        `;

      lancamentos.forEach((l) => {
        htmlAdmin += `
            <tr>
              <td>${l.tipo}</td>
              <td>${l.descricao}</td>
              <td>R$ ${l.valor.toFixed(2)}</td>
              <td>${l.data}</td>
            </tr>`;
      });

      htmlAdmin += `</tbody></table>
          <p><strong>Saldo:</strong> R$ ${saldo.toFixed(2)}</p>
          <hr>
      
          <h2>🧰 Suprimentos Hospitalares</h2>
          <form id="formSuprimento" class="formulario">
            <label for="nomeSuprimento">Nome do Item:</label>
            <input type="text" id="nomeSuprimento" required>
      
            <label for="qtdSuprimento">Quantidade Inicial:</label>
            <input type="number" id="qtdSuprimento" required>
      
            <button type="submit">Adicionar Item</button>
          </form>
      
          <table class="tabela-consultas" style="margin-top:20px;">
            <thead><tr><th>Item</th><th>Quantidade</th><th>Ações</th></tr></thead>
            <tbody>
        `;

      suprimentos.forEach((s, i) => {
        htmlAdmin += `
            <tr>
              <td>${s.nome}</td>
              <td>${s.qtd}</td>
              <td>
                <button onclick="atualizarSuprimento(${i}, 'entrada')">+</button>
                <button onclick="atualizarSuprimento(${i}, 'saida')">-</button>
              </td>
            </tr>`;
      });

      htmlAdmin += `</tbody></table>`;

      conteudo.innerHTML = htmlAdmin;

      // Listener para financeiro
      document
        .getElementById("formFinanceiro")
        .addEventListener("submit", function (e) {
          e.preventDefault();
          const tipo = document.getElementById("tipoFinanceiro").value;
          const descricao = document
            .getElementById("descFinanceiro")
            .value.trim();
          const valor = parseFloat(
            document.getElementById("valorFinanceiro").value
          );
          const data = document.getElementById("dataFinanceiro").value;

          if (descricao && valor && data) {
            lancamentos.push({ tipo, descricao, valor, data });
            localStorage.setItem("financeiro", JSON.stringify(lancamentos));
            registrarLog(
              "Lançamento financeiro",
              `${tipo} de R$ ${valor.toFixed(2)} - ${descricao}`
            );
            mostrarToast("Lançamento registrado!", "sucesso");
            mostrarConteudo("administracao");
          } else {
            mostrarToast("Preencha todos os campos.", "erro");
          }
        });

      // Listener para suprimento
      document
        .getElementById("formSuprimento")
        .addEventListener("submit", function (e) {
          e.preventDefault();
          const nome = document.getElementById("nomeSuprimento").value.trim();
          const qtd = parseInt(document.getElementById("qtdSuprimento").value);

          if (nome && qtd >= 0) {
            suprimentos.push({ nome, qtd });
            localStorage.setItem("suprimentos", JSON.stringify(suprimentos));
            registrarLog(
              "Cadastro de suprimento",
              `Item: ${nome}, Quantidade: ${qtd}`
            );
            mostrarToast("Item adicionado!", "sucesso");
            mostrarConteudo("administracao");
          } else {
            mostrarToast("Preencha os dados corretamente.", "erro");
          }
        });
      break;

    case "leitos":
      const unidadesLeitos = JSON.parse(localStorage.getItem("unidades")) || [];

      if (unidadesLeitos.length === 0) {
        conteudo.innerHTML = `<h1>Leitos por Unidade</h1><p>Não há nenhuma unidade cadastrada ainda.</p>`;
        break;
      }

      let selectUnidades = `
          <h1>Leitos por Unidade</h1>
          <label for="selecionarUnidade">Escolha a Unidade:</label>
          <select id="selecionarUnidade" style="margin-bottom:20px; padding:10px; border-radius:6px;">
            <option value="">-- Selecione --</option>
        `;

      unidadesLeitos.forEach((u, i) => {
        selectUnidades += `<option value="${i}">${u.nome}</option>`;
      });

      selectUnidades += `</select>
          <div id="leitosPorUnidade"></div>`;

      conteudo.innerHTML = selectUnidades;

      document
        .getElementById("selecionarUnidade")
        .addEventListener("change", function () {
          const index = this.value;
          if (index !== "") {
            gerenciarLeitosUnidade(parseInt(index));
          }
        });
      break;

    case "profissionais":
      const profissionais =
        JSON.parse(localStorage.getItem("profissionais")) || [];

      let htmlProfissionais = `
          <h1>Cadastro de Profissionais de Saúde</h1>
          <form id="formProfissional" class="formulario">
            <label for="nomeProf">Nome:</label>
            <input type="text" id="nomeProf" required>
      
            <label for="funcaoProf">Função:</label>
            <select id="funcaoProf" required>
              <option value="">Selecione</option>
              <option>Médico</option>
              <option>Enfermeiro</option>
              <option>Técnico</option>
            </select>
      
            <label for="espProf">Especialidade:</label>
            <input type="text" id="espProf" required>
      
            <button type="submit">Salvar Profissional</button>
          </form>
          <hr>
          <h2>Lista de Profissionais</h2>
          <table class="tabela-consultas">
            <thead>
              <tr>
                <th>Nome</th><th>Função</th><th>Especialidade</th><th>Ações</th>
              </tr>
            </thead>
            <tbody id="listaProfissionais">`;

      profissionais.forEach((p, i) => {
        htmlProfissionais += `
            <tr>
              <td><input type="text" value="${p.nome}" onchange="editarProfissional(${i}, 'nome', this.value)"></td>
              <td><input type="text" value="${p.funcao}" onchange="editarProfissional(${i}, 'funcao', this.value)"></td>
              <td><input type="text" value="${p.especialidade}" onchange="editarProfissional(${i}, 'especialidade', this.value)"></td>
              <td><button onclick="excluirProfissional(${i})">Excluir</button></td>
            </tr>`;
      });

      htmlProfissionais += `</tbody></table>`;
      conteudo.innerHTML = htmlProfissionais;

      document
        .getElementById("formProfissional")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const nome = document.getElementById("nomeProf").value.trim();
          const funcao = document.getElementById("funcaoProf").value;
          const especialidade = document.getElementById("espProf").value.trim();

          if (nome && funcao && especialidade) {
            const profissionais =
              JSON.parse(localStorage.getItem("profissionais")) || [];
            profissionais.push({ nome, funcao, especialidade });
            localStorage.setItem(
              "profissionais",
              JSON.stringify(profissionais)
            );
            mostrarToast("Profissional cadastrado com sucesso!", "sucesso");
            mostrarConteudo("profissionais");
          } else {
            mostrarToast("Preencha todos os campos!", "erro");
          }
        });
      break;

    case "cadastro":
      conteudo.innerHTML = `
          <h1>Cadastro de Paciente</h1>
          <form id="formCadastro" class="formulario">
            <label for="nome">Nome Completo:</label>
            <input type="text" id="nome" required>
      
            <label for="cpf">CPF:</label>
            <input type="text" id="cpf" required>
      
            <label for="dataNascimento">Data de Nascimento:</label>
            <input type="date" id="dataNascimento" required>
      
            <label for="internado">Internado?</label>
            <select id="internado">
              <option value="Não">Não</option>
              <option value="Sim">Sim</option>
            </select>
      
            <label for="dataInternacao">Data da Internação:</label>
            <input type="date" id="dataInternacao">
      
            <button type="submit">Salvar Paciente</button>
          </form>
          <p id="mensagemCadastro"></p>
        `;

      document
        .getElementById("formCadastro")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const nome = document.getElementById("nome").value.trim();
          const cpf = document.getElementById("cpf").value.trim();
          const data = document.getElementById("dataNascimento").value;
          const internado = document.getElementById("internado").value;
          const dataInternacao =
            document.getElementById("dataInternacao").value;
          const mensagem = document.getElementById("mensagemCadastro");

          if (!nome || !cpf || !data) {
            mensagem.textContent = "Preencha todos os campos obrigatórios.";
            mensagem.style.color = "red";
            return;
          }

          const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
          pacientes.push({ nome, cpf, data, internado, dataInternacao });
          localStorage.setItem("pacientes", JSON.stringify(pacientes));

          registrarLog("Cadastro de paciente", `Nome: ${nome}`);

          mensagem.textContent = "Paciente cadastrado com sucesso!";
          mensagem.style.color = "green";
          document.getElementById("formCadastro").reset();
        });
      break;

    case "agendamento":
      const pacientesAgendamento =
        JSON.parse(localStorage.getItem("pacientes")) || [];

      if (pacientesAgendamento.length === 0) {
        conteudo.innerHTML = `<h1>Agendamento de Consulta</h1><p>Nenhum paciente cadastrado. Cadastre um paciente primeiro.</p>`;
        break;
      }

      // Monta as opções do select
      let opcoes = pacientesAgendamento
        .map((p) => `<option value="${p.nome}">${p.nome}</option>`)
        .join("");

      conteudo.innerHTML = `
          <h1>Agendamento de Consulta</h1>
          <form id="formAgendamento" class="formulario">
            <label for="paciente">Paciente:</label>
            <select id="paciente">${opcoes}</select>
      
            <label for="data">Data da Consulta:</label>
            <input type="date" id="data">
      
            <label for="hora">Hora da Consulta:</label>
            <input type="time" id="hora">
      
            <button type="submit">Agendar Consulta</button>
          </form>`;

      document
        .getElementById("formAgendamento")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const paciente = document.getElementById("paciente").value;
          const data = document.getElementById("data").value;
          const hora = document.getElementById("hora").value;

          if (paciente && data && hora) {
            const consultas =
              JSON.parse(localStorage.getItem("consultas")) || [];
            consultas.push({ paciente, data, hora });
            localStorage.setItem("consultas", JSON.stringify(consultas));

            mostrarToast(
              `Consulta para ${paciente} agendada em ${data} às ${hora}.`,
              "sucesso"
            );

            document.getElementById("formAgendamento").reset();
          } else {
            mostrarToast("Preencha todos os campos para agendar.", "erro");
          }
        });
      break;

    case "consultas":
      const consultas = JSON.parse(localStorage.getItem("consultas")) || [];

      if (consultas.length === 0) {
        conteudo.innerHTML = `<h1>Consultas Agendadas</h1><p>Nenhuma consulta agendada.</p>`;
        break;
      }

      let htmlConsultas = `
          <h1>Consultas Agendadas</h1>
          <table class="tabela-consultas">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
        `;

      consultas.forEach((c, i) => {
        htmlConsultas += `
            <tr>
              <td>${c.paciente}</td>
              <td><input type="date" value="${c.data}" onchange="editarConsulta(${i}, 'data', this.value)"></td>
              <td><input type="time" value="${c.hora}" onchange="editarConsulta(${i}, 'hora', this.value)"></td>
              <td><button onclick="excluirConsulta(${i})">❌ Cancelar Consulta</button></td>
            </tr>`;
      });

      htmlConsultas += `
            </tbody>
          </table>
          <br><button onclick="exportarConsultasPDF()">📄 Exportar PDF</button>
        `;

      conteudo.innerHTML = htmlConsultas;
      break;

    case "pacientes":
      const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

      if (pacientes.length === 0) {
        conteudo.innerHTML = `<h1>Pacientes Cadastrados</h1><p>Nenhum paciente cadastrado.</p>`;
        break;
      }

      let htmlPacientes = `
          <h1>Pacientes Cadastrados</h1>
          <table class="tabela-consultas">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Nascimento</th>
                <th>Internado?</th>
                <th>Data Internação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="listaPacientes">
        `;

      pacientes.forEach((p, i) => {
        htmlPacientes += `
            <tr>
              <td><input type="text" value="${
                p.nome
              }" onchange="editarPaciente(${i}, 'nome', this.value)"></td>
              <td><input type="text" value="${
                p.cpf
              }" onchange="editarPaciente(${i}, 'cpf', this.value)"></td>
              <td><input type="date" value="${
                p.data
              }" onchange="editarPaciente(${i}, 'data', this.value)"></td>
              <td>
                <select onchange="editarPaciente(${i}, 'internado', this.value)">
                  <option value="Sim" ${
                    p.internado === "Sim" ? "selected" : ""
                  }>Sim</option>
                  <option value="Não" ${
                    p.internado !== "Sim" ? "selected" : ""
                  }>Não</option>
                </select>
              </td>
              <td>
                <input type="date" value="${
                  p.dataInternacao || ""
                }" onchange="editarPaciente(${i}, 'dataInternacao', this.value)">
              </td>
              <td><button onclick="excluirPaciente(${i})">Excluir</button></td>
            </tr>`;
      });

      htmlPacientes += `
            </tbody>
          </table>
          <br><button onclick="exportarPacientesPDF()">📄 Exportar PDF</button>
        `;

      conteudo.innerHTML = htmlPacientes;
      break;

    case "unidades":
      const unidades = JSON.parse(localStorage.getItem("unidades")) || [];

      let htmlUnidades = `
          <h1>Cadastro de Unidades Hospitalares</h1>
          <form id="formUnidade" class="formulario">
            <label for="nomeUnidade">Nome da Unidade:</label>
            <input type="text" id="nomeUnidade" required>
      
            <label for="enderecoUnidade">Endereço:</label>
            <input type="text" id="enderecoUnidade" required>
      
            <button type="submit">Salvar Unidade</button>
          </form>
          <hr>
          <h2>Lista de Unidades</h2>
          <table class="tabela-consultas">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Endereço</th>
                <th>Leitos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="listaUnidades">`;

      unidades.forEach((u, i) => {
        htmlUnidades += `
            <tr>
              <td><input type="text" value="${
                u.nome
              }" onchange="editarUnidade(${i}, 'nome', this.value)"></td>
              <td><input type="text" value="${
                u.endereco
              }" onchange="editarUnidade(${i}, 'endereco', this.value)"></td>
              <td>${u.leitos?.length || 0}</td>
              <td>
                <button onclick="excluirUnidade(${i})">Excluir</button>
                <button onclick="gerenciarLeitosUnidade(${i})" style="margin-left:8px;">🔧 Gerenciar Leitos</button>
              </td>
            </tr>`;
      });

      htmlUnidades += `</tbody></table>`;
      conteudo.innerHTML = htmlUnidades;

      document
        .getElementById("formUnidade")
        .addEventListener("submit", function (e) {
          e.preventDefault();
          const nome = document.getElementById("nomeUnidade").value.trim();
          const endereco = document
            .getElementById("enderecoUnidade")
            .value.trim();

          if (nome && endereco) {
            unidades.push({ nome, endereco, leitos: [] });
            localStorage.setItem("unidades", JSON.stringify(unidades));
            mostrarToast("Unidade cadastrada com sucesso!", "sucesso");
            mostrarConteudo("unidades");
          } else {
            mostrarToast("Preencha todos os campos!", "erro");
          }
        });
      break;

    case "prontuario":
      const pacientesComProntuario =
        JSON.parse(localStorage.getItem("pacientes")) || [];

      if (pacientesComProntuario.length === 0) {
        conteudo.innerHTML = `<h1>Prontuários</h1><p>Nenhum paciente cadastrado.</p>`;
        break;
      }

      let htmlProntuarios = `<h1>Prontuários</h1><ul style="list-style:none; padding:0;">`;

      pacientesComProntuario.forEach((p, i) => {
        htmlProntuarios += `
            <li style="margin-bottom: 10px; background:#fff; padding:10px; border-radius:8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <strong>${p.nome}</strong><br>
              CPF: ${p.cpf}<br>
              Nascimento: ${p.data}<br>
              <button onclick="abrirProntuario(${i})">📝 Ver/Editar Prontuário</button>
            </li>`;
      });

      htmlProntuarios += `</ul>`;
      conteudo.innerHTML = htmlProntuarios;
      break;
  }
}

// Logout e limpeza do login
function logout() {
  localStorage.removeItem("logado");
  window.location.href = "index.html";
}
function mostrarToast(mensagem, tipo = "sucesso") {
  const toast = document.getElementById("toast");
  toast.textContent = mensagem;

  // Define cor com base no tipo
  toast.style.setProperty(
    "--toast-color",
    tipo === "erro" ? "#dc3545" : "#28a745"
  );

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
async function exportarPacientesPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

  if (pacientes.length === 0) {
    mostrarToast("Nenhum paciente para exportar.", "erro");
    return;
  }

  doc.setFontSize(14);
  doc.text("Lista de Pacientes - SGHSS", 10, 10);

  let y = 20;
  pacientes.forEach((p, i) => {
    const linha = `${i + 1}. Nome: ${p.nome} | CPF: ${p.cpf} | Nascimento: ${
      p.data
    }`;
    doc.text(linha, 10, y);
    y += 10;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("pacientes_sghss.pdf");
}
async function exportarConsultasPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const consultas = JSON.parse(localStorage.getItem("consultas")) || [];

  if (consultas.length === 0) {
    mostrarToast("Nenhuma consulta para exportar.", "erro");
    return;
  }

  doc.setFontSize(14);
  doc.text("Consultas Agendadas - SGHSS", 10, 10);

  let y = 20;
  consultas.forEach((c, i) => {
    doc.text(
      `${i + 1}. Paciente: ${c.paciente} | Data: ${c.data} | Hora: ${c.hora}`,
      10,
      y
    );
    y += 10;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("consultas_sghss.pdf");
}
function resetarSistema() {
  const confirmar = confirm(
    "Tem certeza que deseja apagar todos os dados do sistema? Essa ação não pode ser desfeita."
  );

  if (confirmar) {
    localStorage.removeItem("pacientes");
    localStorage.removeItem("consultas");
    localStorage.removeItem("logado");
    localStorage.removeItem("modo");

    mostrarToast("Sistema resetado com sucesso.", "sucesso");

    // Aguarda 1 segundo e redireciona para tela de login
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } else {
    mostrarToast("Reset cancelado.", "erro");
  }
}
function editarConsulta(index, campo, novoValor) {
  const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
  consultas[index][campo] = novoValor;
  localStorage.setItem("consultas", JSON.stringify(consultas));
  mostrarToast("Consulta atualizada!", "sucesso");
}

function excluirConsulta(index) {
  const consultas = JSON.parse(localStorage.getItem("consultas")) || [];

  if (confirm("Deseja realmente cancelar esta consulta?")) {
    const consultaCancelada = consultas[index]; // salvar antes de remover

    consultas.splice(index, 1);
    localStorage.setItem("consultas", JSON.stringify(consultas));

    mostrarToast("Consulta cancelada!", "sucesso");
    registrarLog(
      "Cancelamento de consulta",
      `Paciente: ${consultaCancelada.paciente}`
    );
    mostrarConteudo("consultas");
  }
}

function editarPaciente(index, campo, novoValor) {
  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  pacientes[index][campo] = novoValor;
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  mostrarToast("Paciente atualizado!", "sucesso");
}

function excluirPaciente(index) {
  if (confirm("Deseja realmente excluir este paciente?")) {
    const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
    pacientes.splice(index, 1);
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
    mostrarToast("Paciente excluído!", "sucesso");
    mostrarConteudo("pacientes"); // atualiza a tela
  }
}
function abrirProntuario(index) {
  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  const p = pacientes[index];

  const prontuarioAtual = p.prontuario || "";
  const prescricaoAtual = p.prescricao || "";

  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = `
    <h1>Prontuário de ${p.nome}</h1>
    <p><strong>CPF:</strong> ${p.cpf}</p>
    <p><strong>Nascimento:</strong> ${p.data}</p>

    <label for="prontuarioTexto">Anotações Clínicas:</label><br>
    <textarea id="prontuarioTexto" rows="8" style="width:100%; border:1px solid #ccc; padding:10px; border-radius:6px;">${prontuarioAtual}</textarea><br><br>

    <label for="prescricaoTexto">Prescrição Médica:</label><br>
    <textarea id="prescricaoTexto" rows="6" style="width:100%; border:1px solid #ccc; padding:10px; border-radius:6px;">${prescricaoAtual}</textarea><br><br>

    <button onclick="salvarProntuario(${index})" class="botao-padrao">💾 Salvar Prontuário</button>
    <button onclick="exportarProntuarioPDF(${index})" class="botao-padrao" style="margin-left:10px;">🧾 Exportar PDF</button>
    <button onclick="mostrarConteudo('prontuario')" class="botao-padrao" style="margin-left:10px;">⬅️ Voltar</button>
  `;
}

function salvarProntuario(index) {
  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  const texto = document.getElementById("prontuarioTexto").value.trim();
  const receita = document.getElementById("prescricaoTexto").value.trim();

  pacientes[index].prontuario = texto;
  pacientes[index].prescricao = receita;

  localStorage.setItem("pacientes", JSON.stringify(pacientes));

  mostrarToast("Prontuário e prescrição salvos com sucesso!", "sucesso");
}

function exportarProntuarioPDF(index) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  const p = pacientes[index];
  const texto = p.prontuario || "Sem anotações.";
  const receita = p.prescricao || "Sem prescrição.";

  doc.setFontSize(14);
  doc.text(`Prontuário Médico - SGHSS`, 10, 10);
  doc.setFontSize(12);
  doc.text(`Nome: ${p.nome}`, 10, 20);
  doc.text(`CPF: ${p.cpf}`, 10, 28);
  doc.text(`Data de Nascimento: ${p.data}`, 10, 36);

  doc.setFontSize(12);
  doc.text("Anotações Clínicas:", 10, 48);
  let y = 58;
  const linhas1 = doc.splitTextToSize(texto, 180);
  doc.text(linhas1, 10, y);
  y += linhas1.length * 8 + 10;

  doc.text("Prescrição Médica:", 10, y);
  y += 10;
  const linhas2 = doc.splitTextToSize(receita, 180);
  doc.text(linhas2, 10, y);

  const nomeArquivo = `prontuario_${p.nome.replace(/ /g, "_")}.pdf`;
  doc.save(nomeArquivo);
}

function exportarBackupJSON() {
  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  const consultas = JSON.parse(localStorage.getItem("consultas")) || [];

  const dados = {
    pacientes,
    consultas,
    exportado_em: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(dados, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "backup_sghss.json";
  link.click();

  URL.revokeObjectURL(url);
  mostrarToast("Backup exportado com sucesso!", "sucesso");
}
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuToggle");
  const sidebar = document.querySelector(".sidebar");

  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("ativa");
  });
});
function editarProfissional(index, campo, novoValor) {
  const profissionais = JSON.parse(localStorage.getItem("profissionais")) || [];
  profissionais[index][campo] = novoValor;
  localStorage.setItem("profissionais", JSON.stringify(profissionais));
  mostrarToast("Profissional atualizado!", "sucesso");
}

function excluirProfissional(index) {
  if (confirm("Deseja realmente excluir este profissional?")) {
    const profissionais =
      JSON.parse(localStorage.getItem("profissionais")) || [];
    profissionais.splice(index, 1);
    localStorage.setItem("profissionais", JSON.stringify(profissionais));
    mostrarToast("Profissional excluído!", "sucesso");
    mostrarConteudo("profissionais");
  }
}
function alternarLeito(index) {
  const leitos = JSON.parse(localStorage.getItem("leitos")) || [];

  leitos[index].status =
    leitos[index].status === "disponível" ? "ocupado" : "disponível";
  localStorage.setItem("leitos", JSON.stringify(leitos));

  mostrarToast(`Status do ${leitos[index].id} atualizado!`, "sucesso");
  mostrarConteudo("leitos");
}
function editarUnidade(index, campo, novoValor) {
  const unidades = JSON.parse(localStorage.getItem("unidades")) || [];
  unidades[index][campo] = novoValor;
  localStorage.setItem("unidades", JSON.stringify(unidades));
  mostrarToast("Unidade atualizada!", "sucesso");
}

function excluirUnidade(index) {
  if (confirm("Deseja excluir esta unidade?")) {
    const unidades = JSON.parse(localStorage.getItem("unidades")) || [];
    unidades.splice(index, 1);
    localStorage.setItem("unidades", JSON.stringify(unidades));
    mostrarToast("Unidade excluída!", "sucesso");
    mostrarConteudo("unidades");
  }
}
function gerenciarLeitosUnidade(index) {
  const unidades = JSON.parse(localStorage.getItem("unidades")) || [];
  const unidade = unidades[index];

  let html = `
    <h1>Leitos - ${unidade.nome}</h1>
    <p><strong>Endereço:</strong> ${unidade.endereco}</p>
    <form id="formNovoLeito" class="formulario">
      <label for="novoLeitoId">ID do novo leito:</label>
      <input type="text" id="novoLeitoId" required>
      <button type="submit">Adicionar Leito</button>
    </form>
    <hr>
    <h2>Leitos Cadastrados (${unidade.leitos.length})</h2>
    <ul style="list-style:none; padding:0;">`;

  unidade.leitos.forEach((leito, i) => {
    html += `
      <li style="margin-bottom: 10px; background:#fff; padding:10px; border-radius:6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <strong>${leito.id}</strong> - ${leito.status}
        <button onclick="alternarStatusLeito(${index}, ${i})" class="botao-padrao" style="margin-left:10px;">
          ${leito.status === "disponível" ? "Ocupar" : "Liberar"}
        </button>
      </li>`;
  });

  html += `</ul><button onclick="mostrarConteudo('unidades')" class="botao-padrao">⬅️ Voltar</button>`;

  document.getElementById("conteudo").innerHTML = html;

  document
    .getElementById("formNovoLeito")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const novoId = document.getElementById("novoLeitoId").value.trim();

      if (!novoId) {
        mostrarToast("Informe o ID do leito.", "erro");
        return;
      }

      unidade.leitos.push({ id: novoId, status: "disponível" });
      localStorage.setItem("unidades", JSON.stringify(unidades));
      mostrarToast("Leito adicionado com sucesso!", "sucesso");
      gerenciarLeitosUnidade(index); // recarrega
    });
}
function alternarStatusLeito(indexUnidade, indexLeito) {
  const unidades = JSON.parse(localStorage.getItem("unidades")) || [];
  const leito = unidades[indexUnidade].leitos[indexLeito];

  leito.status = leito.status === "disponível" ? "ocupado" : "disponível";
  localStorage.setItem("unidades", JSON.stringify(unidades));

  mostrarToast("Status do leito atualizado!", "sucesso");
  gerenciarLeitosUnidade(indexUnidade);
}
function atualizarSuprimento(index, tipo) {
  const suprimentos = JSON.parse(localStorage.getItem("suprimentos")) || [];
  const item = suprimentos[index];

  if (tipo === "entrada") {
    item.qtd++;
    registrarLog(
      "Entrada de suprimento",
      `Item: ${item.nome} (agora ${item.qtd})`
    );
  } else if (tipo === "saida" && item.qtd > 0) {
    item.qtd--;
    registrarLog(
      "Saída de suprimento",
      `Item: ${item.nome} (agora ${item.qtd})`
    );
  }

  localStorage.setItem("suprimentos", JSON.stringify(suprimentos));
  mostrarConteudo("administracao");
}

function registrarLog(acao, detalhe = "") {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  const usuario = localStorage.getItem("usuario") || "admin";
  const data = new Date().toLocaleString("pt-BR");

  logs.push({ usuario, acao, detalhe, data });

  localStorage.setItem("logs", JSON.stringify(logs));
}
