from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy




app = Flask(__name__)
app.config['SECRET_KEY'] = 'very secret key'
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:sa@localhost:5433/doc"
db = SQLAlchemy(app)
CORS(app)

