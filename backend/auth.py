from flask import Blueprint, render_template, request, flash, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from . import session
from sqlalchemy import text
from flask_login import login_user, login_required, logout_user, current_user
from .models import User

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
                    EXECUTE [dbo].[InsertUser]
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
    logout_user()
    
    return redirect(url_for('auth.signPage'))  # Redirigir a la página de inicio de sesión y registro