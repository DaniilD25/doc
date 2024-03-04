from flask import Blueprint, jsonify, request
from flask_cors import CORS
from app import db
from sqlalchemy import text
from documents.models import DOCModel
from account.models import UserModel
import os
import json
import threading
from werkzeug.utils import secure_filename
import re
import uuid
import io
import PyPDF2
import fitz  # PyMuPDF
from PIL import Image
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.pdfgen.canvas import Canvas
from PyPDF2 import PdfReader, PdfWriter
import datetime
documents_blueprint = Blueprint('documents_blueprint', __name__)

current_directory = os.getcwd()
project_directory = os.path.join(current_directory, 'C:\\PracticeDOC\\practiceDanya2')
file_path = os.path.join(project_directory, 'doc_data.json')
file_path_username = os.path.join(project_directory, 'username_data.json')
file_lock = threading.Lock()
PDF_DIR = 'C:\\PracticeDOC\\practiceDanya2\\flaskapp\\static\\uploads\\'

 





@documents_blueprint.route("/get-fields/")
def get_fields():

    documents = DOCModel.query.order_by(DOCModel.id_document).all()

    documents_prepared_text = []


    for document in documents:
        document_data = {
            "field_name": document.field,
        }
        print(document_data)
        documents_prepared_text.append(document_data)

   

    response_data = {
        "fields": documents_prepared_text,
    }
    return jsonify(response_data)





@documents_blueprint.route("/post-get-field/", methods=['POST', 'GET'])
def getPost_field():
    if request.method == "POST":
        data = request.get_json()

        field = data['field']
        print("FIELD", field)
        with file_lock:
            save_field_to_file(field)
        return jsonify({"message": "Область успешно отправлена"})

    if request.method == "GET":

        field_text = load_field_from_file()
        print("field_text",field_text)
        username = load_username_from_file()
        print("username",username)
        user = UserModel.query.filter_by(username = username).first()
  
        if field_text == 'all':
            documents = DOCModel.query.filter(DOCModel.invisibility == 'no' ).order_by(DOCModel.id_document).all()
        elif field_text != 'all':
            documents = DOCModel.query.filter(DOCModel.field == field_text,DOCModel.invisibility == 'no' ).order_by(DOCModel.id_document).all()
        documents_prepared_text = []

        for document in documents:
            if user.username == 'admin' or user.username == 'iss':
                    document_data = {
                            "id_document": document.id_document,
                            "id_owner": document.id_owner,
                            "name": document.name,
                            "description": document.description,
                            "field": document.field,
                            "upload_date": document.upload_date,
                            "secret_level": document.secret_level,
                            "invisibility": document.invisibility,
                    }
                    documents_prepared_text.append(document_data)
            elif user.id_user == document.id_owner:
                    print("5")
                    document_data = {
                            "id_document": document.id_document,
                            "id_owner": document.id_owner,
                            "name": document.name,
                            "description": document.description,
                            "field": document.field,
                            "upload_date": document.upload_date,
                            "secret_level": document.secret_level,
                            "invisibility": document.invisibility,
                    }
                    documents_prepared_text.append(document_data)
            elif user.access_level == "C" and user.field == document.field:
                if document.secret_level == "C" or document.secret_level == "B" or document.secret_level == "A":
                    print("1")
                    document_data = {
                        "id_document": document.id_document,
                        "id_owner": document.id_owner,
                        "name": document.name,
                        "description": document.description,
                        "field": document.field,
                        "upload_date": document.upload_date,
                        "secret_level": document.secret_level,
                        "invisibility": document.invisibility,
                    }
                    documents_prepared_text.append(document_data)
            elif user.access_level == None:
                print("2")
                if document.secret_level == "A":
                    document_data = {
                    "id_document": document.id_document,
                    "id_owner": document.id_owner,
                    "name": document.name,
                    "description": document.description,
                    "field": document.field,
                    "upload_date": document.upload_date,
                    "secret_level": document.secret_level,
                    "invisibility": document.invisibility,
                    }
                    documents_prepared_text.append(document_data)
            elif user.access_level == "D" and user.field == document.field:
                    print("3")
                    if document.secret_level == "D" or document.secret_level == "C" or document.secret_level == "B" or document.secret_level == "A":
                        document_data = {
                            "id_document": document.id_document,
                            "id_owner": document.id_owner,
                            "name": document.name,
                            "description": document.description,
                            "field": document.field,
                            "upload_date": document.upload_date,
                            "secret_level": document.secret_level,
                            "invisibility": document.invisibility,
                        }
                        documents_prepared_text.append(document_data)
            elif (user.access_level == "C" or user.access_level == "D" or user.access_level == "B")  and user.field != document.field:
                    print("4")
                    if document.secret_level == "B" or document.secret_level == "A":
                        document_data = {
                            "id_document": document.id_document,
                            "id_owner": document.id_owner,
                            "name": document.name,
                            "description": document.description,
                            "field": document.field,
                            "upload_date": document.upload_date,
                            "secret_level": document.secret_level,
                            "invisibility": document.invisibility,
                        }
                        documents_prepared_text.append(document_data)
            
            
        response = jsonify({"field_one": documents_prepared_text})
        return response


def save_field_to_file(data):
    with open(file_path, 'w') as file:
        json.dump(data, file)

def load_field_from_file():
    try:
        with open(file_path, 'r') as file:
            # Проверка на пустоту файла перед декодированием
            file_content = file.read()
            if not file_content:
                return []  # Возвращаем пустой список, если файл пуст

            data = json.loads(file_content)
        return data
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []  # Возвращаем пустой список, если произошла ошибка декодирования JSON


def load_username_from_file():
    try:
        with open(file_path_username, 'r') as file:
            # Проверка на пустоту файла перед декодированием
            file_content = file.read()
            if not file_content:
                return []  # Возвращаем пустой список, если файл пуст

            data = json.loads(file_content)
        return data
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []  # Возвращаем пустой список, если произошла ошибка декодирования JSON







@documents_blueprint.route("/post-get-document/", methods=['POST', 'GET'])
def getPost_document():
    if request.method == "POST":
        data = request.get_json()

        id_document = data['id_document']
        with file_lock:
            save_document_to_file(id_document)
        return jsonify({"message": "Область успешно отправлена"})

    if request.method == "GET":
        document_text = load_document_from_file()
        documents = DOCModel.query.filter_by(id_document=document_text).first()
        owner = UserModel.query.filter_by(id_user=documents.id_owner).first()
        document_data = {
            "id_document": documents.id_document,
            "id_owner": documents.id_owner,
            "name": documents.name,
            "description": documents.description,
            "field": documents.field,
            "upload_date": documents.upload_date,
            "secret_level": documents.secret_level,
            "invisibility": documents.invisibility,
            "owner": owner.username,
        }
        username = load_username_from_file()
        user= UserModel.query.filter_by(username = username).first()
        document_filename = documents.filename
        pdf_path_owner = os.path.join(PDF_DIR, document_filename)
        pdf_path_user = os.path.join(PDF_DIR, documents.filename_copy)
        pdf_info = {}
        

        if os.path.isfile(pdf_path_owner) and pdf_path_owner.endswith('.pdf') and documents.id_owner == user.id_user:
            pdf_info = {'pdf_filename': document_filename}
        elif os.path.isfile(pdf_path_owner) and pdf_path_owner.endswith('.pdf') and (user.username == 'iss' or user.username == 'admin' ):
            pdf_info = {'pdf_filename': document_filename}
        elif os.path.isfile(pdf_path_user) and pdf_path_user.endswith('.pdf') and documents.id_owner != user.id_user:
            pdf_info = {'pdf_filename': documents.filename_copy}
        print("PDF", pdf_info)
        response_data = {
        "document_one": document_data,
        "pdf": pdf_info,
        }
        return jsonify(response_data)



def save_document_to_file(data):
    with open(file_path, 'w') as file:
        json.dump(data, file)

def load_document_from_file():
    try:
        with open(file_path, 'r') as file:
            # Проверка на пустоту файла перед декодированием
            file_content = file.read()
            if not file_content:
                return []  # Возвращаем пустой список, если файл пуст

            data = json.loads(file_content)
        return data
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []  # Возвращаем пустой список, если произошла ошибка декодирования JSON



@documents_blueprint.route("/get-my-documents/")
def get_my_documents():

    username = load_username_from_file()
    owner = UserModel.query.filter_by(username=username).first()
    documents = DOCModel.query.filter_by(id_owner=owner.id_user).all()

    documents_prepared_text = []


    for document in documents:
        document_data = {
            "id_document": document.id_document,
            "id_owner": document.id_owner,
            "name": document.name,
            "description": document.description,
            "field": document.field,
            "upload_date": document.upload_date,
            "secret_level": document.secret_level,
            "invisibility": document.invisibility,
            "owner": owner.username,
        }
        documents_prepared_text.append(document_data)

   

    response_data = {
        "my_documents": documents_prepared_text,
    }
    return jsonify(response_data)



@documents_blueprint.route("/delete-document/", methods=['POST'])
def delete_document():
    if request.method == "POST":
        data = request.get_json()

        id_document = data['id_document']

        document_to_delete = DOCModel.query.get(id_document)

        if document_to_delete:
            db.session.delete(document_to_delete)
            db.session.commit()
            return jsonify({"deleted": True})
        else:
            return jsonify({"deleted": False, "error": "Document not found"})



@documents_blueprint.route("/post-invisibility/", methods=['POST'])
def post_invisibility():
    if request.method == "POST":
        data = request.get_json()

        id_document = data['id_document']
        invisibility = data['invisibility']
        invisibility_2 = ""
        print('INV', invisibility)
        document_to_update_invisibility = DOCModel.query.get(id_document)
        if invisibility == True:
            invisibility_2 = 'yes'
        elif invisibility == False:
            invisibility_2 = "no"
        if document_to_update_invisibility:
            print("INV 2", invisibility_2)
            print("Name INV", document_to_update_invisibility.name)
            document_to_update_invisibility.invisibility = invisibility_2
            db.session.commit()
            return jsonify({"deleted": True})
        else:
            return jsonify({"deleted": False, "error": "Document not found"})



 

 
@documents_blueprint.route("/create-document/", methods=['POST'])
def create_document():
    filename2 = None
    if request.method == "POST":
        secret_level = request.form.get('secret_level')
        secret_level_test = request.form.get('secret_level_test')
        print('SECRET LEVEL',request.form.get('secret_level') )
        print('SECRET LEVEL TEST',request.form.get('secret_level_test'))
        docname = request.form.get('name')
        field = request.form.get('field')
        description = request.form.get('description')
        pdf_file = request.files.get('pdf')
        password = request.form.get('password')
        username = load_username_from_file()
        owner = UserModel.query.filter_by(username=username).first()

        secret_level_final = ""
        if secret_level != "":
            secret_level_final = secret_level
        elif secret_level_test != "":
            secret_level_final = secret_level_test
        
        print('SECRET LEVEL FINAL',secret_level_final)
        if pdf_file:
                original_filename = secure_filename(pdf_file.filename)
                filename_lower = original_filename.lower()
                filename_cleaned = re.sub(r"[^a-zA-Z0-9_.-]", "_", filename_lower)
                file_extension = os.path.splitext(filename_cleaned)[1]

                # Генерация уникального идентификатора
                unique_identifier = str(uuid.uuid4().hex)[:6]

                filename2 = os.path.splitext(filename_cleaned)[0] + "_" + unique_identifier + file_extension
                filename_templ = os.path.splitext(filename_cleaned)[0] + "_" + unique_identifier +"_templ"+ file_extension
                filename_copy = os.path.splitext(filename_cleaned)[0] + "_" + unique_identifier +"_copy"+ file_extension
                pdf_folder_path = 'C:\\PracticeDOC\\practiceDanya2\\flaskapp\\static\\uploads'
                os.makedirs(pdf_folder_path, exist_ok=True)
                pdf_file.save(os.path.join(pdf_folder_path, filename2))
                pdf_file.save(os.path.join(pdf_folder_path, filename_templ))
                pdf_file.save(os.path.join(pdf_folder_path, filename_copy))
                pdf_to_images_with_text_as_images(f'C:\\PracticeDOC\\practiceDanya2\\flaskapp\\static\\uploads\\{filename2}', f'C:\\PracticeDOC\\practiceDanya2\\flaskapp\\static\\uploads\\{filename_templ}', 
                                                  f'C:\\PracticeDOC\\practiceDanya2\\flaskapp\\static\\uploads\\{filename_copy}', password)
                current_date = datetime.date.today()
                formatted_date = current_date.strftime('%Y-%m-%d')
                new_document = DOCModel(
                    id_owner=owner.id_user,
                    name=capitalize_first_word(docname),
                    invisibility='yes',
                    field=capitalize_first_word(field),
                    description=capitalize_first_word(description),
                    upload_date=formatted_date,
                    secret_level=capitalize_first_word(secret_level_final),
                    filename=filename2,
                    filename_copy=filename_copy
                )
                db.session.add(new_document)
                db.session.commit()
                return jsonify({"updated": True})



















@documents_blueprint.route("/update-document/", methods=['POST'])
def update_document():

    filename2 = None
    if request.method == "POST":
        id_document = request.form.get('id_document')
        secret_level = request.form.get('secret_level')
        docname = request.form.get('name')
        field = request.form.get('field')
        description = request.form.get('description')
        pdf_file = request.files.get('pdf')
        password = request.form.get('password')
        print("pdf FIle", pdf_file)
        document_to_update = DOCModel.query.get(id_document)

        if document_to_update:
            document_to_update.secret_level = capitalize_first_word(secret_level)
            document_to_update.name = capitalize_first_word(docname)
            document_to_update.field = capitalize_first_word(field)
            document_to_update.description = capitalize_first_word(description)
            
            if pdf_file:
                original_filename = secure_filename(pdf_file.filename)
                filename_lower = original_filename.lower()
                filename_cleaned = re.sub(r"[^a-zA-Z0-9_.-]", "_", filename_lower)
                file_extension = os.path.splitext(filename_cleaned)[1]

                # Генерация уникального идентификатора
                unique_identifier = str(uuid.uuid4().hex)[:6]

                filename2 = os.path.splitext(filename_cleaned)[0] + "_" + unique_identifier + file_extension
                filename_templ = os.path.splitext(filename_cleaned)[0] + "_" + unique_identifier +"_templ"+ file_extension
                filename_copy = os.path.splitext(filename_cleaned)[0] + "_" + unique_identifier +"_copy"+ file_extension
                pdf_folder_path = 'C:\\PracticeDOC\\practiceDanya2\\flaskapp\\static\\uploads'
                os.makedirs(pdf_folder_path, exist_ok=True)
                pdf_file.save(os.path.join(pdf_folder_path, filename2))
                pdf_file.save(os.path.join(pdf_folder_path, filename_templ))
                pdf_file.save(os.path.join(pdf_folder_path, filename_copy))
                print("FILENAME1",document_to_update.filename)
                print("FILENAME2",filename2)
                document_to_update.filename = filename2
                pdf_to_images_with_text_as_images(f'C:\\PracticeDOC\\practiceDanya2\\flaskapp\\static\\uploads\\{filename2}',
                                                   f'C:\\PracticeDOC\\practiceDanya2\\flaskapp\\static\\uploads\\{filename_templ}', 
                                                   f'C:\\PracticeDOC\\practiceDanya2\\flaskapp\\static\\uploads\\{filename_copy}', password)
                document_to_update.filename_copy = filename_copy
            db.session.commit()

            updated_data = {
                "id_document": id_document,
                "filename": filename2,
                "secret_level": secret_level
            }
            return jsonify({"updated": updated_data})
        else:
            return jsonify({"updated": False, "error": "Document not found"})










def capitalize_first_word(sentence):
    # Разбиваем предложение на слова
    words = sentence.split()
    # Преобразуем первое слово к верхнему регистру, если оно существует
    if words:
        words[0] = words[0].capitalize()
    # Возвращаем объединенную строку
    return ' '.join(words)

def create_watermark(watermark_text="COPY", position=(-320, 450), size=180, color=(255, 0, 0), alpha=0.2,
                     angle=-45):
    # Создаем объект Canvas в памяти
    packet = io.BytesIO()
    can = Canvas(packet, pagesize=letter)

    # Устанавливаем параметры стиля водяного знака
    can.setFont("Helvetica", size)
    can.setFillAlpha(alpha)
    can.setFillColorRGB(*color)

    # Поворачиваем водяной знак
    can.rotate(angle)

    # Устанавливаем положение водяного знака
    can.drawString(*position, watermark_text)

    can.save()

    # Перемещаем указатель файла в начало и создаем объект PdfReader из водяного знака в памяти
    packet.seek(0)
    watermark_reader = PdfReader(packet)

    return watermark_reader.pages[0]

def add_watermark(input_pdf, output_pdf):
        # Создаем объекты PdfReader и PdfWriter
        reader = PdfReader(input_pdf)
        writer = PdfWriter()

        # Создаем водяной знак
        watermark = create_watermark()

        # Для каждой страницы в PDF добавляем водяной знак
        for page in reader.pages:
            page.merge_page(watermark)

        # Записываем измененные страницы в выходной PDF
        for page in reader.pages:
            writer.add_page(page)
        with open(output_pdf, 'wb') as output_file:
            writer.write(output_file)


def pdf_to_images_with_text_as_images(pdf_file, output_pdf_file, output_pdf_file_final, password):
    add_watermark(pdf_file, output_pdf_file)
    c = canvas.Canvas(output_pdf_file_final, pagesize=letter)
    pdf_document = fitz.open(output_pdf_file)
    
    for page_number in range(len(pdf_document)):
        page = pdf_document.load_page(page_number)
        image = page.get_pixmap()
        img = Image.frombytes("RGB", [image.width, image.height], image.samples)
        temp_image_path = f"temp_page_{page_number + 1}.png"
        img.save(temp_image_path)
        c.drawImage(temp_image_path, 0, 0, width=letter[0], height=letter[1])
        c.showPage()
        os.remove(temp_image_path)
    
    pdf_document.close()
    c.save()
    if os.path.exists(output_pdf_file):
        os.remove(output_pdf_file)

    if password != None:
        encrypt_pdf(output_pdf_file_final, password)

def encrypt_pdf(pdf_path, password):
    with open(pdf_path, 'rb') as f:
        reader = PdfReader(f)
        writer = PdfWriter()

        for i in range(len(reader.pages)):
            writer.add_page(reader.pages[i])

        writer.encrypt(password)

        with open(pdf_path, 'wb') as encrypted_file:
            writer.write(encrypted_file)
