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
`);

console.log("Banco de dados criado com sucesso!");

export default db;