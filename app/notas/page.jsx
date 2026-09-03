"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "../components/header";
import styles from "./page.module.css";

const students = [
  ["ALU-101", "Beatriz Helena Silva", "3º Ano EM", "Matemática", "9.5", "10.0", "9.8", "98%"],
  ["ALU-102", "Lucas Gabriel Costa", "3º Ano EM", "Matemática", "9.8", "9.6", "9.7", "96%"],
  ["ALU-103", "Mariana Albuquerque", "2º Semestre DS", "Desenvolvimento Web", "8.5", "8.0", "9.0", "92%"],
  ["ALU-104", "Rafael Meneses", "2º Semestre DS", "Desenvolvimento Web", "5.0", "5.5", "6.0", "81%"],
  ["ALU-105", "Camila Guimarães", "1º Ano EM", "Física Geral", "7.5", "8.2", "7.8", "94%"],
  ["ALU-106", "Gustavo Nogueira", "3º Ano EM", "Matemática", "4.5", "5.0", "5.5", "78%"],
  ["ALU-107", "Larissa Fernandes", "1º Ano EM", "Física Geral", "9.0", "9.2", "9.5", "99%"],
];

function getAverage(student) {
  return ((Number(student[4]) + Number(student[5]) + Number(student[6])) / 3).toFixed(1);
}

function getStatus(average) {
  if (Number(average) >= 7) return ["Aprovado", "approved"];
  if (Number(average) >= 5.5) return ["Em alerta", "warning"];
  return ["Recuperação", "danger"];
}

export default function Notas() {
  const [query, setQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("Todas");
  const filteredStudents = useMemo(() => students.filter((student) => {
    const matchesQuery = `${student[1]} ${student[0]} ${student[3]}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (selectedClass === "Todas" || student[2] === selectedClass);
  }), [query, selectedClass]);
  const approved = filteredStudents.filter((student) => getStatus(getAverage(student))[1] === "approved").length;
  const globalAverage = filteredStudents.length
    ? (filteredStudents.reduce((total, student) => total + Number(getAverage(student)), 0) / filteredStudents.length).toFixed(1)
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
              <thead><tr><th>Aluno</th><th>Turma / disciplina</th><th>P1</th><th>P2</th><th>Projeto</th><th>Média</th><th>Frequência</th><th>Situação</th></tr></thead>
              <tbody>{filteredStudents.map((student) => {
                const average = getAverage(student);
                const [status, statusType] = getStatus(average);
                return <tr key={student[0]}>
                  <td><div className={styles.student}><span className={styles.avatar}>{student[1][0]}</span><span><strong>{student[1]}</strong><small>{student[0]}</small></span></div></td>
                  <td><strong>{student[2]}</strong><small>{student[3]}</small></td>
                  <td>{student[4]}</td><td>{student[5]}</td><td>{student[6]}</td>
                  <td><strong className={styles.average}>{average}</strong></td>
                  <td><span className={styles.attendance}>{student[7]}</span></td>
                  <td><span className={`${styles.status} ${styles[statusType]}`}>{status}</span></td>
                </tr>;
              })}</tbody>
            </table>
            {!filteredStudents.length && <p className={styles.empty}>Nenhum aluno encontrado para os filtros selecionados.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}