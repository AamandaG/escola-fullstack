"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/header";
import styles from "./page.module.css";

export default function ListAluno() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [erroAcao, setErroAcao] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [formEdicao, setFormEdicao] = useState({ nome: "", idade: "", serie: "", ra: "" });
  const [salvandoId, setSalvandoId] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregarAlunos() {
      try {
        const resposta = await fetch("/api/alunos", { cache: "no-store" });
        if (!resposta.ok) throw new Error("Não foi possível carregar os alunos.");

        const dados = await resposta.json();
        if (ativo) {
          setAlunos(dados.alunos);
          setErro("");
        }
      } catch (error) {
        if (ativo) setErro(error.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    function atualizarAoRetornar() {
      carregarAlunos();
    }

    carregarAlunos();
    window.addEventListener("focus", atualizarAoRetornar);
    window.addEventListener("pageshow", atualizarAoRetornar);
    return () => {
      ativo = false;
      window.removeEventListener("focus", atualizarAoRetornar);
      window.removeEventListener("pageshow", atualizarAoRetornar);
    };
  }, []);

  function iniciarEdicao(aluno) {
    setErroAcao("");
    setEditandoId(aluno.id_aluno);
    setFormEdicao({
      nome: aluno.nome,
      idade: String(aluno.idade),
      serie: aluno.serie,
      ra: aluno.ra,
    });
  }

  async function salvarEdicao(alunoId) {
    const idade = Number(formEdicao.idade);
    if (!formEdicao.nome.trim() || !Number.isInteger(idade) || idade <= 0 || !formEdicao.serie.trim() || !formEdicao.ra.trim()) {
      setErroAcao("Preencha nome, idade válida, série e RA.");
      return;
    }

    setErroAcao("");
    setSalvandoId(alunoId);

    try {
      const resposta = await fetch("/api/alunos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_aluno: alunoId, ...formEdicao }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.details || dados.error || "Não foi possível atualizar o aluno.");

      setAlunos((atuais) => atuais.map((aluno) => (
        aluno.id_aluno === alunoId ? dados.aluno : aluno
      )));
      setEditandoId(null);
    } catch (error) {
      setErroAcao(error.message);
    } finally {
      setSalvandoId(null);
    }
  }

  async function excluirAluno(aluno) {
    if (!window.confirm(`Deseja excluir o aluno ${aluno.nome}?`)) return;

    setErroAcao("");
    setExcluindoId(aluno.id_aluno);

    try {
      const resposta = await fetch(`/api/alunos?id=${aluno.id_aluno}`, { method: "DELETE" });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.message || "Não foi possível excluir o aluno.");

      setAlunos((atuais) => atuais.filter((item) => item.id_aluno !== aluno.id_aluno));
      if (editandoId === aluno.id_aluno) setEditandoId(null);
    } catch (error) {
      setErroAcao(error.message);
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <section className={styles.heading}>
          <div>
            <span className={styles.kicker}>Gestão acadêmica / estudantes</span>
            <h1>Lista de alunos</h1>
            <p>Consulte os estudantes cadastrados e mantenha sua turma em um só lugar.</p>
          </div>
          <div className={styles.headingBadge} aria-hidden="true">◎</div>
        </section>

        <section className={styles.listPanel}>
          <div className={styles.panelTop}>
            <div>
              <span className={styles.panelLabel}>Visão geral</span>
              <h2>Alunos cadastrados</h2>
            </div>
            <div className={styles.panelActions}>
              <Link href="/conferir-alunos" className={styles.viewOnlyLink}>Conferir alunos</Link>
              <span className={styles.countBadge}>
                {alunos.length} {alunos.length === 1 ? "estudante" : "estudantes"}
              </span>
            </div>
          </div>

          <div className={styles.stats}>
            <div><strong>{alunos.length.toString().padStart(2, "0")}</strong><span>Total de alunos</span></div>
            <div><strong>{alunos[0]?.serie || "-"}</strong><span>Série do primeiro cadastro</span></div>
            <div><strong>{carregando ? "..." : "Banco"}</strong><span>Origem dos dados</span></div>
          </div>

          {erroAcao && <p className={styles.actionError} role="alert">{erroAcao}</p>}

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th>Série</th>
                  <th>RA</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {erro ? (
                  <tr><td colSpan="6" className={styles.feedback}>{erro}</td></tr>
                ) : carregando ? (
                  <tr><td colSpan="6" className={styles.feedback}>Carregando alunos...</td></tr>
                ) : alunos.length === 0 ? (
                  <tr><td colSpan="6" className={styles.feedback}>Nenhum aluno cadastrado.</td></tr>
                ) : alunos.map((aluno) => (
                  <tr key={aluno.id_aluno}>
                    <td><span className={styles.idBadge}>{aluno.id_aluno}</span></td>
                    {editandoId === aluno.id_aluno ? (
                      <>
                        <td><input className={styles.editInput} aria-label="Nome do aluno" required value={formEdicao.nome} onChange={(event) => setFormEdicao({ ...formEdicao, nome: event.target.value })} /></td>
                        <td><input className={styles.editInput} aria-label="Idade do aluno" type="number" min="1" required value={formEdicao.idade} onChange={(event) => setFormEdicao({ ...formEdicao, idade: event.target.value })} /></td>
                        <td><input className={styles.editInput} aria-label="Série do aluno" required value={formEdicao.serie} onChange={(event) => setFormEdicao({ ...formEdicao, serie: event.target.value })} /></td>
                        <td><input className={styles.editInput} aria-label="RA do aluno" required value={formEdicao.ra} onChange={(event) => setFormEdicao({ ...formEdicao, ra: event.target.value })} /></td>
                        <td className={styles.actions}>
                          <button type="button" className={styles.saveButton} onClick={() => salvarEdicao(aluno.id_aluno)} disabled={salvandoId === aluno.id_aluno}>
                            {salvandoId === aluno.id_aluno ? "Salvando..." : "Salvar"}
                          </button>
                          <button type="button" className={styles.cancelButton} onClick={() => setEditandoId(null)}>Cancelar</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td><div className={styles.student}><span className={styles.avatar}>{aluno.nome?.charAt(0)?.toUpperCase()}</span><strong>{aluno.nome}</strong></div></td>
                        <td>{aluno.idade} anos</td>
                        <td><span className={styles.classBadge}>{aluno.serie}</span></td>
                        <td className={styles.ra}>{aluno.ra}</td>
                        <td className={styles.actions}>
                          <button type="button" className={styles.editButton} onClick={() => iniciarEdicao(aluno)} disabled={salvandoId !== null || excluindoId !== null}>Editar</button>
                          <button type="button" className={styles.deleteButton} onClick={() => excluirAluno(aluno)} disabled={salvandoId !== null || excluindoId !== null}>
                            {excluindoId === aluno.id_aluno ? "Excluindo..." : "Excluir"}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}