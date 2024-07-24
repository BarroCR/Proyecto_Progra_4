from flask import Blueprint, render_template
from flask_login import login_user, login_required, logout_user, current_user

views = Blueprint('views', __name__)

@views.route('/')
@login_required
def home():
    # Renderiza la plantilla "prueba.html"
    return render_template("layoutIn.html")