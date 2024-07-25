from flask import Blueprint, render_template , jsonify, request
from flask_login import login_user, login_required, logout_user, current_user
import time
import json
import requests

views = Blueprint('views', __name__)


def fetch_earthquakes():
        url = 'https://earthquake.usgs.gov/fdsnws/event/1/query'
        params = {
            'format': 'geojson',
            'starttime': '2024-07-24T00:00:00' ,
            'minmagnitude': 3
            
        }
        response = requests.get(url, params=params)
        try:
            response.raise_for_status()  # Check for HTTP errors
            return response.json()
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
        except requests.exceptions.RequestException as req_err:
            print(f"Request error occurred: {req_err}")
        except ValueError as json_err:
            print(f"JSON decode error occurred: {json_err}")
        return None

def save_data_to_file(data, filename='earthquake_data.json'):
    with open(filename, 'w') as file:
        json.dump(data, file)

def load_data_from_file(filename='earthquake_data.json'):
    try:
        with open(filename, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return None

def poll():
    client_state = request.args.get('state')
    
    while True:
        data = fetch_earthquakes()
        if data:
            save_data_to_file(data)  # Guarda la información en un archivo
        json_state = str(data)
        if json_state != client_state:
            return jsonify(data)
        time.sleep(5)
            
            

@views.route('/')
@login_required
def home():
    
    
    return render_template("main.html")
