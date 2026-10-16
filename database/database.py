import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "database", "study_assistant.db")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

# ============================================
# DATABASE CONNECTION
# ============================================

def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection



# ============================================
# CREATE DATABASE TABLES
# ============================================

def create_tables():

    connection = get_connection()

    cursor = connection.cursor()


    # ============================================
    # USERS TABLE
    # ============================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            email TEXT UNIQUE NOT NULL,

            password TEXT NOT NULL

        )
    """)


    # ============================================
    # CHECK USERS COLUMNS
    # ============================================

    cursor.execute(
        "PRAGMA table_info(users)"
    )

    columns = cursor.fetchall()

    column_names = [
        column["name"]
        for column in columns
    ]


    # ============================================
    # ADD COURSE COLUMN
    # ============================================

    if "course" not in column_names:

        cursor.execute(
            "ALTER TABLE users ADD COLUMN course TEXT"
        )


    # ============================================
    # STUDY MATERIALS TABLE
    # ============================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS study_materials (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            filename TEXT NOT NULL,

            extracted_text TEXT NOT NULL,

            FOREIGN KEY (user_id)
            REFERENCES users(id)

        )
    """)


    # ============================================
    # STUDY PLANS TABLE
    # ============================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS study_plans (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            subject TEXT NOT NULL,

            topic TEXT,

            study_date TEXT,

            start_time TEXT,

            end_time TEXT,

            status TEXT DEFAULT 'Pending',

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
            REFERENCES users(id)

        )
    """)


    # ============================================
    # QUIZ RESULTS TABLE
    # ============================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS quiz_results (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            subject TEXT,

            topic TEXT,

            total_questions INTEGER NOT NULL,

            correct_answers INTEGER NOT NULL,

            score REAL NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
            REFERENCES users(id)

        )
    """)


    # ============================================
    # PROGRESS TABLE
    # ============================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS progress (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            subject TEXT NOT NULL,

            topic TEXT,

            study_minutes INTEGER DEFAULT 0,

            completed_topics INTEGER DEFAULT 0,

            weak_topics TEXT,

            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
            REFERENCES users(id)

        )
    """)


    # ============================================
    # ACHIEVEMENTS TABLE
    # ============================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS achievements (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            achievement_name TEXT NOT NULL,

            description TEXT,

            unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
            REFERENCES users(id)

        )
    """)


    # ============================================
    # USER SETTINGS TABLE
    # ============================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_settings (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER UNIQUE NOT NULL,

            language TEXT DEFAULT 'English',

            study_goal TEXT,

            daily_study_hours REAL DEFAULT 2,

            preferred_study_time TEXT,

            FOREIGN KEY (user_id)
            REFERENCES users(id)

        )
    """)


    # ============================================
    # MATERIAL AI ACTIONS TABLE
    # ============================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS material_actions (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            material_id INTEGER NOT NULL,

            user_id INTEGER NOT NULL,

            action_type TEXT NOT NULL,

            result TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (material_id)
            REFERENCES study_materials(id),

            FOREIGN KEY (user_id)
            REFERENCES users(id)

        )
    """)


    # ============================================
    # COMMIT CHANGES
    # ============================================

    connection.commit()

    connection.close()


# ============================================
# CREATE TABLES WHEN FILE IS RUN
# ============================================

create_tables()