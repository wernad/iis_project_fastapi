from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel
from sqlalchemy.sql.sqltypes import DateTime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ReactionBase(BaseModel):
    description: str
    date: datetime

class ReactionCreate(ReactionBase):
    pass

class Reaction(ReactionBase):
    answer_id: int
    user_id: int

    class Config:
        orm_mode = True

class UpvoteBase(BaseModel):
    answer_id: int
    user_id: int

class UpvoteCreate(UpvoteBase):
    pass

class Upvote(UpvoteBase):
    
    class Config:
        orm_mode = True

class AnswerBase(BaseModel):
    description: str
    is_correct: bool
    date: datetime

class AnswerCreate(AnswerBase):
    pass

class Answer(AnswerBase): 
    answer_id: int
    question_id: int
    user_id: int
    reactions: List[Reaction] = []
    upvotes: List[Upvote] = []

    class Config:
        orm_mode = True

class QuestionBase(BaseModel):
    title: str
    description: str
    is_open: bool
    date: datetime

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    question_id: int
    user_id: int
    category_id: int
    course_id: int
    answers: List[Answer] = []

    class Config:
        orm_mode = True

class UserCourseBase(BaseModel):
    is_teacher: bool
    is_approved: bool

class UserCourseCreate(UserCourseBase):
    pass

class UserCourse(UserCourseBase):
    user_id: int
    course_id: int

    class Config:
        orm_mode = True

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    category_id: int
    course_id: int
    questions: List[Question] = []

    class Config:
        orm_mode = True

class CourseBase(BaseModel):
    name: str
    is_approved: bool

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    course_id: int
    users: List[UserCourse] = []
    categories: List[Category] = []

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: int
    management_level: int

    questions : List[Question] = []
    answers : List[Answer] = []
    reactions : List[Reaction] = []
    courses : List[UserCourse] = []
    upvotes : List[Upvote] = []

    class Config:
        orm_mode = True