from datetime import datetime
from typing import List, Optional, ForwardRef

from pydantic import BaseModel
from sqlalchemy.orm.session import COMMITTED
from sqlalchemy.sql.sqltypes import DateTime

User = ForwardRef('User')
Course = ForwardRef('Course')

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenOwner(BaseModel):
    id: Optional[int]

class ReactionBase(BaseModel):
    description: str
    date: datetime

class ReactionCreate(ReactionBase):
    pass

class Reaction(ReactionBase):
    answer_id: int
    user_id: int
    user: Optional[User] = None

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
    id: int
    question_id: int
    user_id: int
    reactions: List[Reaction] = []
    upvotes: List[Upvote] = []
    user: Optional[User] = None

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
    id: int
    user_id: int
    category_id: int
    course_id: int
    answers: List[Answer] = []
    user: Optional[User] = None

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
    course: Optional[Course] = None

    class Config:
        orm_mode = True

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    course_id: int

    class Config:
        orm_mode = True

class CategoryDetail(CategoryBase):
    id: int
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
    id: int
    categories: List[Category] = []
    
    class Config:
        orm_mode = True

class CourseDetail(CourseBase):
    id: int
    users: List[UserCourse] = []
    categories: List[Category] = []
    questions: List[Question] = []

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserMyCourses(BaseModel):
    courses: List[UserCourse] = []
    
    class Config:
        orm_mode = True
        
Reaction.update_forward_refs()
Answer.update_forward_refs()
Question.update_forward_refs()
UserCourse.update_forward_refs()