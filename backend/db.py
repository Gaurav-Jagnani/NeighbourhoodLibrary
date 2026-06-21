from sqlalchemy import create_engine


def get_connection():
    # use for docker
    engine = create_engine("postgresql://postgres:postgres@postgres:5432/library_db")
    # use for local
    # engine = create_engine("postgresql://postgres:postgres@localhost:5432/library_db")
    conn = engine.connect()

    try:
        yield conn
    finally:
        conn.close()
