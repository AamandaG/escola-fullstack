"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "../../components/header";
import styles from "./page.module.css";

const legacyStudents = [
  ["ALU-101", "Beatriz Helena Silva", "3º Ano EM", "Matemática", "9.5", "9.6", "10.0", "9.8", "9.7", "98%"],
  ["ALU-102", "Lucas Gabriel Costa", "3º Ano EM", "Matemática", "9.8", "9.7", "9.6", "9.7", "9.8", "96%"],
  ["ALU-103", "Mariana Albuquerque", "2º Semestre DS", "Desenvolvimento Web", "8.5", "8.8", "8.0", "9.0", "8.7", "92%"],
  ["ALU-104", "Rafael Meneses", "2º Semestre DS", "Desenvolvimento Web", "5.0", "5.2", "5.5", "6.0", "5.8", "81%"],
  ["ALU-105", "Camila Guimarães", "1º Ano EM", "Física Geral", "7.5", "7.9", "8.2", "7.8", "8.0", "94%"],
  ["ALU-106", "Gustavo Nogueira", "3º Ano EM", "Matemática", "4.5", "4.8", "5.0", "5.5", "5.2", "78%"],
  ["ALU-107", "Larissa Fernandes", "1º Ano EM", "Física Geral", "9.0", "9.3", "9.2", "9.5", "9.4", "99%"],
];

function getAverage(student) {
  const grades = student.slice(4, 9).map(Number);
  if (!grades.every(Number.isFinite)) return null;
  return (grades.reduce((total, grade) => total + grade, 0) / grades.length).toFixed(1);
}

function getStatus(average) {
  if (average === null) return ["Sem notas", ""];
  if (Number(average) >= 7) return ["Aprovado", "approved"];
  if (Number(average) >= 5.5) return ["Em alerta", "warning"];
  return ["Recuperação", "danger"];
}

export default function Notas() {
  const [students, setStudents] = useState(legacyStudents);
  const [carregando, setCarregando] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("Todas");

  useEffect(() => {
    let ativo = true;

    async function carregarAlunos() {
      try {
        const resposta = await fetch("/api/alunos", { cache: "no-store" });
        if (!resposta.ok) throw new Error("Não foi possível carregar os alunos.");

        const dados = await resposta.json();
        const nomesLegados = new Set(legacyStudents.map((student) => student[1].toLocaleLowerCase("pt-BR")));
        const alunosDoBanco = dados.alunos
          .filter((aluno) => !nomesLegados.has(aluno.nome.toLocaleLowerCase("pt-BR")))
          .map((aluno) => [
            `ALU-${aluno.id_aluno}`,
            aluno.nome,
            aluno.serie,
            "—",
            "—",
            "—",
            "—",
            "—",
            "—",
            "—",
          ]);

        if (ativo) setStudents([...legacyStudents, ...alunosDoBanco]);
      } catch (error) {
        console.error(error);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarAlunos();
    window.addEventListener("focus", carregarAlunos);
    window.addEventListener("pageshow", carregarAlunos);
    return () => {
      ativo = false;
      window.removeEventListener("focus", carregarAlunos);
      window.removeEventListener("pageshow", carregarAlunos);
    };
  }, []);

  const filteredStudents = useMemo(() => students.filter((student) => {
    const matchesQuery = `${student[1]} ${student[0]}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (selectedClass === "Todas" || student[2] === selectedClass);
  }), [students, query, selectedClass]);
  const studentsWithGrades = filteredStudents.filter((student) => getAverage(student) !== null);
  const approved = studentsWithGrades.filter((student) => getStatus(getAverage(student))[1] === "approved").length;
  const globalAverage = studentsWithGrades.length
    ? (studentsWithGrades.reduce((total, student) => total + Number(getAverage(student)), 0) / studentsWithGrades.length).toFixed(1)
    : "0.0";

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <section className={styles.heading}>
          <div>
            <span className={styles.kicker}>Diário acadêmico / notas</span>
            <h1>Notas & médias</h1>
            <p>Veja o desempenho de cada aluno, compare avaliações e identifique rapidamente quem precisa de acompanhamento.</p>
          </div>
          <Link href="/cadaluno" className={styles.addButton}>+ Novo aluno</Link>
        </section>

        <section className={styles.metrics} aria-label="Resumo das notas">
          <div><span className={styles.metricIcon}>◎</span><strong>{filteredStudents.length}</strong><small>Alunos na lista</small></div>
          <div><span className={`${styles.metricIcon} ${styles.green}`}>✓</span><strong>{approved}</strong><small>Aprovados</small></div>
          <div><span className={`${styles.metricIcon} ${styles.gold}`}>★</span><strong>{globalAverage}</strong><small>Média geral</small></div>
          <div><span className={`${styles.metricIcon} ${styles.teal}`}>↗</span><strong>94%</strong><small>Frequência média</small></div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div><span className={styles.panelLabel}>Acompanhamento individual</span><h2>Desempenho dos estudantes</h2></div>
            <div className={styles.controls}>
              <label className={styles.search}><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar aluno..." /></label>
              <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} aria-label="Filtrar por turma">
                <option>Todas</option><option>3º Ano EM</option><option>2º Semestre DS</option><option>1º Ano EM</option>
              </select>
            </div>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>Aluno</th><th>Turma</th><th>Trabalho 1</th><th>Trabalho 2</th><th>Nota 1</th><th>Nota 2</th><th>Nota 3</th><th>Média</th><th>Frequência</th><th>Situação</th></tr></thead>
              <tbody>{filteredStudents.map((student) => {
                const average = getAverage(student);
                const [status, statusType] = getStatus(average);
                return <tr key={student[0]}>
                  <td><div className={styles.student}><span className={styles.avatar}>{student[1][0]}</span><span><strong>{student[1]}</strong><small>{student[0]}</small></span></div></td>
                  <td><strong>{student[2]}</strong></td>
                  <td>{student[4]}</td><td>{student[5]}</td><td>{student[6]}</td><td>{student[7]}</td><td>{student[8]}</td>
                  <td><strong className={styles.average}>{average || "—"}</strong></td>
                  <td><span className={styles.attendance}>{student[9]}</span></td>
                  <td><span className={`${styles.status} ${statusType ? styles[statusType] : ""}`}>{status}</span></td>
                </tr>;
              })}</tbody>
            </table>
            {!filteredStudents.length && <p className={styles.empty}>Nenhum aluno encontrado para os filtros selecionados.</p>}
          </div>
          {carregando && <p role="status">Atualizando alunos...</p>}
        </section>
      </main>
    </div>
  );
}