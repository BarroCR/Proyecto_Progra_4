from flask import Blueprint, render_template , jsonify, request
from flask_login import login_user, login_required, logout_user, current_user
import time
import json
import requests

views = Blueprint('views', __name__)


def fetch_earthquakes(magnitude, startDate):
        url = 'https://earthquake.usgs.gov/fdsnws/event/1/query'
        print(startDate, magnitude)
        if startDate is None:
            startDate = '2024-08-18'  # Valor predeterminado para startDate

        if magnitude is None:
            magnitude = 3  # Valor predeterminado para magnitude
        
        params = {
            'format': 'geojson',
            'starttime': startDate+'T00:00:00' ,
            'minmagnitude': magnitude
            
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

def poll(magnitude, startDate):
    client_state = request.args.get('state')
    earthquakes = []  # Create an empty list to store earthquake data
    
    while True:
        data = fetch_earthquakes(magnitude, startDate )  # Fetch earthquake data
        
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
                
                
        json_state = str(data)
        if json_state != client_state:
            return jsonify(earthquakes)
        time.sleep(5)
            
            

@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    magnitude = None
    startDate = None
    if request.method == 'POST':
        magnitude = request.form.get('mag-select')
        startDate = request.form.get('sismo-date')
        
    print(magnitude,startDate)
    poll(magnitude,startDate )
    return render_template("main.html")

@views.route('/logs', methods=['GET']) 
@login_required
def logs():
    magnitude = 4
    startDate = '2024-08-18'
    poll(magnitude, startDate)
    return render_template("logs.html")


@views.route('/news') 
@login_required
def news():
    return render_template("news.html")

@views.route('/about') 
@login_required
def about():
    return render_template("about.html")