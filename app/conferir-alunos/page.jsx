"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/header";
import styles from "../listaluno/page.module.css";

export default function ConferirAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarAlunos() {
      try {
        const resposta = await fetch("/api/alunos");
        if (!resposta.ok) throw new Error("Não foi possível carregar os alunos.");

        const dados = await resposta.json();
        if (ativo) setAlunos(dados.alunos);
      } catch (error) {
        if (ativo) setErro(error.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarAlunos();
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <section className={styles.heading}>
          <div>
            <span className={styles.kicker}>Gestão acadêmica / consulta</span>
            <h1>Consulta de alunos</h1>
            <p>Visualize os dados dos estudantes cadastrados.</p>
          </div>
          <div className={styles.headingBadge} aria-hidden="true">◎</div>
        </section>

        <section className={styles.listPanel}>
          <div className={styles.panelTop}>
            <div>
              <span className={styles.panelLabel}>Somente leitura</span>
              <h2>Alunos cadastrados</h2>
            </div>
            <div className={styles.panelActions}>
              <Link href="/listaluno" className={styles.viewOnlyLink}>Gerenciar alunos</Link>
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

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th>Série</th>
                  <th>RA</th>
                </tr>
              </thead>
              <tbody>
                {erro ? (
                  <tr><td colSpan="5" className={styles.feedback}>{erro}</td></tr>
                ) : carregando ? (
                  <tr><td colSpan="5" className={styles.feedback}>Carregando alunos...</td></tr>
                ) : alunos.length === 0 ? (
                  <tr><td colSpan="5" className={styles.feedback}>Nenhum aluno cadastrado.</td></tr>
                ) : alunos.map((aluno) => (
                  <tr key={aluno.id_aluno}>
                    <td><span className={styles.idBadge}>{aluno.id_aluno}</span></td>
                    <td><div className={styles.student}><span className={styles.avatar}>{aluno.nome?.charAt(0)?.toUpperCase()}</span><strong>{aluno.nome}</strong></div></td>
                    <td>{aluno.idade} anos</td>
                    <td><span className={styles.classBadge}>{aluno.serie}</span></td>
                    <td className={styles.ra}>{aluno.ra}</td>
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