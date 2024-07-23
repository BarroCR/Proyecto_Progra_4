from flask import Flask
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

database = 'Proyecto_Progra_4'
username = 'sqlserver'
password = 'contraseña'
server = '34.42.116.250'  # Replace with your actual server address

# Connection string for pymssql
connection_string = f'mssql+pymssql://{username}:{password}@{server}/{database}'

engine = create_engine(connection_string)

Base = declarative_base()

Session = sessionmaker(bind=engine)
session = Session()

try:
    connection = engine.connect()
    print('Conexión exitosa')
except Exception as e:
    print(f'Conexión fallida: {e}')








def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'jhfoaudshfoiajisdf'
    from .views import views
    from .auth import auth
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    return app