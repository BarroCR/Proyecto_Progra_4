from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, Date
from . import Base  # Make sure to import Base from your __init__.py or wherever it's defined

class User(UserMixin, Base):
    __tablename__ = 'users'  # Name of the table in your database
    idUser = Column(Integer, primary_key=True)
    nombre = Column(String)
    apellidos = Column(String)
    email = Column(String, unique=True)
    telefono = Column(String)
    contrasena = Column(String)
    fecha_nacimiento = Column(Date)
    ruta_imagen = Column(String)

    def get_id(self):
        return int(self.idUser)  # Ensure the ID is in a format that Flask-Login expects (string)