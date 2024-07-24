from flask import Blueprint, render_template


views = Blueprint('views', __name__)

@views.route('/')
def home():
    # Renderiza la plantilla "prueba.html"
    return render_template("prueba.html")