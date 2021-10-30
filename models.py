from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(20))

    year = Column(Integer)
    program = Column(String(3))

    management_level = Column(Integer)

    questions = relationship('Question', back_populates='author')
    answers = relationship('Answer', back_populates='author')
    reactions = relationship('Reaction', back_populates='author')
    courses = relationship('UserCourse', back_populates='supervisors')

class Course(Base):
    __tablename__ = 'course'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), index=True, nullable=False)

class Category(Base):
    __tablename__ = 'category'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    course = Column(Integer, ForeignKey('course.id'))

class Question(Base):
    __tablename__ = 'question'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), nullable=False)
    description = Column(String(1000), nullable=False)
    is_open = Column(Boolean, nullable=False)
    category = Column(Integer, nullable=False)
    course = Column(Integer, nullable=False)
    user = Column(Integer, ForeignKey('user.id'))

    author = relationship('User', back_populates='questions')

class Answer(Base):
    __tablename__ = 'answer'
    
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(1000), nullable=False)
    question = Column(Integer, ForeignKey('question.id'))
    user = Column(Integer, ForeignKey('user.id'))

    author = relationship('User', back_populates='answers')

class Reaction(Base):
    __tablename__ = 'reaction'

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(1000), nullable=False)
    answer = Column(Integer, ForeignKey('answer.id'))
    user = Column(Integer, ForeignKey('user.id'))

    author = relationship('User', back_populates='reactions')

class Upvote(Base):
    __tablename__ = 'upvote'

    id = Column(Integer, primary_key=True, index=True)
    answer = Column(Integer, ForeignKey('answer.id'))
    user = Column(Integer, ForeignKey('user.id'))

class UserCourse(Base):
    __tablename__ = 'teachercourse'

    id = Column(Integer, ForeignKey('user.id'), primary_key=True, index=True)
    course = Column(Integer, ForeignKey('course.id'), primary_key=True, index=True)
    teacher = Column(Boolean)
    approved = Column(Boolean)

    supervisors = relationship('User', back_populates='courses')