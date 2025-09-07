import os
import random
import bcrypt
from faker import Faker
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.orm import declarative_base
from datetime import datetime
from sympy import sympify, Eq

# --- Configuration ---
# Set up the database engine for MySQL.
# IMPORTANT: 
# 1. Make sure you have a MySQL driver installed (e.g., `pip install mysql-connector-python`).
# 2. Create a database in MySQL before running this script (e.g., CREATE DATABASE math_app;).
# 3. Replace 'your_user', 'your_password', '127.0.0.1', and 'math_app' with your actual database credentials.
DATABASE_URL = "mysql+mysqlconnector://root:@127.0.0.1/math_app"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
fake = Faker()

# --- SQLAlchemy ORM Models ---
# Define the database schema using Python classes. These remain the same.

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Unit(Base):
    __tablename__ = "unit"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    lessons = relationship("Lesson", back_populates="unit", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lesson"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    index = Column(Integer, nullable=False)
    unit_id = Column(Integer, ForeignKey("unit.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    unit = relationship("Unit", back_populates="lessons")
    questions = relationship("Question", back_populates="lesson", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "question"
    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String(255), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lesson.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    lesson = relationship("Lesson", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answer"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(255), nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    question_id = Column(Integer, ForeignKey("question.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    question = relationship("Question", back_populates="answers")


# --- Math Question Generation ---
# A more advanced function to generate questions and answers.
def generate_math_question():
    """
    Generates a math question, its correct answer, and three incorrect answers.
    Uses sympy for robust evaluation.
    """
    ops = ['+', '-', '*']
    op = random.choice(ops)
    
    if op == '+':
        num1 = random.randint(1, 100)
        num2 = random.randint(1, 100)
        question_text = f"What is {num1} + {num2}?"
    elif op == '-':
        num1 = random.randint(50, 100)
        num2 = random.randint(1, 49)
        question_text = f"What is {num1} - {num2}?"
    elif op == '*':
        num1 = random.randint(2, 12)
        num2 = random.randint(2, 12)
        question_text = f"What is {num1} * {num2}?"

    # Use sympy to safely evaluate the expression and find the correct answer
    expr = sympify(question_text.split("is ")[1].replace("?", ""))
    correct_answer = int(expr)
    
    incorrect_answers = set()
    while len(incorrect_answers) < 3:
        # Generate incorrect answers that are reasonably close to the correct one
        offset = random.randint(-10, 10)
        # Ensure the offset is not zero to avoid generating the correct answer
        if offset == 0:
            offset = random.choice([-1, 1])
        
        incorrect = correct_answer + offset
        if incorrect != correct_answer:
            incorrect_answers.add(incorrect)
            
    return question_text, correct_answer, list(incorrect_answers)

# --- Seeder Function ---
def seed_database():
    """
    Main function to populate the database with sample data.
    """
    db = SessionLocal()
    
    try:
        print("Starting database seeding...")

        # 1. Create an Admin User
        print("Creating admin user...")
        hashed_password = bcrypt.hashpw("adminpassword".encode('utf-8'), bcrypt.gensalt())
        admin_user = User(
            username="admin",
            email="admin@example.com",
            password=hashed_password.decode('utf-8'),
            is_admin=True
        )
        db.add(admin_user)
        
        # 2. Define Unit and Lesson Topics
        # This provides a more structured and realistic curriculum.
        curriculum = {
            "Arithmetic Basics": ["Introduction to Addition", "Mastering Subtraction", "Multiplication Fundamentals", "Division Concepts", "Order of Operations"],
            "Fractions and Decimals": ["Understanding Fractions", "Adding & Subtracting Fractions", "Multiplying Fractions", "Introduction to Decimals", "Decimal Operations"],
            "Pre-Algebra": ["Variables and Expressions", "Solving Linear Equations", "Understanding Inequalities", "Working with Exponents", "Introduction to Polynomials"],
            "Geometry Fundamentals": ["Points, Lines, and Planes", "Angles and Their Measures", "Introduction to Polygons", "Circles: Radius and Diameter", "Calculating Area and Perimeter"],
            "Data and Statistics": ["Reading Bar Graphs", "Understanding Mean, Median, and Mode", "Introduction to Probability", "Interpreting Pie Charts", "Data Collection Methods"]
        }
        
        unit_index = 1
        lesson_index_global = 1

        # 3. Loop through the curriculum to create Units, Lessons, Questions, and Answers
        for unit_name, lesson_names in curriculum.items():
            print(f"Creating Unit: {unit_name}")
            new_unit = Unit(name=unit_name, index=unit_index)
            db.add(new_unit)
            db.flush() # Flush to get the new_unit.id for the lessons

            for i, lesson_name in enumerate(lesson_names):
                print(f"  - Creating Lesson: {lesson_name}")
                new_lesson = Lesson(
                    name=lesson_name,
                    index=i + 1,
                    unit_id=new_unit.id
                )
                db.add(new_lesson)
                db.flush() # Flush to get new_lesson.id

                for _ in range(10): # Create 10 questions per lesson
                    question_text, correct_ans, incorrect_ans_list = generate_math_question()
                    
                    new_question = Question(
                        question_text=question_text,
                        lesson_id=new_lesson.id
                    )
                    db.add(new_question)
                    db.flush() # Flush to get new_question.id

                    # Create answers list
                    answers = []
                    # Add the correct answer
                    answers.append(Answer(text=str(correct_ans), is_correct=True, question_id=new_question.id))
                    # Add the incorrect answers
                    for ans in incorrect_ans_list:
                        answers.append(Answer(text=str(ans), is_correct=False, question_id=new_question.id))
                    
                    # Shuffle the answers so the correct one isn't always first
                    random.shuffle(answers)
                    db.add_all(answers)

            unit_index += 1

        # Commit all the changes to the database
        print("Committing all data to the database...")
        db.commit()
        print("Seeding complete!")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()


# --- Main Execution ---
if __name__ == "__main__":
    # Create all tables in the database
    # This will not drop existing tables, so if you need to start fresh,
    # you should drop the tables in your MySQL client first.
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    # Run the seeder
    seed_database()
