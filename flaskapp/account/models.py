import random
from app import db


class UserModel(db.Model):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}
    id_user = db.Column(db.Integer(), nullable=False, primary_key=True)
    access_level = db.Column(db.String(), nullable=True)
    secret_key = db.Column(db.String(), nullable=True)
    username = db.Column(db.String(), nullable=False)
    password = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), nullable=False)
    field = db.Column(db.String(), nullable=True)

    @classmethod
    def create_id(cls) -> int:
        model = cls

        """Method generates unique id according to maximum integer possible and checks for duplicates in the table.
        """

        max_int = 2147483647
        max_len = 10

        rand_int = str(random.randrange(1, max_int))

        free_units = '1' * (max_len - len(rand_int))

        # to always maintain the same length
        unique_id = int(free_units + rand_int)

        #  if a category with the same id is found, then rerun function
        if model.query.get(unique_id):
            cls.create_id(model)
        else:
            return unique_id
        return 0