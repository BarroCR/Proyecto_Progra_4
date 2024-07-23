from flask import Blueprint, render_template, request , flash
from werkzeug.security import generate_password_hash, check_password_hash
from . import session
from sqlalchemy import text



auth = Blueprint('auth', __name__)




@auth.route('/login', methods=['GET', 'POST'])
def signPage():
    action = request.form.get('action')  # Use .get() to avoid KeyError

    if action == 'register':
        if request.method == 'POST':
            email = request.form.get('register-email')
            password = request.form.get('register-password')
            name = request.form.get('register-name')
            lastNames = request.form.get('register-lastNames')
            tel = request.form.get('register-tel')
            confirmPass = request.form.get('register-confirmPassword')
            dateOfBirth = request.form.get('register-dateOfBirth')
            
            if password != confirmPass:
                flash('Las contraseñas no coinciden, por favor intenta de nuevo', category='error')
            else:
                password1 = generate_password_hash(password)
                
                
                sql_command = text("""
                                        EXECUTE [dbo].[InsertUser]
                                            @nombre = :nombre,
                                            @apellidos = :apellidos,
                                            @email = :email,
                                            @telefono = :telefono,
                                            @contrasena = :contrasena,
                                            @fecha_nacimiento = :fecha_nacimiento;
                                        """)
                data = {
                                "nombre": name,
                                "apellidos": lastNames,
                                "email": email,
                                "telefono": tel,
                                "contrasena": password1,
                                "fecha_nacimiento": dateOfBirth
                            }
                
                
                
                
                session.execute(sql_command, data)
                session.commit()
                
                flash('Cuenta creada', category='success')
                # Remember to add code to save the user or handle registration logic here
            
    elif action == 'login':
        if request.method == 'POST':
            loginEmail = request.form.get('login-email')
            loginPass = request.form.get('login-password')
            
            signInInfo = [loginEmail, loginPass]
            # Add code to handle login logic here

   
    
        
        
        
        
           
    return  render_template("signPage.html")