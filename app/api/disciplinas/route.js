import db from "../../../db/banco";
import { NextResponse } from "next/server";

function validarDisciplina(dados) {
  const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";
  const pontuacao = Number(dados.pontuacao_minima);

  if (!nome || !Number.isFinite(pontuacao) || pontuacao < 0 || pontuacao > 10) {
    return null;
  }

  return { nome, pontuacao };
}

function respostaErro(error, mensagem) {
  console.error(error);
  const conflito = error.code === "SQLITE_CONSTRAINT_UNIQUE";
  return NextResponse.json(
    { error: conflito ? "Já existe uma disciplina com esse nome." : mensagem },
    { status: conflito ? 409 : 400 }
  );
}

export async function GET() {
  const disciplinas = db.prepare(
    "SELECT * FROM disciplinas ORDER BY nome"
  ).all();
  return NextResponse.json({ disciplinas });
}

export async function POST(request) {
  try {
    const disciplina = validarDisciplina(await request.json());
    if (!disciplina) {
      return NextResponse.json(
        { error: "Informe o nome e uma pontuação mínima entre 0 e 10." },
        { status: 400 }
      );
    }

    const resultado = db.prepare(
      "INSERT INTO disciplinas (nome, pontuacao_minima) VALUES (?, ?)"
    ).run(disciplina.nome, disciplina.pontuacao);
    const criada = db.prepare(
      "SELECT * FROM disciplinas WHERE id_disciplina = ?"
    ).get(resultado.lastInsertRowid);
    return NextResponse.json({ ok: true, disciplina: criada }, { status: 201 });
  } catch (error) {
    return respostaErro(error, "Erro ao cadastrar disciplina.");
  }
}

export async function PUT(request) {
  try {
    const dados = await request.json();
    const id = Number(dados.id_disciplina);
    const disciplina = validarDisciplina(dados);
    if (!Number.isInteger(id) || id <= 0 || !disciplina) {
      return NextResponse.json(
        { error: "Informe o identificador, nome e pontuação mínima entre 0 e 10." },
        { status: 400 }
      );
    }

    const resultado = db.prepare(
      "UPDATE disciplinas SET nome = ?, pontuacao_minima = ? WHERE id_disciplina = ?"
    ).run(disciplina.nome, disciplina.pontuacao, id);
    if (!resultado.changes) {
      return NextResponse.json({ error: "Disciplina não encontrada." }, { status: 404 });
    }

    const atualizada = db.prepare(
      "SELECT * FROM disciplinas WHERE id_disciplina = ?"
    ).get(id);
    return NextResponse.json({ ok: true, disciplina: atualizada });
  } catch (error) {
    return respostaErro(error, "Erro ao atualizar disciplina.");
  }
}

export async function DELETE(request) {
  try {
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Informe um identificador válido." }, { status: 400 });
    }

    const resultado = db.prepare(
      "DELETE FROM disciplinas WHERE id_disciplina = ?"
    ).run(id);
    if (!resultado.changes) {
      return NextResponse.json({ error: "Disciplina não encontrada." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    if (
      error.code === "SQLITE_CONSTRAINT_FOREIGNKEY" ||
      error.code === "SQLITE_CONSTRAINT_TRIGGER"
    ) {
      return NextResponse.json(
        { error: "Não é possível excluir uma disciplina vinculada a um professor." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Erro ao excluir disciplina." }, { status: 500 });
  }
}
