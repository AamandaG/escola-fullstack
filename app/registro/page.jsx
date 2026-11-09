"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

export default function Registro() {
  const router = useRouter();

  function salvarRegistro(event) {
    event.preventDefault();
    router.push("/login");
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="registro-title">
        <Link className={styles.brand} href="/login">EducaRede</Link>
        <p className={styles.eyebrow}>Portal do Professor</p>
        <h1 id="registro-title">Criar cadastro</h1>
        <p className={styles.description}>Preencha os dados para criar seu acesso.</p>

        <form className={styles.form} onSubmit={salvarRegistro}>
          <label htmlFor="usuario">Usuário</label>
          <input
            id="usuario"
            name="usuario"
            type="text"
            autoComplete="username"
            placeholder="Escolha um usuário"
            required
          />

          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            name="nome"
            type="text"
            autoComplete="name"
            placeholder="Digite seu nome"
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="new-password"
            placeholder="Crie uma senha"
            required
          />

          <button className={styles.primaryButton} type="submit">
            Salvar registro
          </button>
        </form>

        <div className={styles.footer}>
          <p>Já tem cadastro?</p>
          <Link className={styles.secondaryButton} href="/login">
            Ir para o login
          </Link>
        </div>
      </section>
    </main>
  );
}
