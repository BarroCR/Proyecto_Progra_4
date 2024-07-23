from flask import Blueprint, render_template


auth = Blueprint('auth', __name__)

@auth.route('/login')
def login():
    return render_template("signPage.html")

@auth.route('/logout')
def logout():
    return "<p>Logout</p>"

@auth.route('/signUp')
def signUp():
    return "<p>Sign Up</p>"