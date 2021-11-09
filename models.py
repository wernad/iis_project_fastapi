from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import DateTime

from database import Base

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(20))

    year = Column(Integer)
    program = Column(String(3))

    management_level = Column(Integer)

    questions = relationship('Question', back_populates='user')
    answers = relationship('Answer', back_populates='user')
    reactions = relationship('Reaction', back_populates='user')
    courses = relationship('UserCourse', back_populates='users')

class Course(Base):
    __tablename__ = 'course'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), index=True, nullable=False)
    is_approved = Column(Boolean)

class Category(Base):
    __tablename__ = 'category'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    course_id = Column(Integer, ForeignKey('course.id'))

class Question(Base):
    __tablename__ = 'question'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), nullable=False)
    description = Column(String(1000), nullable=False)
    is_open = Column(Boolean, nullable=False)
    date = Column(DateTime, nullable=False)

    category_id = Column(Integer, ForeignKey('category.id'))
    course_id = Column(Integer, ForeignKey('course.id'))
    user_id = Column(Integer, ForeignKey('user.id'))

    user = relationship('User', back_populates='questions')

class Answer(Base):
    __tablename__ = 'answer'
    
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(1000), nullable=False)
    date = Column(DateTime, nullable=False)

    question_id = Column(Integer, ForeignKey('question.id'))
    user_id = Column(Integer, ForeignKey('user.id'))

    user = relationship('User', back_populates='answers')

class Reaction(Base):
    __tablename__ = 'reaction'

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(1000), nullable=False)
    date = Column(DateTime, nullable=False)

    answer_id = Column(Integer, ForeignKey('answer.id'))
    user_id = Column(Integer, ForeignKey('user.id'))

    user = relationship('User', back_populates='reactions')

class Upvote(Base):
    __tablename__ = 'upvote'

    answer_id = Column(Integer, ForeignKey('answer.id'), primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True)

class UserCourse(Base):
    __tablename__ = 'usercourse'

    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey('course.id'), primary_key=True, index=True)
    is_teacher = Column(Boolean)

    users = relationship('User', back_populates='courses')