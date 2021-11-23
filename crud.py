from sqlalchemy import func, desc
from sqlalchemy.orm import Session, descriptor_props
from sqlalchemy.sql.elements import False_
from sqlalchemy.sql.expression import false

import models, schemas

#User
def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session):
    return db.query(models.User).all()

def get_users_with_upvotes(db: Session):
    subq =  db.query(models.User, models.Upvote,  models.Answer, models.Question
        ).filter(models.Upvote.answer_id == models.Answer.id
        ).filter(models.User.id == models.Answer.user_id
        ).filter(models.Answer.is_correct == True
        ).filter(models.Answer.question_id == models.Question.id
        ).filter(models.Question.is_open == False
        ).with_entities(models.User.first_name, models.User.last_name, models.User.email).subquery()
    return db.query(subq, func.count(subq.c.email).label("votes")).group_by(subq.c.email).order_by(desc("votes")).all()

def get_users_with_upvotes_by_course(db: Session, course_id):
    subq =  db.query(models.User, models.Upvote, models.Answer, models.Question, models.Course
        ).filter(models.Upvote.answer_id == models.Answer.id
        ).filter(models.User.id == models.Answer.user_id
        ).filter(models.Answer.is_correct == True
        ).filter(models.Answer.question_id == models.Question.id
        ).filter(models.Question.is_open == False
        ).filter(models.Question.course_id == models.Course.id
        ).filter(models.Course.id == course_id
        ).with_entities(models.User.first_name, models.User.last_name, models.User.email, models.Course.name).subquery()
    return db.query(subq, func.count(subq.c.email).label("votes")).group_by(subq.c.email, subq.c.name).order_by(desc("votes")).all()

def create_user(db: Session, user: schemas.UserCreate):
    new_user = models.User(
        first_name= user.first_name,
        last_name= user.last_name,
        email= user.email,
        password= user.password,
        active= True
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

def get_approved_courses(db: Session):
    return db.query(models.Course).filter(models.Course.is_approved == True).all()

def get_courses_with_upvotes_only(db: Session):
    subq =  db.query(models.Upvote, models.Answer, models.Question, models.Course
        ).filter(models.Upvote.answer_id == models.Answer.id
        ).filter(models.Answer.is_correct == True
        ).filter(models.Answer.question_id == models.Question.id
        ).filter(models.Question.is_open == False
        ).filter(models.Question.course_id == models.Course.id
        ).with_entities(models.Course.id, models.Course.name).subquery()
    return db.query(subq).group_by(subq.c.id).all()

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

def create_question(db: Session, question: schemas.QuestionCreate):
    question = models.Question(
        title= question.title,
        description= question.description,
        date= question.date,
        user_id= question.user_id,
        category_id= question.category_id,
        course_id= question.course_id,
        is_open= True
    )
    db.add(question)
    db.commit()
    db.refresh(question)

    return question

#Answer
def get_answer_by_id(db: Session, answer_id: int):
    return db.query(models.Answer).filter(models.Answer.id == answer_id).first()

def get_answers_by_user(db: Session, user_id: int):
    return db.query(models.Answer).filter(models.Answer.user == user_id).all()

def get_answers_by_question(db: Session, question_id: int):
    return db.query(models.Answer).filter(models.Answer.question_id == question_id).all()

def get_answer_by_question_and_user(db: Session, question_id: int, user_id: int):
    return db.query(models.Answer).filter(models.Answer.question_id == question_id).filter(models.Answer.user_id == user_id).first()

def get_answers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Answer).offset(skip).limit(limit).all()

def create_answer(db: Session, answer: schemas.AnswerCreate):
    new_answer = models.Answer(
        description= answer.description,
        user_id= answer.user_id,
        date= answer.date,
        question_id=answer.question_id,
        is_correct=False
    )
    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)
    return new_answer 

#Reaction
def get_reaction_by_id(db: Session, reaction_id: int):
    return db.query(models.Reaction).filter(models.Reaction.id == reaction_id).first()

def get_reactions_by_user(db: Session, user_id: int):
    return db.query(models.Reaction).filter(models.Reaction.user_id == user_id).all()

def get_reactions_by_answer(db: Session, answer_id: int):
    return db.query(models.Reaction).filter(models.Reaction.answer_id == answer_id).all()

def get_reactions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Reaction).offset(skip).limit(limit).all()

def create_reaction(db: Session, reaction: schemas.ReactionCreate):
    new_reaction = models.Reaction(
        description= reaction.description,
        user_id= reaction.user_id,
        date= reaction.date,
        answer_id=reaction.answer_id
    )
    db.add(new_reaction)
    db.commit()
    db.refresh(new_reaction)
    return new_reaction 

#Upvote
def get_upvotes_by_user(db: Session, user_id: int):
    return db.query(models.Upvote).filter(models.Upvote.user_id == user_id).all()

def get_upvotes_by_answer(db: Session, answer_id: int):
    return db.query(models.Upvote).filter(models.Upvote.answer_id == answer_id).all()

def get_upvotes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Upvote).offset(skip).limit(limit).all()

def create_upvote(db: Session, form_data: schemas.UpvoteCreate):
    new_upvote = models.Upvote(
        user_id=form_data.user_id,
        answer_id=form_data.answer_id
    )
    db.add(new_upvote)
    db.commit()
    db.refresh(new_upvote)
    return new_upvote 

#UserCourse
def get_usercourse_by_user(db: Session, user_id: int):
    return db.query(models.UserCourse).filter(models.UserCourse.user_id == user_id).all()

def get_usercourse_by_course(db: Session, course_id: int):
    return db.query(models.UserCourse).filter(models.UserCourse.course_id == course_id).all()

def get_usercourse_by_course_not_approved_only(db: Session, course_id: int):
    return db.query(models.UserCourse).filter(models.UserCourse.course_id == course_id, models.UserCourse.is_approved == False).all()

def get_upvotes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.UserCourse).offset(skip).limit(limit).all()