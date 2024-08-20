from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from . import session
from sqlalchemy import text
from flask_login import login_user, login_required, logout_user, current_user
from .models import User
import json
from werkzeug.utils import secure_filename
import os


# Crear un objeto Blueprint llamado 'auth'
auth = Blueprint('auth', __name__)

# Ruta para la página de inicio de sesión y registro
@auth.route('/login', methods=['GET', 'POST'])
def signPage():
    action = request.form.get('action')  # Obtener el valor del campo 'action' del formulario

    if action == 'register':  # Si el valor de 'action' es 'register'
        if request.method == 'POST':  # Si la solicitud es un POST
            # Obtener los datos del formulario de registro
            email = request.form.get('register-email')
            password = request.form.get('register-password')
            name = request.form.get('register-name')
            lastNames = request.form.get('register-lastNames')
            tel = request.form.get('register-tel')
            confirmPass = request.form.get('register-confirmPassword')
            dateOfBirth = request.form.get('register-dateOfBirth')
            
            
            
            if password != confirmPass:  # Si las contraseñas no coinciden
                flash('Las contraseñas no coinciden, por favor intenta de nuevo', category='error')
            else:
                password1 = generate_password_hash(password)  # Generar un hash de la contraseña
                
                # Comando SQL para insertar un nuevo usuario en la base de datos
                sql_command = text("""
                    EXECUTE [dbo].[sp_registrarusuario]
                    @nombre = :nombre,
                    @apellidos = :apellidos,
                    @email = :email,
                    @telefono = :telefono,
                    @contrasena = :contrasena,
                    @fecha_nacimiento = :fecha_nacimiento;
                """)
                
                # Datos del usuario a insertar
                user = {
                    "nombre": name,
                    "apellidos": lastNames,
                    "email": email,
                    "telefono": tel,
                    "contrasena": password1,
                    "fecha_nacimiento": dateOfBirth
                }
                
                session.execute(sql_command, user)  # Ejecutar el comando SQL con los datos del usuario
                session.commit()  # Confirmar los cambios en la base de datos
                
                flash('Cuenta creada', category='success')  # Mostrar un mensaje de éxito
                
                return render_template("signPage.html")  # Redirigir a la página de inicio de sesión y registro
            
    elif action == 'login':  # Si el valor de 'action' es 'login'
        if request.method == 'POST':  # Si la solicitud es un POST
            # Obtener los datos del formulario de inicio de sesión
            loginEmail = request.form.get('login-email')
            loginPass = request.form.get('login-password')
            
            sql_command = text("""
                SELECT contrasena FROM users WHERE email = :email
            """)
            
            
            # Comando SQL para obtener el usuario por correo electrónico
            
            user = session.query(User).filter_by(email=loginEmail).first()
            
            if user:  # Si se encontró el usuario
                stored_password = user.contrasena  # Obtener la contraseña almacenada
                if check_password_hash(stored_password, loginPass):  # Verificar la contraseña

                    sql_command = text("""
                        EXEC sp_InsertarHistorial @idUser=:idUser, @estado=1;
                    """)
                    session.execute(sql_command, {'idUser': user.idUser})
                    session.commit()

                    flash('Inicio de sesion exitoso!', category='success')
                    login_user(user, remember=True)
                    return redirect(url_for('views.home'))  # Redirigir a la página principal
                else:
                    flash('Contraseña Incorrecta, Intenta de nuevo.', category='error')
            else:
                flash('Email inexistente.', category='error')

    return render_template("signPage.html")  # Renderizar la plantilla de la página de inicio de sesión y registro


@auth.route('/logout')
@login_required
def logout():
    sql_command = text("""
        EXEC sp_InsertarHistorial @idUser=:idUser, @estado=0;
    """)
    session.execute(sql_command, {'idUser': current_user.idUser})
    session.commit()
    logout_user()
    
    return redirect(url_for('auth.signPage'))  # Redirigir a la página de inicio de sesión y registro

def load_earthquake_data():
    with open('earthquake_data.json', 'r') as file:
        data = json.load(file)
    return data

@auth.route('/poll', methods=['GET'])
def poll():
    data = load_earthquake_data()
    earthquakes = []
    for feature in data['features']:
        properties = feature['properties']
        geometry = feature['geometry']
        earthquake = {
            'magnitude': properties['mag'],
            'place': properties['place'],
            'time': properties['time'],
            'longitude': geometry['coordinates'][0],
            'latitude': geometry['coordinates'][1]
        }
        earthquakes.append(earthquake)
    return jsonify(earthquakes)

@auth.route('/updateUser/<int:id_user>', methods=['PUT'])
@login_required
def updateUser(id_user):
    data = request.get_json()
    update_name = data.get('update_name')
    update_lastName = data.get('update_lastName')
    update_password = data.get('update_password')
    update_date = data.get('update_date')

    try:
        hashed_password = generate_password_hash(update_password)

        sql_command = text("""
            EXEC [dbo].[sp_update_user_data]
                @id_user = :id_user,
                @nombre = :nombre,
                @apellidos = :apellidos,
                @contrasena = :contrasena,
                @fecha_nacimiento = :fecha_nacimiento;
        """)

        user_data = {
            "id_user": id_user,
            "nombre": update_name,
            "apellidos": update_lastName,
            "contrasena": hashed_password,
            "fecha_nacimiento": update_date
        }

        session.execute(sql_command, user_data)  
        session.commit()  
        return jsonify({'success': True}), 200
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500


@auth.route('/upload_profile_pic', methods=['POST'])
@login_required
def upload_profile_pic():
    if 'profile_photo' not in request.files:
        return jsonify({'success': False, 'error': 'No se ha seleccionado un archivo'}), 400

    file = request.files['profile_photo']

    if file.filename == '':
        return jsonify({'success': False, 'error': 'No se ha seleccionado un archivo'}), 400

    if file:
        filename = secure_filename(file.filename)
        # Especificar directamente la ruta del directorio de subida
        upload_folder = os.path.join(os.getcwd(), 'backend/static/uploads')
        
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        
        # Guardar la ruta en la base de datos
        current_user.ruta_imagen = f'static/uploads/{filename}'
        session.commit()
        
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        # Generar la URL para acceder al archivo subido
        file_url = url_for('static', filename=f'uploads/{filename}')

        return jsonify({'success': True, 'filepath': file_url}), 200