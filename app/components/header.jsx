"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ activeTab, onTabChange, onQuickAdd }) {
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname === "/principal";
  const isCadaluno = pathname === "/cadaluno";
  const isNotas = pathname === "/notas";
  const isListaAlunos = pathname === "/listaluno" || pathname === "/conferir-alunos";
  const isCadastros = pathname === "/cadastros";

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Esquerda: Avatar do Professor & Botão '+' rápido */}
        <div className="header-left">
          <div className="user-profile-badge" title="Professor Logado: Prof. Dr. Silva">
            <div className="avatar-wrapper">
              <span>👨‍🏫</span>
            </div>
            <Link
              href="/cadaluno"
              className="plus-btn-badge" 
              title="Cadastrar Novo Aluno"
              aria-label="Cadastrar novo aluno"
            >
              +
            </Link>
          </div>
        </div>

        {/* Centro: Navegação em Pílula (Estilo Imagem de Referência) */}
        <nav className="header-nav" aria-label="Navegação Principal">
          <Link
            href="/"
            className={`nav-link-pill ${isHome && activeTab !== "cadaluno" ? "active" : ""}`}
            onClick={() => onTabChange && onTabChange("home")}
          >
            🏠 Home
          </Link>
          <Link
            href="/cadaluno"
            className={`nav-link-pill ${isCadaluno ? "active" : ""}`}
          >
            ✍️ Cadastrar Aluno
          </Link>
          <details className="header-student-menu">
            <summary className={`nav-link-pill ${isListaAlunos ? "active" : ""}`}>Alunos</summary>
            <div className="header-student-menu-options">
              <Link href="/listaluno">Gerenciar lista</Link>
              <Link href="/conferir-alunos">Conferir lista</Link>
            </div>
          </details>
          <Link href="/cadastros" className={`nav-link-pill ${isCadastros ? "active" : ""}`}>
            Professores e disciplinas
          </Link>
          {isHome ? (
            <>
              <button
                type="button"
                className={`nav-link-pill ${activeTab === "turmas" ? "active" : ""}`}
                onClick={() => onTabChange && onTabChange("turmas")}
              >
                🏫 Turmas
              </button>
              <Link href="/notas" className={`nav-link-pill ${activeTab === "notas" || isNotas ? "active" : ""}`}>
                📊 Notas & Médias
              </Link>
              <button
                type="button"
                className={`nav-link-pill ${activeTab === "rendimento" ? "active" : ""}`}
                onClick={() => onTabChange && onTabChange("rendimento")}
              >
                📈 Rendimento
              </button>
            </>
          ) : (
            <>
              <Link href="/notas" className={`nav-link-pill ${isNotas ? "active" : ""}`}>
                📊 Notas & Médias
              </Link>
            </>
          )}
        </nav>

        {/* Direita: Tag Institucional (@docente.edu) & Botão Menu */}
        <div className="header-right">
          <span className="tag-docente">@docente.edu</span>
          <Link
            href="/"
            className="menu-btn"
            title="Acessar Menu de Gestão"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            Painel Geral
          </Link>
        </div>
      </div>
    </header>
  );
}