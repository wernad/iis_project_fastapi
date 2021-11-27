from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, status, Cookie
from fastapi.encoders import jsonable_encoder
import json
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud, models, schemas
from database import SessionLocal, engine
import authentication as auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
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
        raise HTTPException(status_code=400, detail="Tento email už existuje.")
    form_data.password = auth.get_password_hash(form_data.password)
    return crud.create_user(db, form_data)

@app.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Užívateľ neexistuje.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Užívateľ neexistuje.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not auth.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nesprávne heslo.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth.encode_token(user.id)
    return {"access_token": token}

#Checks if user token is still valid, returns id of user.
@app.post("/checkauth", response_model=schemas.TokenOwner)
async def check_if_logged_in(access_token: Optional[str] = Cookie(default=None)):
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Autorizačný token neexistuje")
    user_id = auth.decode_token(access_token)
    return {"user_id": user_id}

@app.post("/addquestion")
async def create_question(form_data: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db, form_data)

@app.post("/addanswer")
async def create_answer(form_data: schemas.AnswerCreate, db: Session = Depends(get_db)):
    answer = crud.get_answer_by_question_and_user(db, form_data.question_id, form_data.user_id)
    if answer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Túto otázku ste už zodpovedali.",
        )

    return crud.create_answer(db, form_data)

@app.post("/addreaction")
async def create_reaction(form_data: schemas.ReactionCreate, db: Session = Depends(get_db)):
    return crud.create_reaction(db, form_data)

@app.post("/addupvote")
async def create_upvote(form_data: schemas.UpvoteCreate, db: Session = Depends(get_db)):
    return crud.create_upvote(db, form_data)

@app.post("/addcategory")
async def create_category(form_data: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db, form_data)

@app.post("/addcourse")
async def create_course(form_data: schemas.CourseCreate, db: Session = Depends(get_db)):
    course = crud.get_course_by_name(db, form_data.name)
    if course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kurz s týmto názvom už existuje.",
        )
    course = crud.create_course(db, form_data)
    new_usercourse = schemas.UserCourseCreate(user_id=form_data.user_id, course_id=course.id)
    userCourse = crud.create_usercourse(db, new_usercourse, True)

    return userCourse

@app.post("/coursesignup")
async def apply_to_course(form_data: schemas.UserCourseCreate, db: Session = Depends(get_db)):
    return crud.create_usercourse(db, form_data)    

@app.put("/closequestion")
async def close_question(form_data: schemas.QuestionClose, db: Session = Depends(get_db)):
    correct_answers_ids = form_data.correct_answers
    upvoted_answers_ids = form_data.upvoted_answers
    final_answer = form_data.final_answer

    user_id = final_answer.user_id
    question_id = final_answer.question_id

    question = crud.get_question_by_id(db, question_id)
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Otázka nenájdená.",
        )

    if not question.is_open:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Otázka je už uzatvorená.",
        )

    for id in correct_answers_ids:
        answer = crud.get_answer_by_id(db, id)

        answer = crud.update_answer_correct(db, answer)
        if not answer:
            db.rollback()
            raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Otázka je už uzatvorená.",
        )    

    db.commit()
    
    for id in upvoted_answers_ids:
        new_upvote = schemas.UpvoteCreate(answer_id=id, user_id=user_id)
        crud.create_upvote(db, new_upvote)
    
    final_answer = crud.create_answer(db, final_answer)
    closed_question = crud.close_question(db, question)

    return closed_question

@app.put("/updatecategory")
async def update_category(form_data: schemas.CategoryUpdate, db: Session = Depends(get_db)):
    category = crud.get_category_by_id(db, form_data.id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kategória neexistuje",
        )
    category = crud.update_category(db, category, form_data.name)
    return category

@app.put("/approvecourse")
async def approve_course(course_id: int, db: Session = Depends(get_db)):
    course = crud.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kurz neexistuje",
        )
    
    course = crud.approve_course(db, course)

    usercourse = crud.get_usercourse_by_course_single_user(db, course_id)
    if not usercourse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tento kurz nemá pridaných žiadnych užívateľov.",
        )

    usercourse = crud.approve_usercourse(db, usercourse)
    db.commit()
    return course

@app.put("/updateusercourse")
async def approve_usercourse(form_data: schemas.UserCourseCreate, db: Session = Depends(get_db)):
    usercourse = crud.get_usercourse_by_course_user(db, form_data.user_id, form_data.course_id)
    usercourse = crud.approve_usercourse(db, usercourse)
    return usercourse

@app.put("/updateuser")
async def update_user(form_data: schemas.UserUpdate, db: Session = Depends(get_db)):    
    if form_data.password:
        form_data.password = auth.get_password_hash(form_data.password)

    user = crud.update_user(db, form_data)
    return user

@app.get("/courseswithupvotes")
async def get_courses_with_upvotes_only(db: Session = Depends(get_db)):
    courses= crud.get_courses_with_upvotes_only(db)

    return courses

@app.get("/unapprovedcourses")
async def get_unapproved_courses(db: Session = Depends(get_db)):
    courses = crud.get_unapproved_courses(db)

    return courses

@app.get("/topusers")
async def get_top_users(db: Session = Depends(get_db)):
    top_users = crud.get_users_with_upvotes(db)

    return top_users

@app.get("/topuserscourse/{course_id}")
async def get_top_users_in_course(course_id, db: Session = Depends(get_db)):
    top_users = crud.get_users_with_upvotes_by_course(db, course_id)

    return top_users

@app.get("/profile/{user_id}", response_model=schemas.UserWithManagement)
async def get_profile(user_id, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)

    return user

@app.get("/courses")
async def get_courses(db: Session = Depends(get_db)):
    courses = crud.get_approved_courses(db)
    return courses

@app.get("/course/{course_id}", response_model=schemas.CourseDetail)
async def get_course_detail(course_id, db: Session = Depends(get_db)):
    course = crud.get_course_by_id(db, course_id)
    if not course.is_approved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kurz neexistuje.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return course

@app.get("/mycourses/{user_id}", response_model=schemas.UserMyCourses)
async def get_my_courses(user_id, db: Session = Depends(get_db)):
    my_courses = crud.get_user_by_id(db, user_id)

    return my_courses

@app.get("/question/{question_id}", response_model=schemas.Question)
async def get_question_detail(question_id, db: Session = Depends(get_db)):
    question = crud.get_question_by_id(db, question_id)
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Otázka neexistuje",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return question