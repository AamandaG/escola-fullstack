"use client";

import Header from "../components/header";
import styles from "./page.module.css";

export default function ListAluno() {
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
            <span className={styles.countBadge}>01 estudante</span>
          </div>

          <div className={styles.stats}>
            <div><strong>01</strong><span>Total de alunos</span></div>
            <div><strong>5º Ano</strong><span>Turma registrada</span></div>
            <div><strong>Ativo</strong><span>Status do cadastro</span></div>
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
                <tr>
                  <td><span className={styles.idBadge}>01</span></td>
                  <td><div className={styles.student}><span className={styles.avatar}>J</span><strong>João</strong></div></td>
                  <td>10 anos</td>
                  <td><span className={styles.classBadge}>5º Ano</span></td>
                  <td className={styles.ra}>123456</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}