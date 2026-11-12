import db from "../../../db/banco";
import { NextResponse } from "next/server";

const DIAS_VALIDOS = [
  "Segunda-feira",
  "Terca-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sabado",
  "Domingo",
];

function validarProfessor(dados) {
  const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";
  const matriculaNif = typeof dados.matricula_nif === "string"
    ? dados.matricula_nif.trim()
    : "";
  const disciplinaId = Number(dados.disciplina_id);
  const totalAulas = Number(dados.total_aulas_semana);
  const dias = Array.isArray(dados.dias_aula) ? [...new Set(dados.dias_aula)] : [];

  if (
    !nome ||
    !matriculaNif ||
    !Number.isInteger(disciplinaId) ||
    disciplinaId <= 0 ||
    !Number.isInteger(totalAulas) ||
    totalAulas < 0 ||
    dias.length === 0 ||
    dias.some((dia) => !DIAS_VALIDOS.includes(dia))
  ) {
    return null;
  }

  return { nome, matriculaNif, disciplinaId, totalAulas, dias };
}

function respostaErro(error, mensagem) {
  console.error(error);
  if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
    return NextResponse.json(
      { error: "Já existe um professor com essa matrícula (NIF)." },
      { status: 409 }
    );
  }
  if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
    return NextResponse.json({ error: "A disciplina selecionada não existe." }, { status: 400 });
  }
  return NextResponse.json({ error: mensagem }, { status: 400 });
}

function listarProfessores() {
  const professores = db.prepare(`
    SELECT p.*, d.nome AS disciplina_nome
    FROM professores p
    JOIN disciplinas d ON d.id_disciplina = p.disciplina_id
    ORDER BY p.nome
  `).all();
  const dias = db.prepare(
    "SELECT professor_id, dia_semana FROM professor_dias ORDER BY rowid"
  ).all();
  const diasPorProfessor = new Map();
  for (const { professor_id, dia_semana } of dias) {
    const lista = diasPorProfessor.get(professor_id) || [];
    lista.push(dia_semana);
    diasPorProfessor.set(professor_id, lista);
  }
  return professores.map((professor) => ({
    ...professor,
    dias_aula: diasPorProfessor.get(professor.id_professor) || [],
  }));
}

function salvarDias(professorId, dias) {
  db.prepare("DELETE FROM professor_dias WHERE professor_id = ?").run(professorId);
  const inserirDia = db.prepare(
    "INSERT INTO professor_dias (professor_id, dia_semana) VALUES (?, ?)"
  );
  for (const dia of dias) inserirDia.run(professorId, dia);
}

export async function GET() {
  return NextResponse.json({ professores: listarProfessores() });
}

export async function POST(request) {
  try {
    const professor = validarProfessor(await request.json());
    if (!professor) {
      return NextResponse.json(
        { error: "Preencha os dados do professor, selecione a disciplina e ao menos um dia de aula." },
        { status: 400 }
      );
    }

    const criarProfessor = db.transaction((dados) => {
      const resultado = db.prepare(`
        INSERT INTO professores (nome, matricula_nif, disciplina_id, total_aulas_semana)
        VALUES (?, ?, ?, ?)
      `).run(dados.nome, dados.matriculaNif, dados.disciplinaId, dados.totalAulas);
      salvarDias(resultado.lastInsertRowid, dados.dias);
      return resultado.lastInsertRowid;
    });
    const id = criarProfessor(professor);
    const criado = listarProfessores().find((item) => item.id_professor === id);
    return NextResponse.json({ ok: true, professor: criado }, { status: 201 });
  } catch (error) {
    return respostaErro(error, "Erro ao cadastrar professor.");
  }
}

export async function PUT(request) {
  try {
    const dados = await request.json();
    const id = Number(dados.id_professor);
    const professor = validarProfessor(dados);
    if (!Number.isInteger(id) || id <= 0 || !professor) {
      return NextResponse.json(
        { error: "Informe o identificador e todos os dados válidos do professor." },
        { status: 400 }
      );
    }

    const atualizarProfessor = db.transaction((registro) => {
      const resultado = db.prepare(`
        UPDATE professores
        SET nome = ?, matricula_nif = ?, disciplina_id = ?, total_aulas_semana = ?
        WHERE id_professor = ?
      `).run(
        registro.nome,
        registro.matriculaNif,
        registro.disciplinaId,
        registro.totalAulas,
        id
      );
      if (resultado.changes) salvarDias(id, registro.dias);
      return resultado.changes;
    });
    if (!atualizarProfessor(professor)) {
      return NextResponse.json({ error: "Professor não encontrado." }, { status: 404 });
    }

    const atualizado = listarProfessores().find((item) => item.id_professor === id);
    return NextResponse.json({ ok: true, professor: atualizado });
  } catch (error) {
    return respostaErro(error, "Erro ao atualizar professor.");
  }
}

export async function DELETE(request) {
  try {
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Informe um identificador válido." }, { status: 400 });
    }
    const resultado = db.prepare(
      "DELETE FROM professores WHERE id_professor = ?"
    ).run(id);
    if (!resultado.changes) {
      return NextResponse.json({ error: "Professor não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao excluir professor." }, { status: 500 });
  }
}
