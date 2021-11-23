from datetime import datetime
import json

from sqlalchemy.orm.base import manager_of_class

import models
from database import SessionLocal, engine
from authentication import get_password_hash

db = SessionLocal()
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

with open("db_data.json",'r',encoding = 'utf8') as file:
    file = json.load(file)

for user in file['users']:
    new_user = models.User(
        first_name = user['first_name'],
        last_name = user['last_name'],
        email = user['email'],
        password= get_password_hash(user['password']),
        management_level = user['management_level'],
        active = user['active']
    )
    db.add(new_user)

db.commit()

for course in file['courses']:
    new_course = models.Course(
        name = course['name'],
        is_approved = course['is_approved']
    )
    db.add(new_course)

db.commit()

for category in file['categories']:
    new_category = models.Category(
        name = category['name'],
        course_id = category['course_id']
    )
    db.add(new_category)

db.commit()

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

db.commit()

for answer in file['answers']:
    new_answer = models.Answer(
        description = answer['description'],
        date = answer['date'],
        is_correct = answer['is_correct'],
        question_id = answer['question_id'],
        user_id = answer['user_id'],
    )
    db.add(new_answer)

db.commit()

for reaction in file['reactions']:
    new_reaction = models.Reaction(
        description = reaction['description'],
        date = reaction['date'],
        answer_id = reaction['answer_id'],
        user_id = reaction['user_id']
    )
    db.add(new_reaction)

db.commit()

for upvote in file['upvotes']:
    new_upvote = models.Upvote(
        answer_id = upvote['answer_id'],
        user_id = upvote['user_id']
    )
    db.add(new_upvote)

db.commit()

for userCourse in file['userCourses']:
    new_userCourse = models.UserCourse(
        user_id = userCourse['user_id'],
        course_id = userCourse['course_id'],
        is_teacher = userCourse['is_teacher'],
        is_approved = userCourse['is_approved']
    )
    db.add(new_userCourse)

db.commit()

db.close()

print('Database was populated succesfuly.')