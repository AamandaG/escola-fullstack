"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Header from "../components/header";

// Dados Iniciais de Alunos e Desempenho
const INITIAL_STUDENTS = [
  {
    id: "ALU-101",
    name: "Beatriz Helena Silva",
    class: "3º Ano EM",
    subject: "Matemática",
    avatarBg: "art-1",
    emoji: "👩‍🎓",
    trabalho1: 9.5,
    trabalho2: 9.6,
    nota1: 10.0,
    nota2: 9.8,
    nota3: 9.7,
    attendance: "98%",
    isHighlighted: true,
  },
  {
    id: "ALU-102",
    name: "Lucas Gabriel Costa",
    class: "3º Ano EM",
    subject: "Matemática",
    avatarBg: "art-2",
    emoji: "👨‍🎓",
    trabalho1: 9.8,
    trabalho2: 9.7,
    nota1: 9.6,
    nota2: 9.7,
    nota3: 9.8,
    attendance: "96%",
    isHighlighted: true,
  },
  {
    id: "ALU-103",
    name: "Mariana Albuquerque",
    class: "2º Semestre DS",
    subject: "Desenvolvimento Web",
    avatarBg: "art-1",
    emoji: "👩‍💻",
    trabalho1: 8.5,
    trabalho2: 8.8,
    nota1: 8.0,
    nota2: 9.0,
    nota3: 8.7,
    attendance: "92%",
    isHighlighted: false,
  },
  {
    id: "ALU-104",
    name: "Rafael Meneses",
    class: "2º Semestre DS",
    subject: "Desenvolvimento Web",
    avatarBg: "art-2",
    emoji: "👨‍💻",
    trabalho1: 5.0,
    trabalho2: 5.2,
    nota1: 5.5,
    nota2: 6.0,
    nota3: 5.8,
    attendance: "81%",
    isHighlighted: false,
  },
  {
    id: "ALU-105",
    name: "Camila Guimarães",
    class: "1º Ano EM",
    subject: "Física Geral",
    avatarBg: "art-1",
    emoji: "👩‍🔬",
    trabalho1: 7.5,
    trabalho2: 7.9,
    nota1: 8.2,
    nota2: 7.8,
    nota3: 8.0,
    attendance: "94%",
    isHighlighted: false,
  },
  {
    id: "ALU-106",
    name: "Gustavo Nogueira",
    class: "3º Ano EM",
    subject: "Matemática",
    avatarBg: "art-2",
    emoji: "🧑‍🏫",
    trabalho1: 4.5,
    trabalho2: 4.8,
    nota1: 5.0,
    nota2: 5.5,
    nota3: 5.2,
    attendance: "78%",
    isHighlighted: false,
  },
  {
    id: "ALU-107",
    name: "Larissa Fernandes",
    class: "1º Ano EM",
    subject: "Física Geral",
    avatarBg: "art-1",
    emoji: "🎨",
    trabalho1: 9.0,
    trabalho2: 9.3,
    nota1: 9.2,
    nota2: 9.5,
    nota3: 9.4,
    attendance: "99%",
    isHighlighted: false,
  },
];

export default function Principal() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [activeTab, setActiveTab] = useState("home");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("Todas");
  const [activeFilterPill, setActiveFilterPill] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregarAlunos() {
      try {
        const resposta = await fetch("/api/alunos", { cache: "no-store" });
        if (!resposta.ok) throw new Error("Não foi possível carregar os alunos.");

        const dados = await resposta.json();
        if (!ativo) return;

        setStudents((atuais) => {
          const nomesExistentes = new Set(atuais.map((aluno) => aluno.name.toLocaleLowerCase("pt-BR")));
          const novosAlunos = dados.alunos
            .filter((aluno) => !nomesExistentes.has(aluno.nome.toLocaleLowerCase("pt-BR")))
            .map((aluno) => ({
              id: `DB-${aluno.id_aluno}`,
              name: aluno.nome,
              class: aluno.serie,
              subject: "—",
              avatarBg: "art-1",
              emoji: "🎓",
              trabalho1: 0,
              trabalho2: 0,
              nota1: 0,
              nota2: 0,
              nota3: 0,
              attendance: "—",
              isHighlighted: false,
              hasGrades: false,
            }));

          return [...atuais, ...novosAlunos];
        });
      } catch (error) {
        console.error(error);
      }
    }

    const atualizarAoRetornar = () => carregarAlunos();
    carregarAlunos();
    window.addEventListener("focus", atualizarAoRetornar);
    window.addEventListener("pageshow", atualizarAoRetornar);

    return () => {
      ativo = false;
      window.removeEventListener("focus", atualizarAoRetornar);
      window.removeEventListener("pageshow", atualizarAoRetornar);
    };
  }, []);

  // Modal de Lançamento / Edição de Notas
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    class: "3º Ano EM",
    trabalho1: "",
    trabalho2: "",
    nota1: "",
    nota2: "",
    nota3: "",
    attendance: "95%",
  });

  // Slides do Carrossel Hero
  const slides = [
    {
      tag: "Painel Docente • 2º Semestre",
      title: "Gestão Acadêmica & Rendimento 2026",
      desc: "Acompanhe notas bimestrais, evolução de desempenho e médias individuais de cada turma em tempo real com relatórios detalhados.",
      statTitle: "Média Global Atual",
      statValue: "8.6",
      statDetail: "↑ 0.4% acima da meta estabelecida",
    },
    {
      tag: "Conselho de Classe • Próxima Semana",
      title: "Fechamento do 2º Bimestre",
      desc: "Verifique os alunos com rendimento em alerta para agendamento de plantões de dúvidas e recuperação paralela.",
      statTitle: "Taxa de Frequência",
      statValue: "94.8%",
      statDetail: "420 estudantes ativos",
    },
    {
      tag: "Lançamento Integrado",
      title: "Diário de Classe Digitalizado",
      desc: "Cadastre avaliações, provas práticas e trabalhos com cálculo instantâneo de médias ponderadas.",
      statTitle: "Avaliações Corrigidas",
      statValue: "1.450",
      statDetail: "100% integradas ao sistema",
    },
  ];

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Cálculo da média de cada aluno
  const calculateAverage = (trabalho1, trabalho2, nota1, nota2, nota3, hasGrades = true) => {
    if (!hasGrades) return "—";
    const avg = (Number(trabalho1) + Number(trabalho2) + Number(nota1) + Number(nota2) + Number(nota3)) / 5;
    return avg.toFixed(1);
  };

  // Status do aluno com base na média
  const getStudentStatus = (avg) => {
    const num = parseFloat(avg);
    if (!Number.isFinite(num)) return { label: "Sem notas", type: "" };
    if (num >= 7.0) return { label: "Aprovado", type: "approved" };
    if (num >= 5.5) return { label: "Em Alerta", type: "warning" };
    return { label: "Recuperação", type: "danger" };
  };

  // Abertura do Modal
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      name: "",
      class: "3º Ano EM",
      trabalho1: "",
      trabalho2: "",
      nota1: "",
      nota2: "",
      nota3: "",
      attendance: "95%",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      class: student.class,
      trabalho1: student.trabalho1,
      trabalho2: student.trabalho2,
      nota1: student.nota1,
      nota2: student.nota2,
      nota3: student.nota3,
      attendance: student.attendance,
    });
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingStudent) {
      // Atualizar aluno existente
      setStudents((prev) =>
        prev.map((item) =>
          item.id === editingStudent.id
            ? {
                ...item,
                name: formData.name,
                class: formData.class,
                hasGrades: true,
                trabalho1: parseFloat(formData.trabalho1) || 0,
                trabalho2: parseFloat(formData.trabalho2) || 0,
                nota1: parseFloat(formData.nota1) || 0,
                nota2: parseFloat(formData.nota2) || 0,
                nota3: parseFloat(formData.nota3) || 0,
                attendance: formData.attendance,
              }
            : item
        )
      );
    } else {
      // Inserir novo aluno
      const newStudent = {
        id: `ALU-${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name,
        class: formData.class,
        subject: "Matemática",
        avatarBg: Math.random() > 0.5 ? "art-1" : "art-2",
        emoji: "🎓",
        trabalho1: parseFloat(formData.trabalho1) || 0,
        trabalho2: parseFloat(formData.trabalho2) || 0,
        nota1: parseFloat(formData.nota1) || 0,
        nota2: parseFloat(formData.nota2) || 0,
        nota3: parseFloat(formData.nota3) || 0,
        attendance: formData.attendance || "95%",
        isHighlighted: false,
        hasGrades: true,
      };
      setStudents((prev) => [newStudent, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Filtragem e busca da tabela
  const filteredStudents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase("pt-BR");
    return students.filter((item) => {
      const avg = parseFloat(calculateAverage(item.trabalho1, item.trabalho2, item.nota1, item.nota2, item.nota3, item.hasGrades !== false));
      const matchSearch = normalizedQuery.length < 3 ||
        item.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
        item.id.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
        item.subject.toLocaleLowerCase("pt-BR").includes(normalizedQuery);

      const matchClass =
        selectedClass === "Todas" || item.class === selectedClass;

      // Filtro da Pílula rápida
      let matchPill = true;
      if (activeFilterPill === "3ano") matchPill = item.class === "3º Ano EM";
      if (activeFilterPill === "ds") matchPill = item.class === "2º Semestre DS";
      if (activeFilterPill === "recuperacao") matchPill = avg < 6.0;
      if (activeFilterPill === "destaques") matchPill = avg >= 9.0;

      return matchSearch && matchClass && matchPill;
    });
  }, [students, searchQuery, selectedClass, activeFilterPill]);
  const studentsWithGrades = filteredStudents.filter((student) => student.hasGrades !== false);

  // Alunos em Destaque (Coluna 1)
  const highlightedStudents = students.filter(
    (s) => parseFloat(calculateAverage(s.trabalho1, s.trabalho2, s.nota1, s.nota2, s.nota3, s.hasGrades !== false)) >= 9.0
  ).slice(0, 2);

  const currentSlide = slides[carouselIndex];

  return (
    <div>
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          const tableElem = document.getElementById("tabela-notas");
          if (tableElem && (tab === "notas" || tab === "turmas" || tab === "rendimento")) {
            tableElem.scrollIntoView({ behavior: "smooth" });
          }
        }}
        onQuickAdd={handleOpenAddModal}
      />

      <main className="main-wrapper">
        {/* =================================================================
            HERO BANNER COM CARROSSEL (ESTILO CARD ARREDONDADO DA IMAGEM)
            ================================================================= */}
        <section className="hero-banner-container" aria-label="Destaque Principal">
          <button
            className="carousel-btn prev"
            onClick={handlePrevSlide}
            aria-label="Slide anterior"
          >
            ‹
          </button>

          <div className="hero-banner">
            <div className="hero-content">
              <span className="hero-tag">✨ {currentSlide.tag}</span>
              <h1 className="hero-title">{currentSlide.title}</h1>
              <p className="hero-description">{currentSlide.desc}</p>
              
              <div className="hero-actions">
                <Link href="/cadaluno" className="hero-primary-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  Cadastrar Novo Aluno
                </Link>
                <button className="hero-secondary-btn" onClick={handleOpenAddModal}>
                  + Lançar Nota Rápida
                </button>
                <button
                  className="hero-secondary-btn"
                  onClick={() => {
                    const el = document.getElementById("tabela-notas");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Consultar Rendimento
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-card-badge">
                <span className="badge-header">{currentSlide.statTitle}</span>
                <span className="badge-value">{currentSlide.statValue}</span>
                <span className="badge-detail">{currentSlide.statDetail}</span>
              </div>
            </div>

            {/* Indicadores de Paginação no canto inferior esquerdo */}
            <div className="carousel-indicators">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`carousel-dot ${i === carouselIndex ? "active" : ""}`}
                  onClick={() => setCarouselIndex(i)}
                />
              ))}
            </div>
          </div>

          <button
            className="carousel-btn next"
            onClick={handleNextSlide}
            aria-label="Próximo slide"
          >
            ›
          </button>
        </section>

        {/* =================================================================
            BENTO GRID (4 COLUNAS FIEL À IMAGEM DE REFERÊNCIA)
            ================================================================= */}
        <section className="bento-section">
          <div className="bento-grid">
            
            {/* COLUNA 1: ALUNOS DESTAQUE (ARTWORKS NA IMAGEM) */}
            <div className="bento-column">
              <div className="bento-header">
                <h3 className="bento-title">Alunos Destaque &gt;</h3>
              </div>
              <div className="student-highlight-grid">
                {highlightedStudents.map((st) => {
                  const avg = calculateAverage(st.trabalho1, st.trabalho2, st.nota1, st.nota2, st.nota3);
                  return (
                    <div key={st.id} className="student-card-art" title={`Média: ${avg}`}>
                      <div className={`student-avatar-box ${st.avatarBg}`}>
                        <span className="student-emoji">{st.emoji}</span>
                        <span className="student-score-tag">★ {avg}</span>
                      </div>
                      <span className="student-name">{st.name.split(" ")[0]} {st.name.split(" ")[1] || ""}</span>
                      <span className="student-handle">@{st.class}</span>
                    </div>
                  );
                })}
              </div>
              <button 
                className="view-more-pill-btn"
                onClick={() => {
                  setActiveFilterPill("destaques");
                  const el = document.getElementById("tabela-notas");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Ver Melhores Médias
              </button>
            </div>

            {/* COLUNA 2: BUSCAS RÁPIDAS & TURMAS (RECENT SEARCHES NA IMAGEM) */}
            <div className="bento-column">
              <div className="bento-header">
                <h3 className="bento-title">Buscas Rápidas</h3>
              </div>
              <div className="pills-list">
                <button
                  className={`search-pill-btn pill-crimson ${activeFilterPill === "3ano" ? "active" : ""}`}
                  onClick={() => setActiveFilterPill(activeFilterPill === "3ano" ? null : "3ano")}
                >
                  <span className="pill-icon-circle">🔍</span>
                  <span>3º Ano EM • Matemática</span>
                </button>

                <button
                  className={`search-pill-btn pill-amber ${activeFilterPill === "ds" ? "active" : ""}`}
                  onClick={() => setActiveFilterPill(activeFilterPill === "ds" ? null : "ds")}
                >
                  <span className="pill-icon-circle">🔍</span>
                  <span>2º Semestre DS • Web</span>
                </button>

                <button
                  className={`search-pill-btn pill-teal ${activeFilterPill === "recuperacao" ? "active" : ""}`}
                  onClick={() => setActiveFilterPill(activeFilterPill === "recuperacao" ? null : "recuperacao")}
                >
                  <span className="pill-icon-circle">⚠️</span>
                  <span>Alunos em Recuperação</span>
                </button>

                <button
                  className={`search-pill-btn pill-brown ${activeFilterPill === "destaques" ? "active" : ""}`}
                  onClick={() => setActiveFilterPill(activeFilterPill === "destaques" ? null : "destaques")}
                >
                  <span className="pill-icon-circle">⭐</span>
                  <span>Notas Acima de 9.0</span>
                </button>

                <button
                  className={`search-pill-btn pill-wine ${activeFilterPill === null ? "active" : ""}`}
                  onClick={() => {
                    setActiveFilterPill(null);
                    setSelectedClass("Todas");
                    setSearchQuery("");
                  }}
                >
                  <span className="pill-icon-circle">🔄</span>
                  <span>Limpar Filtros Rápidos</span>
                </button>
              </div>
            </div>

            {/* COLUNA 3: MINI CARDS DE AÇÃO RÁPIDA (CARDS COM '+' NA IMAGEM) */}
            <div className="bento-column">
              <div className="bento-header">
                <h3 className="bento-title">Ações Rápidas</h3>
              </div>
              <div className="quick-action-cards">
                <Link
                  href="/cadaluno"
                  className="quick-action-card"
                  title="Cadastrar novo estudante com credencial digital"
                  style={{ textDecoration: "none" }}
                >
                  <div className="card-plus-badge">+</div>
                  <div className="card-avatar-center">🎓</div>
                  <div className="card-footer-info">
                    <div className="card-title">Matrícula & Novo Aluno</div>
                    <div className="card-subtitle">Cadastro completo com RA</div>
                  </div>
                </Link>

                <div 
                  className="quick-action-card" 
                  onClick={handleOpenAddModal}
                  title="Cadastrar nova nota ou aluno rápido"
                >
                  <div className="card-plus-badge">+</div>
                  <div className="card-avatar-center">📝</div>
                  <div className="card-footer-info">
                    <div className="card-title">Lançamento de Notas</div>
                    <div className="card-subtitle">Registrar prova ou trabalho</div>
                  </div>
                </div>

                <div 
                  className="quick-action-card" 
                  onClick={() => {
                    setActiveFilterPill("recuperacao");
                    const el = document.getElementById("tabela-notas");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  title="Identificar alunos com atenção prioritária"
                >
                  <div className="card-plus-badge">+</div>
                  <div className="card-avatar-center">📊</div>
                  <div className="card-footer-info">
                    <div className="card-title">Alerta de Rendimento</div>
                    <div className="card-subtitle">Recuperação e reforço</div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUNA 4: INDICADORES ACADÊMICOS (ELEMENT CARDS NA IMAGEM) */}
            <div className="bento-column">
              <div className="bento-header">
                <h3 className="bento-title">Métricas da Instituição</h3>
              </div>
              <div className="metrics-list">
                <div className="metric-info-card">
                  <div className="metric-icon-box">
                    🏆
                  </div>
                  <div className="metric-text">
                    <span className="metric-name">Média Geral: 8.4</span>
                    <span className="metric-description">Índice global de aproveitamento acadêmico em todas as turmas.</span>
                  </div>
                </div>

                <div className="metric-info-card">
                  <div className="metric-icon-box gold">
                    🎯
                  </div>
                  <div className="metric-text">
                    <span className="metric-name">Aprovação: 93.8%</span>
                    <span className="metric-description">Rendimento satisfatório com metas curriculares atingidas.</span>
                  </div>
                </div>

                <div className="metric-info-card">
                  <div className="metric-icon-box purple">
                    📚
                  </div>
                  <div className="metric-text">
                    <span className="metric-name">420 Estudantes</span>
                    <span className="metric-description">Monitoramento contínuo de frequência, tarefas e projetos.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =================================================================
            PAINEL DE NOTAS E TABELA INTERATIVA DE RENDIMENTO
            ================================================================= */}
        <section id="tabela-notas" className="table-section">
          <div className="table-header-row">
            <div className="table-header-title">
              <span className="section-kicker">Acompanhamento em tempo real</span>
              <h2>📋 Lista de Alunos</h2>
              <p>Consulte as notas bimestrais, projetos práticos e o status de aprovação de cada estudante.</p>
            </div>

            <div className="table-controls">
              <div className="search-input-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar aluno ou matéria (mín. 3 caracteres)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="filter-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="Todas">Todas as Turmas</option>
                <option value="3º Ano EM">3º Ano EM</option>
                <option value="2º Semestre DS">2º Semestre DS</option>
                <option value="1º Ano EM">1º Ano EM</option>
              </select>

              <button className="btn-add-grade" onClick={handleOpenAddModal}>
                + Adicionar / Lançar Nota
              </button>
            </div>
          </div>

          <div className="student-list-summary" aria-label="Resumo da lista de alunos">
            <div className="summary-item summary-total">
              <span className="summary-icon">◎</span>
              <span><strong>{filteredStudents.length}</strong><small>Exibidos agora</small></span>
            </div>
            <div className="summary-item">
              <span className="summary-icon">✓</span>
              <span><strong>{filteredStudents.filter((student) => getStudentStatus(calculateAverage(student.trabalho1, student.trabalho2, student.nota1, student.nota2, student.nota3, student.hasGrades !== false)).type === "approved").length}</strong><small>Aprovados</small></span>
            </div>
            <div className="summary-item">
              <span className="summary-icon warning">!</span>
              <span><strong>{filteredStudents.filter((student) => getStudentStatus(calculateAverage(student.trabalho1, student.trabalho2, student.nota1, student.nota2, student.nota3, student.hasGrades !== false)).type === "warning").length}</strong><small>Em alerta</small></span>
            </div>
            <div className="summary-item">
              <span className="summary-icon average">★</span>
              <span><strong>{studentsWithGrades.length ? (studentsWithGrades.reduce((total, student) => total + Number(calculateAverage(student.trabalho1, student.trabalho2, student.nota1, student.nota2, student.nota3)), 0) / studentsWithGrades.length).toFixed(1) : "0.0"}</strong><small>Média da lista</small></span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Estudante</th>
                  <th>Turma / Disciplina</th>
                  <th>Trabalho 1</th>
                  <th>Trabalho 2</th>
                  <th>Nota 1</th>
                  <th>Nota 2</th>
                  <th>Nota 3</th>
                  <th>Média Final</th>
                  <th>Rendimento</th>
                  <th>Situação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((st) => {
                    const avg = calculateAverage(st.trabalho1, st.trabalho2, st.nota1, st.nota2, st.nota3, st.hasGrades !== false);
                    const status = getStudentStatus(avg);
                    const percent = st.hasGrades === false ? null : Math.min(Math.round((parseFloat(avg) / 10) * 100), 100);

                    return (
                      <tr key={st.id}>
                        <td>
                          <div className="student-table-cell">
                            <div className="student-table-avatar">
                              {st.emoji || "🎓"}
                            </div>
                            <div className="student-table-info">
                              <span className="student-table-name">{st.name}</span>
                              <span className="student-table-id">{st.id} • Frequência: {st.attendance}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <strong>{st.class}</strong>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{st.subject}</div>
                        </td>

                        <td>
                          <span className="grade-val">{st.hasGrades === false ? "—" : Number(st.trabalho1).toFixed(1)}</span>
                        </td>

                        <td>
                          <span className="grade-val">{st.hasGrades === false ? "—" : Number(st.trabalho2).toFixed(1)}</span>
                        </td>

                        <td>
                          <span className="grade-val">{st.hasGrades === false ? "—" : Number(st.nota1).toFixed(1)}</span>
                        </td>

                        <td>
                          <span className="grade-val">{st.hasGrades === false ? "—" : Number(st.nota2).toFixed(1)}</span>
                        </td>

                        <td>
                          <span className="grade-val">{st.hasGrades === false ? "—" : Number(st.nota3).toFixed(1)}</span>
                        </td>

                        <td>
                          <span
                            className={`grade-average ${
                              !Number.isFinite(parseFloat(avg))
                                ? ""
                                : parseFloat(avg) >= 7.0
                                ? "high"
                                : parseFloat(avg) >= 5.5
                                ? "medium"
                                : "low"
                            }`}
                          >
                            {avg}
                          </span>
                        </td>

                        <td>
                          {percent === null ? "—" : <div className="performance-bar-wrapper">
                            <div className="performance-bar-bg">
                              <div
                                className={`performance-bar-fill ${parseFloat(avg) >= 7.0 ? "high" : ""}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="performance-percent">{percent}%</span>
                          </div>}
                        </td>

                        <td>
                          <span className={`status-badge ${status.type}`}>
                            {status.label}
                          </span>
                        </td>

                        <td>
                          <button
                            className="table-action-btn"
                            onClick={() => handleOpenEditModal(st)}
                            title="Editar notas do aluno"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                      Nenhum aluno encontrado para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer Institucional */}
        <footer className="site-footer">
          <p>EducaRede © 2026 • Sistema de Gestão Acadêmica & Rendimento Escolar • Desenvolvido para <span>Professores & Coordenação</span></p>
        </footer>
      </main>

      {/* =================================================================
          MODAL DE LANÇAMENTO / EDIÇÃO DE NOTAS
          ================================================================= */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingStudent ? "✏️ Editar Notas do Aluno" : "➕ Lançar Nova Avaliação / Aluno"}</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudent}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nome Completo do Aluno</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Beatriz Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Turma</label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  >
                    <option value="3º Ano EM">3º Ano EM</option>
                    <option value="2º Semestre DS">2º Semestre DS</option>
                    <option value="1º Ano EM">1º Ano EM</option>
                  </select>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Trabalho 1 (0-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      required
                      placeholder="0.0"
                      value={formData.trabalho1}
                      onChange={(e) => setFormData({ ...formData, trabalho1: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Trabalho 2 (0-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      required
                      placeholder="0.0"
                      value={formData.trabalho2}
                      onChange={(e) => setFormData({ ...formData, trabalho2: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label>Nota 1 (0-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      required
                      placeholder="0.0"
                      value={formData.nota1}
                      onChange={(e) => setFormData({ ...formData, nota1: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Nota 2 (0-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      required
                      placeholder="0.0"
                      value={formData.nota2}
                      onChange={(e) => setFormData({ ...formData, nota2: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Nota 3 (0-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      required
                      placeholder="0.0"
                      value={formData.nota3}
                      onChange={(e) => setFormData({ ...formData, nota3: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Frequência Escolar (%)</label>
                  <input
                    type="text"
                    placeholder="Ex: 95%"
                    value={formData.attendance}
                    onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {editingStudent ? "Salvar Alterações" : "Cadastrar Notas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}