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
    earthquakes = []  # Create an empty list to store earthquake data
    
    while True:
        data = fetch_earthquakes()
        #print(data)
        if data:
            save_data_to_file(data)  # Guarda la información en un archivo
            
            # Obtener la información de los terremotos
            for feature in data['features']:
                mag = feature['properties']['mag']
                place = feature['properties']['place']
                time = feature['properties']['time']
                longitude = feature['geometry']['coordinates'][0]
                latitude = feature['geometry']['coordinates'][1]
                
                earthquake = {
                    'mag': mag,
                    'place': place,
                    'time': time,
                    'longitude': longitude,
                    'latitude': latitude
                }
                
                # Append the earthquake dictionary to the list
                earthquakes.append(earthquake)
                print(earthquakes)
                
        json_state = str(data)
        if json_state != client_state:
            return jsonify(earthquakes)
        time.sleep(5)
            
            

@views.route('/')
@login_required
def home():
    
    poll()
    return render_template("main.html")

@views.route('/logs', methods=['GET']) 
@login_required
def logs():

    poll()
    return render_template("logs.html")


@views.route('/news') 
@login_required
def news():
    return render_template("news.html")

@views.route('/about') 
@login_required
def about():
    return render_template("about.html")
