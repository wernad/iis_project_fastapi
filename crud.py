from sqlalchemy.orm import Session, selectinload

import models, schemas

#User
def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    new_user = models.User(
        first_name= user.first_name,
        last_name= user.last_name,
        email= user.email,
        password= user.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

#Category
def get_category_by_id(db: Session, category_id: int):
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def get_categories_by_course(db: Session, course_id: int):
    return db.query(models.Category).filter(models.Category.course_id == course_id).all()

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()

#Course
def get_course_by_id(db: Session, course_id):
    return db.query(models.Course).filter(models.Course.id == course_id).first()

def get_approved_courses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Course).filter(models.Course.is_approved == True).all()

#Question
def get_question_by_id(db: Session, question_id: int):
    return db.query(models.Question).filter(models.Question.id == question_id).first()

def get_questions_by_user(db: Session, user_id: int):
    return db.query(models.Question).filter(models.Question.user_id == user_id).all()

def get_questions_by_category(db: Session, category_id: int):
    return db.query(models.Question).filter(models.Question.category_id == category_id).all()

def get_questions_by_course(db: Session, course_id: int):
    return db.query(models.Question).filter(models.Question.course_id == course_id).all()

def get_questions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Question).offset(skip).limit(limit).all()

#Answer
def get_answer_by_id(db: Session, answer_id: int):
    return db.query(models.Answer).filter(models.Answer.id == answer_id).first()

def get_answers_by_user(db: Session, user_id: int):
    return db.query(models.Answer).filter(models.Answer.user == user_id).all()

def get_answers_by_question(db: Session, question_id: int):
    return db.query(models.Answer).filter(models.Answer.question_id == question_id).all()

def get_answers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Answer).offset(skip).limit(limit).all()

#Reaction
def get_reaction_by_id(db: Session, reaction_id: int):
    return db.query(models.Reaction).filter(models.Reaction.id == reaction_id).first()

def get_reactions_by_user(db: Session, user_id: int):
    return db.query(models.Reaction).filter(models.Reaction.user_id == user_id).all()

def get_reactions_by_answer(db: Session, answer_id: int):
    return db.query(models.Reaction).filter(models.Reaction.answer_id == answer_id).all()

def get_reactions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Reaction).offset(skip).limit(limit).all()

#Upvote
def get_upvotes_by_user(db: Session, user_id: int):
    return db.query(models.Upvote).filter(models.Upvote.user_id == user_id).all()

def get_upvotes_by_answer(db: Session, answer_id: int):
    return db.query(models.Upvote).filter(models.Upvote.answer_id == answer_id).all()

def get_upvotes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Upvote).offset(skip).limit(limit).all()

#UserCourse
def get_usercourse_by_user(db: Session, user_id: int):
    return db.query(models.Upvote).filter(models.UserCourse.user_id == user_id).all()

def get_usercourse_by_course(db: Session, course_id: int):
    return db.query(models.Upvote).filter(models.UserCourse.course_id == course_id).all()

def get_upvotes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Upvote).offset(skip).limit(limit).all()