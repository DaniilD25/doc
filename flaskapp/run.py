from app import app 

from account.account_blueprint import account_blueprint
from documents.document_blueprint import documents_blueprint

app.register_blueprint(account_blueprint, url_prefix="/account")
app.register_blueprint(documents_blueprint, url_prefix="/documents")


if __name__ == "__main__":
    app.run(debug=True)