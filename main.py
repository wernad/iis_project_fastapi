from datetime import timedelta
from typing import Optional, List

from fastapi import Depends, FastAPI, HTTPException, status, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud, models, schemas
from database import SessionLocal, engine
import authentication as auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:3000/course", 
    "http://localhost:3000/question",
    "http://localhost:3000/top",
    "http://localhost:3000/user",
    "http://localhost:3000/top"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", status_code=201) 
async def register(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.email)
    if user:
        raise HTTPException(status_code=400, detail="This email is taken.")
    form_data.password = auth.get_password_hash(form_data.password)
    return crud.create_user(db, form_data)

@app.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not auth.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth.encode_token(user.id)
    return {"access_token": token, "token_type": "bearer"}

@app.post("/checkauth", response_model=schemas.TokenOwner)
async def check_if_logged_in(tokenData: schemas.Token, db: Session = Depends(get_db)):
    if not tokenData:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not logged in. Please log in.")
    user_id = auth.decode_token(tokenData.access_token)
    return  user_id

@app.get("/profile/{user_id}", response_model=schemas.User)
async def get_profile(user_id, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)

    return user

@app.get("/courses")
async def get_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    courses = crud.get_approved_courses(db, skip=skip, limit=limit)
    return courses

@app.get("/course/{course_id}", response_model=schemas.CourseDetail)
async def get_course_detail(course_id, db: Session = Depends(get_db)):
    course = crud.get_course_by_id(db, course_id)
    if not course.is_approved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return course

@app.get("/mycourses/{user_id}", response_model=schemas.UserCourse)
async def get_my_courses(user_id, db: Session = Depends(get_course_detail)):
    my_courses = crud.get_usercourse_by_user(db, user_id)

    return my_courses

@app.get("/question/{question_id}", response_model=schemas.Question)
async def get_question_detail(question_id, db: Session = Depends(get_db)):
    question = crud.get_question_by_id(db, question_id)
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return question