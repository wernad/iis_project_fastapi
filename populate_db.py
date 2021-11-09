from datetime import datetime
import json

from sqlalchemy.orm.base import manager_of_class

import models
from database import SessionLocal, engine

db = SessionLocal()

models.Base.metadata.create_all(bind=engine)

with open("db_data.json",'r',encoding = 'utf-8') as file:
    file = json.load(file)

for user in file['users']:
    new_user = models.User(
        first_name = user['first_name'],
        last_name = user['last_name'],
        email = user['email'],
        year = user['year'],
        program = user['program'],
        management_level = user['management_level']
    )
    db.add(new_user)

for course in file['courses']:
    new_course = models.Course(
        name = course['name'],
        approved = course['approved']
    )
    db.add(new_course)

for category in file['categories']:
    new_category = models.Category(
        name = category['name'],
        course_id = category['course_id']
    )
    db.add(new_category)

for question in file['questions']:
    new_question = models.Question(
        title = question['title'],
        description = question['description'],
        is_open = question['is_open'],
        date = question['date'],
        category_id = question['category_id'],
        course_id = question['course_id'],
        user_id = question['user_id']
    )
    db.add(new_question)

for answer in file['answers']:
    new_answer = models.Answer(
        description = answer['description'],
        date = answer['date'],
        question_id = answer['question_id'],
        user_id = answer['user_id'],
    )
    db.add(new_answer)

for reaction in file['reactions']:
    new_reaction = models.Answer(
        description = reaction['description'],
        date = reaction['date'],
        answer_id = reaction['answer_id'],
        user_id = reaction['user_id']
    )
    db.add(new_reaction)

for upvote in file['upvotes']:
    new_upvote = models.Upvote(
        answer_id = upvote['answer_id'],
        user_id = upvote['user_id']
    )
    db.add(new_upvote)

for userCourse in file['userCourse']:
    new_userCourse = models.UserCourse(
        user_id = userCourse['user_id'],
        course_id = userCourse['course_id'],
        is_teacher = userCourse['is_teacher']
    )
    db.add(new_userCourse)

db.commit()
db.close()