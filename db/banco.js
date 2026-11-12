import Database from "better-sqlite3";
import path from "node:path";

const dbPath = path.join(process.cwd(), "db", "escola.db");
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS alunos (
        id_aluno INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        idade INTEGER NOT NULL,
        serie TEXT NOT NULL,
        ra TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS notas (
        id_nota INTEGER PRIMARY KEY AUTOINCREMENT,
        aluno_id INTEGER NOT NULL,
        t1 REAL NOT NULL,
        t2 REAL NOT NULL,
        t3 REAL NOT NULL,
        n1 REAL NOT NULL,
        n2 REAL NOT NULL,
        n3 REAL NOT NULL,
        FOREIGN KEY (aluno_id) REFERENCES alunos (id_aluno)
        ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS disciplinas (
        id_disciplina INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        pontuacao_minima REAL NOT NULL CHECK (pontuacao_minima >= 0 AND pontuacao_minima <= 10)
    );

    CREATE TABLE IF NOT EXISTS professores (
        id_professor INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        matricula_nif TEXT NOT NULL UNIQUE,
        disciplina_id INTEGER NOT NULL,
        total_aulas_semana INTEGER NOT NULL CHECK (total_aulas_semana >= 0),
        FOREIGN KEY (disciplina_id) REFERENCES disciplinas (id_disciplina)
        ON DELETE RESTRICT ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS professor_dias (
        professor_id INTEGER NOT NULL,
        dia_semana TEXT NOT NULL CHECK (
            dia_semana IN ('Segunda-feira', 'Terca-feira', 'Quarta-feira',
                           'Quinta-feira', 'Sexta-feira', 'Sabado', 'Domingo')
        ),
        PRIMARY KEY (professor_id, dia_semana),
        FOREIGN KEY (professor_id) REFERENCES professores (id_professor)
        ON DELETE CASCADE ON UPDATE CASCADE
    );
`);

console.log("Banco de dados criado com sucesso!");

export default db;