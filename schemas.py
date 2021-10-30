from typing import List, Optional

from pydantic import BaseModel

class CourseBase(BaseModel):
    name: str

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
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

    class Config:
        orm_mode = True

class QuestionBase(BaseModel):
    title: str
    description: str
    is_open: bool

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    question_id: int
    user_id: int

    class Config:
        orm_mode = True

class AnswerBase(BaseModel):
    description: str
    question: int
    user_id: int

class AnswerCreate(AnswerBase):
    pass

class Answer(AnswerBase): 
    answer_id: int

    class Config:
        orm_mode = True

class ReactionBase(BaseModel):
    description: int
    answer_id: int

class ReactionCreate(ReactionBase):
    pass

class Reaction(ReactionBase):
    reaction_id: int 
    user_id: int

    class Config:
        orm_mode = True

class UpvoteBase(BaseModel):
    answer: int
    user: int

class UpvoteCreate(UpvoteBase):
    pass

class Upvote(UpvoteBase):
    upvote_id: int 
    
    class Config:
        orm_mode = True

class UserCourseBase(BaseModel):
    approved: bool

class UserCourseCreate(UserCourseBase):
    pass

class UserCourse(UserCourseBase):
    user: int
    course_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    year: int
    program: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: int
    management_level: int

    questions : List[Question] = []
    answers : List[Answer] = []
    reactions : List[Reaction] = []
    courses : List[Course] = []

    class Config:
        orm_mode = True