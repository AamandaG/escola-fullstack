"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "../components/header";
import styles from "./page.module.css";

// Avatares e Emojis disponíveis para personalização do estudante
const EMOJI_OPTIONS = ["👩‍🎓", "👨‍🎓", "👩‍💻", "👨‍💻", "👩‍🔬", "🎨", "🧑‍🏫", "🌟", "🚀", "💡"];

const THEME_OPTIONS = [
  { id: "art1", name: "Pôr do Sol", className: styles.themeArt1 },
  { id: "art2", name: "Rubi Real", className: styles.themeArt2 },
  { id: "art3", name: "Esmeralda", className: styles.themeArt3 },
  { id: "art4", name: "Violeta", className: styles.themeArt4 },
];

const SAMPLE_RECENT_STUDENTS = [
  { id: "ALU-108", name: "Mariana Albuquerque", class: "2º Semestre DS", emoji: "👩‍💻", ra: "2026-8812" },
  { id: "ALU-109", name: "Lucas Gabriel Costa", class: "3º Ano EM", emoji: "👨‍🎓", ra: "2026-4491" },
  { id: "ALU-110", name: "Larissa Fernandes", class: "1º Ano EM", emoji: "🎨", ra: "2026-9210" },
];

export default function Cadaluno() {
  // Estado dos campos do formulário
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [ra, setRa] = useState("");
  const [email, setEmail] = useState("");
  const [serie, setSerie] = useState("3º Ano EM");
  const [disciplina, setDisciplina] = useState("Matemática & Exatas");
  const [turno, setTurno] = useState("Manhã");
  const [responsavel, setResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Customização visual da carteirinha
  const [selectedEmoji, setSelectedEmoji] = useState("👩‍🎓");
  const [selectedTheme, setSelectedTheme] = useState("art2");

  // Lista de estudantes cadastrados recentemente
  const [recentStudents, setRecentStudents] = useState(SAMPLE_RECENT_STUDENTS);

  // Modal / Toast de Sucesso
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastRegisteredStudent, setLastRegisteredStudent] = useState(null);

  // Gerador automático de Registro Acadêmico (RA)
  const handleGenerateRa = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newRa = `2026-${randomCode}`;
    setRa(newRa);
  };

  // Sugestão de E-mail Institucional inteligente com base no nome
  const handleSuggestEmail = () => {
    if (!nome.trim()) return;
    const parts = nome
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "")
      .split(" ")
      .filter(Boolean);

    let suggested = "";
    if (parts.length === 1) {
      suggested = `${parts[0]}@escola.edu.br`;
    } else {
      suggested = `${parts[0]}.${parts[parts.length - 1]}@escola.edu.br`;
    }
    setEmail(suggested);
  };

  // Preenchimento rápido para demonstração / testes
  const handleFastFill = () => {
    setNome("Beatriz Helena Silva");
    setIdade("17");
    setDataNascimento("2009-04-15");
    setRa(`2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setEmail("beatriz.silva@escola.edu.br");
    setSerie("3º Ano EM");
    setDisciplina("Matemática & Exatas");
    setTurno("Manhã");
    setResponsavel("Helena Cristina Silva");
    setTelefone("(11) 98765-4321");
    setSelectedEmoji("👩‍🎓");
    setSelectedTheme("art2");
  };

  // Reset do formulário
  const handleResetForm = () => {
    setNome("");
    setIdade("");
    setDataNascimento("");
    setRa("");
    setEmail("");
    setSerie("3º Ano EM");
    setDisciplina("Matemática & Exatas");
    setTurno("Manhã");
    setResponsavel("");
    setTelefone("");
    setObservacoes("");
    setSelectedEmoji("👩‍🎓");
    setSelectedTheme("art2");
  };

  // Envio do cadastro
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const studentRa = ra.trim() || `2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentEmail = email.trim() || `${nome.toLowerCase().replace(/\s+/g, ".")}@escola.edu.br`;

    const newStudent = {
      id: `ALU-${Math.floor(100 + Math.random() * 900)}`,
      name: nome.trim(),
      age: idade,
      class: serie,
      subject: disciplina,
      ra: studentRa,
      email: studentEmail,
      emoji: selectedEmoji,
      theme: selectedTheme,
      turno: turno,
      responsavel: responsavel,
    };

    setRecentStudents((prev) => [newStudent, ...prev.slice(0, 4)]);
    setLastRegisteredStudent(newStudent);
    setShowSuccessModal(true);
  };

  // Excluir estudante do histórico local
  const handleDeleteRecent = (id) => {
    setRecentStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Cálculo de progresso de preenchimento do formulário
  const progressStats = useMemo(() => {
    let completed = 0;
    const total = 5;
    if (nome.trim().length > 2) completed++;
    if (ra.trim().length > 0) completed++;
    if (email.trim().includes("@")) completed++;
    if (serie) completed++;
    if (idade || responsavel) completed++;

    const percent = Math.round((completed / total) * 100);
    return { completed, total, percent };
  }, [nome, ra, email, serie, idade, responsavel]);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.mainContainer}>
        {/* =================================================================
            HERO BANNER INSTITUCIONAL DE CADASTRO
            ================================================================= */}
        <section className={styles.heroBanner} aria-label="Apresentação do Cadastro">
          <div className={styles.heroContent}>
            <nav className={styles.breadcrumbs} aria-label="Navegação Estrutural">
              <Link href="/" className={styles.breadcrumbLink}>Início</Link>
              <span>/</span>
              <span>Gestão Acadêmica</span>
              <span>/</span>
              <span>Novo Estudante</span>
            </nav>

            <span className={styles.heroTag}>✨ Matrículas 2026 • Ingresso & Registro</span>
            <h1 className={styles.heroTitle}>Cadastro Unificado de Alunos</h1>
            <p className={styles.heroDesc}>
              Registre novos estudantes, emita a credencial digital instantânea e integre os dados diretamente ao diário de classe e boletim institucional.
            </p>

            <div className={styles.heroBadgesRow}>
              <div className={styles.heroPill}>
                <span>⚡</span>
                <span>Geração Automática de RA</span>
              </div>
              <div className={styles.heroPill}>
                <span>🔒</span>
                <span>E-mail Institucional Integrado</span>
              </div>
              <div className={styles.heroPill}>
                <span>📊</span>
                <span>Diário de Notas Vinculado</span>
              </div>
            </div>
          </div>

          <div className={styles.heroStatsBadge}>
            <span className={styles.statBadgeLabel}>Matrículas Ativas 2026</span>
            <span className={styles.statBadgeNumber}>421</span>
            <span className={styles.statBadgeSub}>+ 12 novos cadastros esta semana</span>
          </div>
        </section>

        {/* =================================================================
            GRID PRINCIPAL: FORMULÁRIO (ESQUERDA) + SIDEBAR PREVIEW (DIREITA)
            ================================================================= */}
        <div className={styles.workspaceGrid}>
          
          {/* PAINEL DO FORMULÁRIO */}
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <div className={styles.formHeaderTitle}>
                <div className={styles.formHeaderIcon}>✍️</div>
                <div>
                  <h2>Formulário de Matrícula</h2>
                  <p>Preencha os dados do estudante para emissão da ficha cadastral.</p>
                </div>
              </div>
              <button type="button" className={styles.fastFillBtn} onClick={handleFastFill} title="Preenche os campos com dados de exemplo">
                ⚡ Preencher Exemplo
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              
              {/* SEÇÃO 1: DADOS PESSOAIS & IDENTIFICAÇÃO */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionStep}>ETAPA 01</span>
                  <h3>Identificação & Perfil do Estudante</h3>
                </div>

                {/* Seletores de Avatar e Tema da Carteirinha */}
                <div className={styles.avatarPickerContainer}>
                  <label className={styles.pickerLabel}>Escolha o Emoji do Perfil & Cor do Badge:</label>
                  
                  <div className={styles.emojiGrid}>
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className={`${styles.emojiBtn} ${selectedEmoji === emoji ? styles.activeEmoji : ""}`}
                        onClick={() => setSelectedEmoji(emoji)}
                        title={`Selecionar avatar ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <div className={styles.bgThemeRow}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#6b4a44" }}>Tema do Cartão:</span>
                    {THEME_OPTIONS.map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        className={`${styles.themeBtn} ${th.className} ${selectedTheme === th.id ? styles.activeTheme : ""}`}
                        onClick={() => setSelectedTheme(th.id)}
                      >
                        {th.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGrid2}>
                  {/* Nome Completo */}
                  <div className={styles.fieldGroupFull}>
                    <label htmlFor="student-name" className={styles.fieldLabel}>
                      <span>Nome Completo do Estudante <span className={styles.requiredStar}>*</span></span>
                      {nome && (
                        <button type="button" className={styles.fieldLabelAction} onClick={handleSuggestEmail}>
                          Sugerir E-mail
                        </button>
                      )}
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>👤</span>
                      <input
                        type="text"
                        id="student-name"
                        className={styles.inputControl}
                        placeholder="Ex.: Beatriz Helena Silva"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Idade */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="student-age" className={styles.fieldLabel}>
                      <span>Idade <span className={styles.requiredStar}>*</span></span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>🎂</span>
                      <input
                        type="number"
                        id="student-age"
                        min="5"
                        max="99"
                        className={styles.inputControl}
                        placeholder="Ex.: 17"
                        required
                        value={idade}
                        onChange={(e) => setIdade(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Registro Acadêmico (RA) com botão Gerador */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="student-ra" className={styles.fieldLabel}>
                      <span>Registro Acadêmico (RA) <span className={styles.requiredStar}>*</span></span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>🆔</span>
                      <input
                        type="text"
                        id="student-ra"
                        className={styles.inputControl}
                        placeholder="Ex.: 2026-1049"
                        required
                        value={ra}
                        onChange={(e) => setRa(e.target.value)}
                      />
                      <button
                        type="button"
                        className={styles.inputActionBtn}
                        onClick={handleGenerateRa}
                        title="Gerar código RA aleatório"
                      >
                        ⚡ Gerar RA
                      </button>
                    </div>
                  </div>

                  {/* Data de Nascimento */}
                  <div className={styles.fieldGroupFull}>
                    <label htmlFor="student-birth" className={styles.fieldLabel}>
                      Data de Nascimento
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>📅</span>
                      <input
                        type="date"
                        id="student-birth"
                        className={styles.inputControl}
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 2: DADOS ACADÊMICOS & TURMA */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionStep}>ETAPA 02</span>
                  <h3>Vínculo Acadêmico & Turma</h3>
                </div>

                <div className={styles.formGrid2}>
                  {/* Série / Turma */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="student-class" className={styles.fieldLabel}>
                      <span>Turma / Ano Escolar <span className={styles.requiredStar}>*</span></span>
                    </label>
                    <select
                      id="student-class"
                      className={styles.selectControl}
                      value={serie}
                      onChange={(e) => setSerie(e.target.value)}
                    >
                      <option value="3º Ano EM">3º Ano EM (Ensino Médio)</option>
                      <option value="2º Semestre DS">2º Semestre DS (Desenvolvimento Web)</option>
                      <option value="1º Ano EM">1º Ano EM (Ensino Médio)</option>
                      <option value="2º Ano EM">2º Ano EM (Ensino Médio)</option>
                      <option value="9º Ano EF">9º Ano EF (Ensino Fundamental)</option>
                    </select>

                    {/* Pílulas rápidas de troca de turma */}
                    <div className={styles.turmaPillsRow}>
                      {["3º Ano EM", "2º Semestre DS", "1º Ano EM"].map((item) => (
                        <button
                          key={item}
                          type="button"
                          className={`${styles.turmaPillBtn} ${serie === item ? styles.activeTurmaPill : ""}`}
                          onClick={() => setSerie(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Disciplina / Trilha Principal */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="student-subject" className={styles.fieldLabel}>
                      Trilha / Disciplina Principal
                    </label>
                    <select
                      id="student-subject"
                      className={styles.selectControl}
                      value={disciplina}
                      onChange={(e) => setDisciplina(e.target.value)}
                    >
                      <option value="Matemática & Exatas">Matemática & Raciocínio Lógico</option>
                      <option value="Desenvolvimento Web & TI">Desenvolvimento Web Fullstack</option>
                      <option value="Física Geral">Física Geral & Laboratório</option>
                      <option value="Multimídia & Artes">Design & Multimídia</option>
                    </select>
                  </div>

                  {/* Turno */}
                  <div className={styles.fieldGroupFull}>
                    <label htmlFor="student-shift" className={styles.fieldLabel}>
                      Turno de Aulas
                    </label>
                    <div className={styles.turmaPillsRow}>
                      {["Manhã", "Tarde", "Integral"].map((item) => (
                        <button
                          key={item}
                          type="button"
                          className={`${styles.turmaPillBtn} ${turno === item ? styles.activeTurmaPill : ""}`}
                          onClick={() => setTurno(item)}
                        >
                          ☀️ {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 3: CONTATO & RESPONSÁVEIS */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionStep}>ETAPA 03</span>
                  <h3>Comunicação & Responsáveis</h3>
                </div>

                <div className={styles.formGrid2}>
                  {/* E-mail Institucional */}
                  <div className={styles.fieldGroupFull}>
                    <label htmlFor="student-email" className={styles.fieldLabel}>
                      <span>E-mail Institucional <span className={styles.requiredStar}>*</span></span>
                      <button type="button" className={styles.fieldLabelAction} onClick={handleSuggestEmail}>
                        Gerar com base no nome
                      </button>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>✉️</span>
                      <input
                        type="email"
                        id="student-email"
                        className={styles.inputControl}
                        placeholder="beatriz.silva@escola.edu.br"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Responsável Legal */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="parent-name" className={styles.fieldLabel}>
                      Nome do Responsável Legal
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>👨‍👩‍👧</span>
                      <input
                        type="text"
                        id="parent-name"
                        className={styles.inputControl}
                        placeholder="Ex.: Helena Silva"
                        value={responsavel}
                        onChange={(e) => setResponsavel(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Telefone / WhatsApp */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="parent-phone" className={styles.fieldLabel}>
                      Telefone / WhatsApp
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>📱</span>
                      <input
                        type="tel"
                        id="parent-phone"
                        className={styles.inputControl}
                        placeholder="(11) 98765-4321"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Observações Pedagógicas */}
                  <div className={styles.fieldGroupFull}>
                    <label htmlFor="student-notes" className={styles.fieldLabel}>
                      Observações Pedagógicas / Necessidades Especiais
                    </label>
                    <textarea
                      id="student-notes"
                      className={styles.textareaControl}
                      placeholder="Informações adicionais sobre saúde, transporte, reforço escolar ou observações..."
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* BOTÕES DE AÇÃO */}
              <div className={styles.formActionsRow}>
                <button type="button" className={styles.btnReset} onClick={handleResetForm}>
                  🔄 Limpar Formulário
                </button>

                <button type="submit" className={styles.btnSubmitPrimary}>
                  <span>🚀 Finalizar Cadastro do Aluno</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>

            </form>
          </div>

          {/* SIDEBAR DIREITA: LIVE CARTEIRINHA DIGITAL + CHECKLIST + HISTÓRICO */}
          <aside className={styles.sidebar}>
            
            {/* CARTEIRINHA DIGITAL INTERATIVA EM TEMPO REAL */}
            <div className={styles.idCardBox}>
              <div className={styles.idCardHeader}>
                <h3 className={styles.idCardTitle}>
                  <span>🪪 Credencial Estudantil</span>
                </h3>
                <span className={styles.liveBadge}>
                  <span className={styles.liveDot} />
                  Prévia em Tempo Real
                </span>
              </div>

              <div className={`${styles.studentIdCard} ${styles[selectedTheme]}`}>
                <div className={styles.cardTopRow}>
                  <div className={styles.schoolBrand}>
                    <span className={styles.schoolName}>EducaRede</span>
                    <span className={styles.schoolTagline}>Identidade Acadêmica 2026</span>
                  </div>
                  <div className={styles.cardChip} title="Chip de Acesso Digital" />
                </div>

                <div className={styles.cardBodyRow}>
                  <div className={styles.cardAvatar}>
                    <span>{selectedEmoji}</span>
                  </div>
                  <div className={styles.cardStudentDetails}>
                    <div className={styles.cardStudentName}>
                      {nome.trim() || "Nome do Estudante"}
                    </div>
                    <div className={styles.cardStudentRa}>
                      RA: {ra.trim() || "2026-XXXX"}
                    </div>
                    <div className={styles.cardStudentClassBadge}>
                      {serie} • {turno}
                    </div>
                  </div>
                </div>

                <div className={styles.cardBottomRow}>
                  <div className={styles.cardMetaItem}>
                    <span className={styles.cardMetaLabel}>Validade</span>
                    <span className={styles.cardMetaVal}>Dez/2026</span>
                  </div>

                  <div className={styles.cardBarcode}>
                    ||| | |||| | ||
                  </div>
                </div>
              </div>
            </div>

            {/* CHECKLIST & PROGRESSO DE PREENCHIMENTO */}
            <div className={styles.progressCard}>
              <div className={styles.progressHeader}>
                <h4 className={styles.progressTitle}>Progresso do Cadastro</h4>
                <span className={styles.progressPercent}>{progressStats.percent}%</span>
              </div>

              <div className={styles.progressBarBg}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${progressStats.percent}%` }}
                />
              </div>

              <div className={styles.checklist}>
                <div className={`${styles.checkItem} ${nome.trim().length > 2 ? styles.done : ""}`}>
                  <div className={styles.checkCircle}>✓</div>
                  <span>Nome completo informado</span>
                </div>
                <div className={`${styles.checkItem} ${ra.trim().length > 0 ? styles.done : ""}`}>
                  <div className={styles.checkCircle}>✓</div>
                  <span>Registro Acadêmico (RA) gerado</span>
                </div>
                <div className={`${styles.checkItem} ${email.trim().includes("@") ? styles.done : ""}`}>
                  <div className={styles.checkCircle}>✓</div>
                  <span>E-mail institucional configurado</span>
                </div>
                <div className={`${styles.checkItem} ${serie ? styles.done : ""}`}>
                  <div className={styles.checkCircle}>✓</div>
                  <span>Turma & série vinculadas</span>
                </div>
              </div>
            </div>

            {/* LISTA DE ÚLTIMOS CADASTRADOS */}
            <div className={styles.recentStudentsCard}>
              <div className={styles.recentHeader}>
                <h4 className={styles.recentTitle}>Recentes no Sistema</h4>
                <span className={styles.recentCount}>{recentStudents.length} alunos</span>
              </div>

              <div className={styles.recentList}>
                {recentStudents.map((st) => (
                  <div key={st.id} className={styles.recentItem}>
                    <div className={styles.recentItemLeft}>
                      <div className={styles.recentAvatar}>{st.emoji || "🎓"}</div>
                      <div className={styles.recentInfo}>
                        <span className={styles.recentName}>{st.name}</span>
                        <span className={styles.recentSub}>{st.class} • {st.ra}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.recentDeleteBtn}
                      onClick={() => handleDeleteRecent(st.id)}
                      title="Remover da lista recente"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* =================================================================
          MODAL DE SUCESSO AO CADASTRAR O ALUNO
          ================================================================= */}
      {showSuccessModal && lastRegisteredStudent && (
        <div className={styles.successOverlay} onClick={() => setShowSuccessModal(false)}>
          <div className={styles.successModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.successIconBadge}>🎉</div>
            <h3>Matrícula Realizada com Sucesso!</h3>
            <p>O estudante foi registrado no sistema institucional e já possui sua credencial ativa.</p>

            <div className={styles.successStudentPreviewBox}>
              <div style={{ fontSize: "32px" }}>{lastRegisteredStudent.emoji}</div>
              <div>
                <strong style={{ display: "block", color: "var(--primary-red-deep)", fontSize: "15px" }}>
                  {lastRegisteredStudent.name}
                </strong>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {lastRegisteredStudent.class} • RA: {lastRegisteredStudent.ra}
                </span>
              </div>
            </div>

            <div className={styles.successActions}>
              <Link href="/" className={styles.btnGoGrades}>
                📊 Acessar Diário de Notas & Turmas
              </Link>
              <button
                type="button"
                className={styles.btnNewCad}
                onClick={() => {
                  setShowSuccessModal(false);
                  handleResetForm();
                }}
              >
                ➕ Cadastrar Outro Estudante
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER INSTITUCIONAL */}
      <footer className={styles.footer}>
        <p>EducaRede © 2026 • Sistema Integrado de Matrícula & Rendimento Escolar • <span>Gestão Docente</span></p>
      </footer>
    </div>
  );
}