from flask_login import UserMixin
from sqlalchemy import Column, Integer, ForeignKey, CheckConstraint, DateTime, Text, String, Date
from sqlalchemy.ext.declarative import declarative_base
from . import Base  # Make sure to import Base from your __init__.py or wherever it's defined
import datetime
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
    
    
    

class Noticia(Base):
        __tablename__ = 'Noticia'
        idNoticia = Column(Integer, primary_key=True)
        idUser = Column(Integer, ForeignKey('users.idUser'), nullable=False)
        estadoNoticia = Column(Integer, CheckConstraint('estadoNoticia IN (0, 1)'), nullable=False)
        Hora_Fecha_Noticia = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
        Parent = Column(Integer, CheckConstraint('Parent IN (0, 1)'), nullable=False)
        Content = Column(Text, nullable=False)