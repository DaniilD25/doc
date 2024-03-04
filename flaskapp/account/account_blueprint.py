from flask import Blueprint,jsonify,request
from flask_cors import cross_origin
from app import db 
from account.models import UserModel
import secrets
import pyotp
import qrcode
from flask import Flask, send_file, render_template_string
import io
import os
import base64
import json
import threading


account_blueprint = Blueprint('account_blueprint', __name__)
current_directory = os.getcwd()
project_directory = os.path.join(current_directory, 'C:\\PracticeDOC\\practiceDanya2')
file_path = os.path.join(project_directory, 'username_data.json')
file_lock = threading.Lock()

@account_blueprint.route("/login/", methods=["POST"])
def login_user():
    userFound = False
    adminFound = False
    issFound = False
    if request.method == "POST":
        
        data = request.get_json()
        print("DATA", data['username'], " ", data['password'])
        user = UserModel.query.filter_by(username=data['username'], password=data['password']).first()
        if user and user.username == 'admin' and user.password == 'admin' and user.secret_key is None:
            adminFound = True
            print("adminFound2FA")
            return jsonify({"adminFound2FA": adminFound})
        elif user and user.username == 'admin' and user.password == 'admin' and user.secret_key is not None:
            adminFound = True
            print("adminFoundOTP")
            return jsonify({"adminFoundOTP": adminFound})
        elif user and user.username == 'iss' and user.password == 'iss' and user.secret_key is None:
            issFound = True
            print("issFound2FA")
            return jsonify({"issFound2FA": issFound})
        elif user and user.username == 'iss' and user.password == 'iss' and user.secret_key is not None:
            issFound = True
            print("issFoundOTP")
            return jsonify({"issFoundOTP": issFound})
        else:
            if user:
                print(data['username'], data['password'])
                if user.access_level not in {'C', 'c', 'D', 'd'}:
                    userFound = True
                    with file_lock:
                        save_username_to_file(data['username'])
                    print("userFoundNot2FA")
                    return jsonify({"userFoundNot2FA": userFound})
                
                elif user.access_level in {'C', 'c', 'D', 'd'} and user.secret_key is None:
                    userFound = True
                    print("userFound2FA")
                    return jsonify({"userFound2FA": userFound})
                elif user.access_level in {'C', 'c', 'D', 'd'} and user.secret_key is not None:
                    userFound = True
                    print("userFoundOTP")
                    return jsonify({"userFoundOTP": userFound})  # Добавлено возвращение информации о наличии секретного ключа
            print("User not found or incorrect credentials")
            return jsonify({"error": "Неверные учетные данные"})


@account_blueprint.route("/createQR/", methods=["POST"])
def createQR_user():
    if request.method == "POST":
        data = request.get_json()

        user = UserModel.query.filter_by(username=data['username'], password=data['password']).first()
        print(data['username'], data['password'])
        secret_key = secrets.token_bytes(10)
        secret_key2 = base64.b32encode(secret_key).decode('utf-8')
        uri = pyotp.totp.TOTP(secret_key2).provisioning_uri(name = data['username'], issuer_name='DOC')



        user.secret_key = secret_key2
        db.session.commit()
        qrcode.make(uri).save("totp.png")
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(uri)
        qr.make(fit=True)
            
        # Создание изображения QR-кода в памяти
        img = qr.make_image(fill='black', back_color='white')

        # Преобразование изображения в строку в формате Base64
        buffered = io.BytesIO()
        img.save(buffered)  # Убран аргумент format
        qr_code_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    return jsonify({"QR": qr_code_base64})





@account_blueprint.route("/loginOTP/", methods=["POST"])
def login_OTP():
    if request.method == "POST":
        data = request.get_json()

        user = UserModel.query.filter_by(username=data['username']).first()  # Проверка только по имени пользователя
        if user:
            print(data['username'])
            OTP_password = data['otp']
            key = user.secret_key
            with file_lock:
                save_username_to_file(data['username'])
            print("KEY", key)

            totp = pyotp.TOTP(key)

            print("KEY2", key)
            print("OTP PASSWORD", OTP_password)

            if totp.verify(OTP_password, valid_window=2) and user.username == 'admin':
                print("YES")
                return jsonify({"PasswordCompleteAdmin": True})
            elif totp.verify(OTP_password, valid_window=2) and user.username == 'iss':
                print("YES")
                return jsonify({"PasswordCompleteISS": True})
            elif totp.verify(OTP_password, valid_window=2) and user.username != 'admin' and user.username != 'iss':
                print("YES")
                return jsonify({"PasswordComplete": True})
            else:
                print("NO")
                return jsonify({"PasswordComplete": False})

    return jsonify({"error": "Неверные учетные данные"})



def save_username_to_file(data):
    with open(file_path, 'w') as file:
        json.dump(data, file)












@account_blueprint.route("/register/", methods=["POST"])
def register_user():
    if request.method == 'POST':
        data = request.get_json()

        username = data['username']
        password = data['password']
        email = data['email']

        # Проверяем, нет ли уже пользователя с таким email или username
        existing_email_user = UserModel.query.filter_by(email=email).first()
        existing_username_user = UserModel.query.filter_by(username=username).first()

        if existing_email_user:
            return jsonify({"error": "Email already exists"})

        if existing_username_user:
            return jsonify({"error": "Username already exists"})

        new_user = UserModel(username=username, password=password, email=email)

        db.session.add(new_user)
        db.session.commit()
        
    return jsonify({"created": True})



@account_blueprint.route("/get-users/")
def get_users():

    users = UserModel.query.order_by(UserModel.id_user).all()

    users_prepared_text = []


    for user in users:
        user_data = {
            "id_user": user.id_user,
            "access_level": user.access_level,
            "username": user.username,
            "email": user.email,
            "field": user.field,
        }
        print(user_data)
        users_prepared_text.append(user_data)

   

    response_data = {
        "users": users_prepared_text,
    }
    return jsonify(response_data)




@account_blueprint.route("/update-user/", methods=["GET", "POST"])
def update_user():
    if request.method == "POST":
        data = request.get_json()
        id_user = data['id_user']
        access_level = data['access_level']
        field = data['field']

        user_to_update = UserModel.query.get(id_user)
        if user_to_update:
            user_to_update.access_level = access_level
            user_to_update.field = capitalize_first_word(field)
            db.session.commit()
            return jsonify({"updated": True})
        else:
            return jsonify({"updated": False, "error": "Match not found"})

    # Handle GET request (if needed)
    elif request.method == "GET":
        # Add GET request handling logic here
        pass



def capitalize_first_word(sentence):
    # Разбиваем предложение на слова
    words = sentence.split()
    # Преобразуем первое слово к верхнему регистру, если оно существует
    if words:
        words[0] = words[0].capitalize()
    # Возвращаем объединенную строку
    return ' '.join(words)