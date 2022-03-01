from typing import Optional, List

from fastapi import Depends, FastAPI, HTTPException, status, Cookie, Query
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
    "http://104.238.158.167",
    "http://104.238.158.167:3000",
    "http://104.238.158.167:3000/course", 
    "http://104.238.158.167:3000/question",
    "http://104.238.158.167:3000/top",
    "http://104.238.158.167:3000/user",
    "http://104.238.158.167:3000/top"
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

def check_user_is_active(user: int = Depends(auth.auth_request), db: Session = Depends(get_db)):
    new_user = crud.get_user_by_id_is_active(db, user["id"])
    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tento účet nie je aktívny.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@app.post("/register", status_code=201) 
async def register(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tento email je zabraný.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    form_data.password = auth.get_password_hash(form_data.password)
    return crud.create_user_register(db, form_data)

@app.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Užívateľ s týmto emailom neexistuje.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tento účet nie je aktívny.",
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

@app.post("/checkauth", response_model=schemas.TokenOwner)
async def check_if_logged_in(user: int = Depends(check_user_is_active)):
    return user

@app.post("/adduser")
async def create_user(form_data: schemas.UserCreateAllData, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    user = crud.get_user_by_email(db, form_data.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tento email je zabraný.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    form_data.password = auth.get_password_hash(form_data.password)  
    return crud.create_user(db, form_data)

@app.post("/addquestion")
async def create_question(form_data: schemas.QuestionCreate, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    return crud.create_question(db, form_data)

@app.post("/addanswer")
async def create_answer(form_data: schemas.AnswerCreate, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    answer = crud.get_answer_by_question_and_user(db, form_data.question_id, form_data.user_id)
    if answer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Túto otázku ste už zodpovedali.",
        )

    return crud.create_answer(db, form_data)

@app.post("/addreaction")
async def create_reaction(form_data: schemas.ReactionCreate, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    return crud.create_reaction(db, form_data)

@app.post("/addupvote")
async def create_upvote(form_data: schemas.UpvoteCreate, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    return crud.create_upvote(db, form_data)

@app.post("/addcategory", status_code=201)
async def create_category(form_data: schemas.CategoryCreate, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    category = crud.get_category_by_name_course(db, form_data.name, form_data.course_id)
    if category:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kategória s týmto názvom už existuje.",
        )
    return crud.create_category(db, form_data)

@app.post("/addcourse")
async def create_course(form_data: schemas.CourseCreate, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
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
async def apply_to_course(form_data: schemas.UserCourseCreate, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    return crud.create_usercourse(db, form_data)    

@app.delete("/rejectusercourse")
async def reject_usercourse(form_data: schemas.UserCourseCreate, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    return crud.delete_usercourse(db, form_data.user_id, form_data.course_id)

@app.delete("/rejectcourse")
async def reject_course(form_data: schemas.UserCourseCreate, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    role = crud.get_user_role(db, user["id"])
    if role == 2:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Pre túto akciu nemáte dostatočné oprávnenie.",
        )
    if not crud.delete_usercourse(db, form_data.user_id, form_data.course_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kurz sa nepodarilo zamietnuť. Skúste to prosím znova.",
        )
    return crud.delete_course(db, form_data.course_id)

@app.put("/closequestion")
async def close_question(form_data: schemas.QuestionClose, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
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
async def update_category(form_data: schemas.CategoryUpdate, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    category = crud.get_category_by_id(db, form_data.id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kategória neexistuje.",
        )

    duplicate_category = crud.get_category_by_name_course(db, form_data.name, category.course_id)
    if duplicate_category:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kategória s týmto názvom už existuje.",
        )
    category = crud.update_category(db, category, form_data.name)
    return category

@app.put("/approvecourse")
async def approve_course(form_data: schemas.UserCourseCreate, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    role = crud.get_user_role(db, user["id"])
    if role == 2:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Pre túto akciu nemáte dostatočné oprávnenie.",
        )

    course = crud.get_course_by_id(db, form_data.course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kurz neexistuje",
        )
    
    course = crud.approve_course(db, course)

    usercourse = crud.get_usercourse_by_course_user(db, form_data.user_id, form_data.course_id)
    if not usercourse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tento kurz nemá pridaných žiadnych užívateľov.",
        )

    usercourse = crud.approve_usercourse(db, usercourse)
    db.commit()
    return course

@app.put("/approveusercourse")
async def approve_usercourse(form_data: schemas.UserCourseCreate, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    usercourse = crud.get_usercourse_by_course_user(db, form_data.user_id, form_data.course_id)
    usercourse = crud.approve_usercourse(db, usercourse)
    return usercourse

@app.put("/updateuser")
async def update_user(form_data: schemas.UserUpdate, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    new_user = crud.get_user_by_email(db, form_data.email)
    if new_user:
        if new_user.id != form_data.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email je zabraný.",
            )
    
    if form_data.password:
        form_data.password = auth.get_password_hash(form_data.password)
        form_data = form_data.dict()
    else:
        form_data = form_data.dict(exclude={'password'})
    
    new_user = crud.update_user(db, form_data)
    return new_user

@app.get("/courseswithupvotes")
async def get_courses_with_upvotes_only(db: Session = Depends(get_db)):
    return crud.get_courses_with_upvotes_only(db)

@app.get("/unapprovedcourses")
async def get_unapproved_courses(db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    role = crud.get_user_role(db, user["id"])
    if role == 2:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Pre túto akciu nemáte dostatočné oprávnenie.",
        )
    courses = crud.get_unapproved_courses(db)

    return courses

@app.get("/unapprovedusers")
async def get_unapproved_courses(db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    usercourses = crud.get_usercourses_as_teacher(db, user["id"])

    courses_ids = [usercourse.course_id for usercourse in usercourses]

    unapproved_courses = crud.get_unapproved_users(db, courses_ids)

    return unapproved_courses

@app.get("/users", response_model= List[schemas.UserWithoutPassword])
async def get_users(db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    return crud.get_users(db)

@app.get("/topusers")
async def get_top_users(db: Session = Depends(get_db)):
    return crud.get_users_with_upvotes(db)

@app.get("/topuserscourse/{course_id}")
async def get_top_users_in_course(course_id, db: Session = Depends(get_db)):
    return crud.get_users_with_upvotes_by_course(db, course_id)

@app.get("/profile/{user_id}", response_model=schemas.UserWithManagement)
async def get_profile(user_id, db: Session = Depends(get_db), user: int = Depends(check_user_is_active)):
    return crud.get_user_by_id(db, user_id)

@app.get("/courses")
async def get_courses(db: Session = Depends(get_db)):
    return crud.get_approved_courses(db)

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
    return crud.get_user_by_id(db, user_id)

@app.get("/mycoursecategories/", response_model=List[schemas.Category])
async def get_my_course_categories(course_id: Optional[List[int]] = Query(None), db: Session = Depends(get_db)):
    if course_id:
        return crud.get_categories_by_courses(db, course_id)
    return []

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