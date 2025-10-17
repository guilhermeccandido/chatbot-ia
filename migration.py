import psycopg2
import os
from psycopg2 import sql

# --- Configuração do Banco de Dados ---
# É uma boa prática usar variáveis de ambiente para dados sensíveis.
# Você pode defini-las no seu terminal antes de rodar o script.
# Ex: export DB_NAME="meu_db"
DB_CONFIG = {
    "dbname": os.environ.get("DB_NAME", "chatbot_db"),
    "user": os.environ.get("DB_USER", "postgres"),
    "password": os.environ.get("DB_PASSWORD", "postgres"),
    "host": os.environ.get("DB_HOST", "localhost"),
    "port": os.environ.get("DB_PORT", "5434"),
}

# --- Comandos SQL para Criação das Tabelas ---
# Usamos "CREATE TABLE IF NOT EXISTS" para que o script possa ser
# executado várias vezes sem causar erros.
TABLE_CREATION_COMMANDS = (
    """
    CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        api_key UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
        knowledge_base TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS chat_sessions (
        id SERIAL PRIMARY KEY,
        company_id INTEGER NOT NULL,
        end_user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_company
            FOREIGN KEY(company_id) 
            REFERENCES companies(id)
            ON DELETE CASCADE
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL,
        sender VARCHAR(50) NOT NULL CHECK (sender IN ('USER', 'BOT')),
        message_text TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_session
            FOREIGN KEY(session_id) 
            REFERENCES chat_sessions(id)
            ON DELETE CASCADE
    );
    """
)

def create_tables():
    """Cria as tabelas do banco de dados para o projeto de chatbot."""
    conn = None
    try:
        # Conecta ao servidor PostgreSQL. [4]
        print("Conectando ao banco de dados PostgreSQL...")
        conn = psycopg2.connect(**DB_CONFIG)
        
        # Cria um cursor para executar operações. [6]
        with conn.cursor() as cur:
            print("Conexão bem-sucedida. Criando tabelas...")
            # Executa cada comando de criação de tabela. [8]
            for command in TABLE_CREATION_COMMANDS:
                cur.execute(command)
            
            print("Tabelas verificadas/criadas com sucesso!")
            
        # Confirma as alterações no banco de dados.
        conn.commit()

    except psycopg2.OperationalError as e:
        print(f"Erro de conexão: {e}")
        print("Verifique se o PostgreSQL está rodando e se as credenciais estão corretas.")
    except psycopg2.Error as e:
        print(f"Ocorreu um erro ao criar as tabelas: {e}")
        if conn:
            # Reverte as alterações em caso de erro.
            conn.rollback()
    finally:
        # Garante que a conexão seja fechada. [1]
        if conn:
            conn.close()
            print("Conexão com o banco de dados fechada.")

if __name__ == '__main__':
    create_tables()
