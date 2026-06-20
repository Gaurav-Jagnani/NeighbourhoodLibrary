from sqlalchemy import create_engine

def get_connection():
    engine = create_engine(
        "postgresql://postgres:postgres@localhost:5432/library_db")
    conn = engine.connect()
    try:
        yield conn
    finally:
        conn.close()