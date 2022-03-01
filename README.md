# Management system for school forum.

## Used technologies:
- Python 3.8
- pip 21.1.2
- MySQL Server 8.0.27
- Node.js 14.0.0
- npm 5.6

## Fastapi Backend
 - Install requirements: `pip install -r requirements.txt`
 - Run server: `uvicorn main:app --reload`
 - Fastapi server requires an already running MySQL server!
 - If server is successfully running, we can populate database via script: `python populate_db.py`

## React Frontend 
 - Install npm libraries: `npm install`
 - Run server: `npm start`

Note: Both servers run on localhost. 
 - Fastapi `port 8000`
 - React `port 3000`
