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
      
            <button type="submit">Salvar Paciente</button>
          </form>
          <p id="mensagemCadastro"></p>`;

      document
        .getElementById("formCadastro")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const nome = document.getElementById("nome").value.trim();
          const cpf = document.getElementById("cpf").value.trim();
          const data = document.getElementById("dataNascimento").value;
          const mensagem = document.getElementById("mensagemCadastro");

          if (nome === "" || cpf === "" || data === "") {
            mensagem.textContent = "Preencha todos os campos.";
            mensagem.style.color = "red";
          } else {
            mensagem.textContent = "Paciente cadastrado com sucesso!";
            mensagem.style.color = "green";

            const pacientes =
              JSON.parse(localStorage.getItem("pacientes")) || [];
            pacientes.push({ nome, cpf, data });
            localStorage.setItem("pacientes", JSON.stringify(pacientes));

            document.getElementById("formCadastro").reset();
          }
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
              <td><button onclick="excluirConsulta(${i})">Excluir</button></td>
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
  <input type="text" id="buscaPaciente" placeholder="🔎 Buscar por nome..." style="padding:10px; width:100%; max-width:400px; margin-bottom:20px; border-radius:6px; border:1px solid #ccc;">
  <table class="tabela-consultas">
    <thead>
      <tr>
        <th>Nome</th>
        <th>CPF</th>
        <th>Nascimento</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody id="listaPacientes">
`;

      pacientes.forEach((p, i) => {
        htmlPacientes += `
      <tr>
        <td><input type="text" value="${p.nome}" onchange="editarPaciente(${i}, 'nome', this.value)"></td>
        <td><input type="text" value="${p.cpf}" onchange="editarPaciente(${i}, 'cpf', this.value)"></td>
        <td><input type="date" value="${p.data}" onchange="editarPaciente(${i}, 'data', this.value)"></td>
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
  if (confirm("Deseja realmente excluir esta consulta?")) {
    const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
    consultas.splice(index, 1);
    localStorage.setItem("consultas", JSON.stringify(consultas));
    mostrarToast("Consulta excluída!", "sucesso");
    mostrarConteudo("consultas"); // atualiza a tela
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

  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = `
  <h1>Prontuário de ${p.nome}</h1>
  <p><strong>CPF:</strong> ${p.cpf}</p>
  <p><strong>Nascimento:</strong> ${p.data}</p>

  <label for="prontuarioTexto">Anotações Clínicas:</label><br>
  <textarea id="prontuarioTexto" rows="10" style="width:100%; border:1px solid #ccc; padding:10px; border-radius:6px;">${prontuarioAtual}</textarea><br><br>

  <button onclick="salvarProntuario(${index})">💾 Salvar Prontuário</button>
  <button onclick="exportarProntuarioPDF(${index})" style="margin-left:10px;">🧾 Exportar PDF</button>
  <button onclick="mostrarConteudo('prontuario')" style="margin-left:10px;">⬅️ Voltar</button>
`;
}
function salvarProntuario(index) {
  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  const texto = document.getElementById("prontuarioTexto").value.trim();

  pacientes[index].prontuario = texto;
  localStorage.setItem("pacientes", JSON.stringify(pacientes));

  mostrarToast("Prontuário salvo com sucesso!", "sucesso");
}
function exportarProntuarioPDF(index) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  const p = pacientes[index];
  const texto = document.getElementById("prontuarioTexto").value.trim();

  doc.setFontSize(14);
  doc.text(`Prontuário Médico - SGHSS`, 10, 10);
  doc.setFontSize(12);
  doc.text(`Nome: ${p.nome}`, 10, 20);
  doc.text(`CPF: ${p.cpf}`, 10, 28);
  doc.text(`Data de Nascimento: ${p.data}`, 10, 36);

  doc.setFontSize(12);
  doc.text("Anotações Clínicas:", 10, 48);

  const linhas = doc.splitTextToSize(texto || "Sem observações.", 180);
  doc.text(linhas, 10, 58);

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
