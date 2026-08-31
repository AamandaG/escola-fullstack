"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ activeTab, onTabChange, onQuickAdd }) {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Esquerda: Avatar do Professor & Botão '+' rápido */}
        <div className="header-left">
          <div className="user-profile-badge" title="Professor Logado: Prof. Dr. Silva">
            <div className="avatar-wrapper">
              <span>👨‍🏫</span>
            </div>
            <button 
              className="plus-btn-badge" 
              onClick={onQuickAdd} 
              title="Lançar Nota Rápida / Novo Aluno"
              aria-label="Adicionar avaliação rápida"
            >
              +
            </button>
          </div>
        </div>

        {/* Centro: Navegação em Pílula (Estilo Imagem de Referência) */}
        <nav className="header-nav" aria-label="Navegação Principal">
          <button 
            className={`nav-link-pill ${activeTab === "home" || pathname === "/" ? "active" : ""}`}
            onClick={() => onTabChange && onTabChange("home")}
          >
            Home
          </button>
          <button 
            className={`nav-link-pill ${activeTab === "turmas" ? "active" : ""}`}
            onClick={() => onTabChange && onTabChange("turmas")}
          >
            Turmas
          </button>
          <button 
            className={`nav-link-pill ${activeTab === "notas" ? "active" : ""}`}
            onClick={() => onTabChange && onTabChange("notas")}
          >
            Notas & Médias
          </button>
          <button 
            className={`nav-link-pill ${activeTab === "rendimento" ? "active" : ""}`}
            onClick={() => onTabChange && onTabChange("rendimento")}
          >
            Rendimento
          </button>
        </nav>

        {/* Direita: Tag Institucional (@docente.edu) & Botão Menu */}
        <div className="header-right">
          <span className="tag-docente">@docente.edu</span>
          <button 
            className="menu-btn"
            onClick={() => onTabChange && onTabChange("notas")}
            title="Acessar Menu de Gestão"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}