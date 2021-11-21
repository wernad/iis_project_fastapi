from datetime import datetime
from typing import List, Optional, ForwardRef

from pydantic import BaseModel
from sqlalchemy.orm.session import COMMITTED
from sqlalchemy.sql.expression import false
from sqlalchemy.sql.sqltypes import DateTime

User = ForwardRef('User')
UserCourseUserId = ForwardRef('UserId')
UserBase = ForwardRef('UserBase')
Course = ForwardRef('Course')
CourseUsers = ForwardRef('CourseUsers')

#Token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenOwner(BaseModel):
    id: Optional[int]

#Reaction
class ReactionBase(BaseModel):
    description: str
    date: datetime
    answer_id: int
    user_id: int

class ReactionCreate(ReactionBase):
    pass

class Reaction(ReactionBase):
    user: Optional[UserBase] = None

    class Config:
        orm_mode = True

#Upvote
class UpvoteBase(BaseModel):
    answer_id: int
    user_id: int

class UpvoteCreate(UpvoteBase):
    pass

class Upvote(UpvoteBase):

    class Config:
        orm_mode = True

#Answer
class AnswerBase(BaseModel):
    description: str
    date: datetime = datetime.now()
    question_id: int
    user_id: int

class AnswerCreate(AnswerBase):
    pass

class Answer(AnswerBase): 
    id: int    
    is_correct: bool = False
    reactions: List[Reaction] = []
    upvotes: List[Upvote] = []
    user: Optional[UserBase] = None

    class Config:
        orm_mode = True

#Question
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
    user: Optional[UserBase] = None
    course: Optional[CourseUsers] = None

    class Config:
        orm_mode = True

#UserCourse
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

class UserCourseUserId(UserCourseBase):
    user_id: int

    class Config:
        orm_mode = True

#Category
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

#Course
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

class CourseUsers(BaseModel):
    users: List[UserCourseUserId] = []

    class Config:
        orm_mode = True

class CourseDetail(CourseBase):
    id: int
    users: List[UserCourse] = []
    categories: List[Category] = []
    questions: List[Question] = []

    class Config:
        orm_mode = True

#User
class UserBase(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: str

    class Config:
        orm_mode = True

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
CourseUsers.update_forward_refs()
UserCourse.update_forward_refs()