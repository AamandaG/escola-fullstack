"use client";

import { useEffect, useState } from "react";
import Header from "../components/header";
import styles from "./page.module.css";

const diasSemana = [
  ["Segunda-feira", "Segunda-feira"],
  ["Terca-feira", "Terça-feira"],
  ["Quarta-feira", "Quarta-feira"],
  ["Quinta-feira", "Quinta-feira"],
  ["Sexta-feira", "Sexta-feira"],
  ["Sabado", "Sábado"],
  ["Domingo", "Domingo"],
];

const professorVazio = {
  nome: "",
  matricula_nif: "",
  disciplina_id: "",
  total_aulas_semana: "",
  dias_aula: [],
};
const disciplinaVazia = { nome: "", pontuacao_minima: "" };

export default function Cadastros() {
  const [aba, setAba] = useState("professores");
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [professor, setProfessor] = useState(professorVazio);
  const [disciplina, setDisciplina] = useState(disciplinaVazia);
  const [salvando, setSalvando] = useState(false);

  async function carregarCadastros() {
    const [respostaProfessores, respostaDisciplinas] = await Promise.all([
      fetch("/api/professores", { cache: "no-store" }),
      fetch("/api/disciplinas", { cache: "no-store" }),
    ]);
    if (!respostaProfessores.ok || !respostaDisciplinas.ok) {
      throw new Error("Não foi possível carregar os cadastros.");
    }
    const [dadosProfessores, dadosDisciplinas] = await Promise.all([
      respostaProfessores.json(),
      respostaDisciplinas.json(),
    ]);
    setProfessores(dadosProfessores.professores);
    setDisciplinas(dadosDisciplinas.disciplinas);
  }

  useEffect(() => {
    let ativo = true;
    Promise.all([
      fetch("/api/professores", { cache: "no-store" }),
      fetch("/api/disciplinas", { cache: "no-store" }),
    ])
      .then(async ([respostaProfessores, respostaDisciplinas]) => {
        if (!respostaProfessores.ok || !respostaDisciplinas.ok) {
          throw new Error("Não foi possível carregar os cadastros.");
        }
        const [dadosProfessores, dadosDisciplinas] = await Promise.all([
          respostaProfessores.json(),
          respostaDisciplinas.json(),
        ]);
        if (ativo) {
          setProfessores(dadosProfessores.professores);
          setDisciplinas(dadosDisciplinas.disciplinas);
        }
      })
      .catch((error) => {
        if (ativo) setErro(error.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  function limparFormulario() {
    setProfessor(professorVazio);
    setDisciplina(disciplinaVazia);
    setEditandoId(null);
    setErro("");
    setMensagem("");
  }

  function trocarAba(novaAba) {
    limparFormulario();
    setAba(novaAba);
  }

  function iniciarEdicaoProfessor(item) {
    setAba("professores");
    setErro("");
    setMensagem("");
    setEditandoId(item.id_professor);
    setProfessor({
      nome: item.nome,
      matricula_nif: item.matricula_nif,
      disciplina_id: String(item.disciplina_id),
      total_aulas_semana: String(item.total_aulas_semana),
      dias_aula: item.dias_aula,
    });
  }

  function iniciarEdicaoDisciplina(item) {
    setAba("disciplinas");
    setErro("");
    setMensagem("");
    setEditandoId(item.id_disciplina);
    setDisciplina({
      nome: item.nome,
      pontuacao_minima: String(item.pontuacao_minima),
    });
  }

  function alternarDia(dia) {
    setProfessor((atual) => ({
      ...atual,
      dias_aula: atual.dias_aula.includes(dia)
        ? atual.dias_aula.filter((item) => item !== dia)
        : [...atual.dias_aula, dia],
    }));
  }

  async function enviarFormulario(event) {
    event.preventDefault();
    const ehProfessor = aba === "professores";
    const url = ehProfessor ? "/api/professores" : "/api/disciplinas";
    const corpo = ehProfessor ? professor : disciplina;
    setErro("");
    setMensagem("");
    setSalvando(true);

    try {
      const resposta = await fetch(url, {
        method: editandoId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editandoId
            ? { ...corpo, [ehProfessor ? "id_professor" : "id_disciplina"]: editandoId }
            : corpo
        ),
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || "Não foi possível salvar o cadastro.");

      await carregarCadastros();
      limparFormulario();
      setMensagem(`${ehProfessor ? "Professor" : "Disciplina"} ${editandoId ? "atualizado" : "cadastrado"} com sucesso.`);
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function excluirCadastro(item, ehProfessor) {
    const nome = item.nome;
    if (!window.confirm(`Deseja excluir ${ehProfessor ? "o professor" : "a disciplina"} ${nome}?`)) return;
    setErro("");
    setMensagem("");
    try {
      const id = ehProfessor ? item.id_professor : item.id_disciplina;
      const resposta = await fetch(
        `${ehProfessor ? "/api/professores" : "/api/disciplinas"}?id=${id}`,
        { method: "DELETE" }
      );
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || "Não foi possível excluir o cadastro.");
      await carregarCadastros();
      if (editandoId === id) limparFormulario();
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <section className={styles.heading}>
          <div>
            <span className={styles.kicker}>Gestão acadêmica</span>
            <h1>Professores e disciplinas</h1>
            <p>Cadastre professores com matrícula, dias e carga semanal, e vincule cada um à sua disciplina.</p>
          </div>
        </section>

        <div className={styles.tabs} role="tablist" aria-label="Tipo de cadastro">
          <button type="button" role="tab" aria-selected={aba === "professores"} className={aba === "professores" ? styles.activeTab : ""} onClick={() => trocarAba("professores")}>
            Professores
          </button>
          <button type="button" role="tab" aria-selected={aba === "disciplinas"} className={aba === "disciplinas" ? styles.activeTab : ""} onClick={() => trocarAba("disciplinas")}>
            Disciplinas
          </button>
        </div>

        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <span className={styles.panelLabel}>{editandoId ? "Edição de cadastro" : "Novo cadastro"}</span>
              <h2>{aba === "professores" ? "Dados do professor" : "Dados da disciplina"}</h2>
            </div>
          </div>

          <form className={styles.form} onSubmit={enviarFormulario}>
            {aba === "professores" ? (
              <>
                <label className={styles.field}>
                  <span>Nome do professor</span>
                  <input required maxLength={150} value={professor.nome} onChange={(event) => setProfessor({ ...professor, nome: event.target.value })} />
                </label>
                <label className={styles.field}>
                  <span>Matrícula (NIF)</span>
                  <input required maxLength={50} value={professor.matricula_nif} onChange={(event) => setProfessor({ ...professor, matricula_nif: event.target.value })} />
                </label>
                <label className={styles.field}>
                  <span>Disciplina responsável</span>
                  <select required value={professor.disciplina_id} onChange={(event) => setProfessor({ ...professor, disciplina_id: event.target.value })}>
                    <option value="">Selecione uma disciplina</option>
                    {disciplinas.map((item) => <option key={item.id_disciplina} value={item.id_disciplina}>{item.nome}</option>)}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Total de aulas na semana</span>
                  <input required type="number" min="0" step="1" value={professor.total_aulas_semana} onChange={(event) => setProfessor({ ...professor, total_aulas_semana: event.target.value })} />
                </label>
                <fieldset className={styles.daysField}>
                  <legend>Dias que ministra aula</legend>
                  <div className={styles.days}>
                    {diasSemana.map(([valor, rotulo]) => (
                      <label key={valor}>
                        <input type="checkbox" checked={professor.dias_aula.includes(valor)} onChange={() => alternarDia(valor)} />
                        {rotulo}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            ) : (
              <>
                <label className={styles.field}>
                  <span>Nome da disciplina</span>
                  <input required maxLength={150} value={disciplina.nome} onChange={(event) => setDisciplina({ ...disciplina, nome: event.target.value })} />
                </label>
                <label className={styles.field}>
                  <span>Pontuação mínima para passar (0 a 10)</span>
                  <input required type="number" min="0" max="10" step="0.1" value={disciplina.pontuacao_minima} onChange={(event) => setDisciplina({ ...disciplina, pontuacao_minima: event.target.value })} />
                </label>
              </>
            )}
            {erro && <p className={styles.error} role="alert">{erro}</p>}
            {mensagem && <p className={styles.success} role="status">{mensagem}</p>}
            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryButton} disabled={salvando || (aba === "professores" && disciplinas.length === 0)}>
                {salvando ? "Salvando..." : editandoId ? "Salvar alterações" : "Cadastrar"}
              </button>
              {editandoId && <button type="button" className={styles.secondaryButton} onClick={limparFormulario}>Cancelar edição</button>}
              {aba === "professores" && disciplinas.length === 0 && <span className={styles.hint}>Cadastre uma disciplina antes de adicionar um professor.</span>}
            </div>
          </form>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <span className={styles.panelLabel}>Registros salvos</span>
              <h2>{aba === "professores" ? "Professores cadastrados" : "Disciplinas cadastradas"}</h2>
            </div>
            <span className={styles.count}>{aba === "professores" ? professores.length : disciplinas.length} registros</span>
          </div>
          <div className={styles.tableWrapper}>
            {aba === "professores" ? (
              <table className={styles.table}>
                <thead><tr><th>ID</th><th>Professor</th><th>Matrícula (NIF)</th><th>Disciplina</th><th>Dias de aula</th><th>Aulas/semana</th><th>Ações</th></tr></thead>
                <tbody>
                  {carregando ? <tr><td colSpan="7" className={styles.feedback}>Carregando...</td></tr> : professores.length === 0 ? <tr><td colSpan="7" className={styles.feedback}>Nenhum professor cadastrado.</td></tr> : professores.map((item) => (
                    <tr key={item.id_professor}>
                      <td>{item.id_professor}</td><td>{item.nome}</td><td>{item.matricula_nif}</td><td>{item.disciplina_nome}</td>
                      <td>{item.dias_aula.map((dia) => diasSemana.find(([valor]) => valor === dia)?.[1] || dia).join(", ")}</td>
                      <td>{item.total_aulas_semana}</td>
                      <td className={styles.actions}><button type="button" onClick={() => iniciarEdicaoProfessor(item)}>Editar</button><button type="button" className={styles.deleteButton} onClick={() => excluirCadastro(item, true)}>Excluir</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className={styles.table}>
                <thead><tr><th>ID</th><th>Disciplina</th><th>Pontuação mínima</th><th>Ações</th></tr></thead>
                <tbody>
                  {carregando ? <tr><td colSpan="4" className={styles.feedback}>Carregando...</td></tr> : disciplinas.length === 0 ? <tr><td colSpan="4" className={styles.feedback}>Nenhuma disciplina cadastrada.</td></tr> : disciplinas.map((item) => (
                    <tr key={item.id_disciplina}>
                      <td>{item.id_disciplina}</td><td>{item.nome}</td><td>{item.pontuacao_minima}</td>
                      <td className={styles.actions}><button type="button" onClick={() => iniciarEdicaoDisciplina(item)}>Editar</button><button type="button" className={styles.deleteButton} onClick={() => excluirCadastro(item, false)}>Excluir</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
