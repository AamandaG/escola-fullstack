"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

export default function Login() {
  const router = useRouter();

  function entrar(event) {
    event.preventDefault();
    router.push("/principal");
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="login-title">
        <Link className={styles.brand} href="/login">EducaRede</Link>
        <p className={styles.eyebrow}>Portal do Professor</p>
        <h1 id="login-title">Entrar no sistema</h1>
        <p className={styles.description}>Acesse sua conta para continuar.</p>

        <form className={styles.form} onSubmit={entrar}>
          <label htmlFor="usuario">Usuário</label>
          <input
            id="usuario"
            name="usuario"
            type="text"
            autoComplete="username"
            placeholder="Digite seu usuário"
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            required
          />

          <button className={styles.primaryButton} type="submit">
            Entrar no sistema
          </button>
        </form>

        <div className={styles.footer}>
          <p>Ainda não tem cadastro?</p>
          <Link className={styles.secondaryButton} href="/registro">
            Ir para o registro
          </Link>
        </div>
      </section>
    </main>
  );
}
