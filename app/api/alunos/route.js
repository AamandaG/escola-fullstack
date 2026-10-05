import db from "../../../db/banco";
import { NextResponse } from "next/server";

export async function GET() {
  const alunos = db.prepare("SELECT * FROM alunos").all();
  return NextResponse.json({ alunos });
}

export async function POST(request) {
  try {
    const dados = await request.json();
    const stmt = db.prepare(
      "INSERT INTO alunos (nome, idade, serie, ra) VALUES (?, ?, ?, ?)"
    );

    const aluno = stmt.run(dados.nome, Number(dados.idade), dados.serie, dados.ra);
    return NextResponse.json({ ok: true, aluno });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao salvar aluno.", details: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  try {
    const dados = await request.json();
    const id = Number(dados.id_aluno);
    const idade = Number(dados.idade);

    if (
      !Number.isInteger(id) || id <= 0 ||
      !dados.nome?.trim() ||
      !Number.isInteger(idade) || idade <= 0 ||
      !dados.serie?.trim() ||
      !dados.ra?.trim()
    ) {
      return NextResponse.json(
        { error: "Informe nome, idade, série e RA válidos." },
        { status: 400 }
      );
    }

    const stmt = db.prepare(
      "UPDATE alunos SET nome = ?, idade = ?, serie = ?, ra = ? WHERE id_aluno = ?"
    );
    const resultado = stmt.run(
      dados.nome.trim(),
      idade,
      dados.serie.trim(),
      dados.ra.trim(),
      id
    );

    if (resultado.changes === 0) {
      return NextResponse.json(
        { error: "Aluno não encontrado." },
        { status: 404 }
      );
    }

    const aluno = db.prepare("SELECT * FROM alunos WHERE id_aluno = ?").get(id);
    return NextResponse.json({ ok: true, aluno });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar aluno.", details: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID do aluno não informado." },
        { status: 400 }
      );
    }

    const stmt = db.prepare("DELETE FROM alunos WHERE id_aluno = ?");
    const resultado = stmt.run(Number(id));

    if (resultado.changes === 0) {
      return NextResponse.json(
        { message: "Aluno não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Aluno deletado com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao deletar o aluno." },
      { status: 500 }
    );
  }
}
