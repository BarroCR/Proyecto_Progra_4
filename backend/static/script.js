//Script para cambiar de tema en la página web
document.addEventListener('DOMContentLoaded', function () {
    const themeButtons = document.querySelectorAll('.dropdown-item[data-theme]');
    const themeLink = document.getElementById('theme-link');
    themeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const theme = this.getAttribute('data-theme');
            if (theme === 'light') {
                themeLink.href = 'https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/lux/bootstrap.min.css';
                document.body.removeAttribute('data-bs-theme');
            } else if (theme === 'dark') {
                themeLink.href = 'https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/lux/bootstrap.min.css';
                document.body.setAttribute('data-bs-theme', 'dark');;
            }
        });
    });
});


var map = L.map('map').setView([9.934739, -84.087502], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);


async function fetchEarthquakeData() {
    try {
        const response = await fetch('http://127.0.0.1:5000/poll');
                        
        if (!response.ok) {
            if (response.status === 404) {
                console.error('Endpoint not found: 404 error');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            } else {
                const data = await response.json();
                console.log(data);
                updateTable(data);
            }
    } catch (error) {
        console.error('Error fetching earthquake data:', error);
    }
}
        
function updateTable(data) {
    const tableBody = document.querySelector('.News tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de actualizar
        
    data.forEach(earthquake => {
        const row = document.createElement('tr');
        
        const magnitudeCell = document.createElement('td');
        magnitudeCell.textContent = earthquake.magnitude;
        row.appendChild(magnitudeCell);
        
        const placeCell = document.createElement('td');
        placeCell.textContent = earthquake.place;
        row.appendChild(placeCell);
        
        const timeCell = document.createElement('td');
        const date = new Date(earthquake.time);
        timeCell.textContent = date.toLocaleString();
        row.appendChild(timeCell);
        
        const longitudeCell = document.createElement('td');
        longitudeCell.textContent = earthquake.longitude;
        row.appendChild(longitudeCell);
        
        const latitudeCell = document.createElement('td');
        latitudeCell.textContent = earthquake.latitude;
        row.appendChild(latitudeCell);
        
        tableBody.appendChild(row);

        L.marker([earthquake.latitude, earthquake.longitude]).addTo(map)
        .bindPopup('Terremoto de magnitud ' + earthquake.magnitude + ' en ' + earthquake.place + ' el ' + date.toLocaleString())
        .openPopup();
    });
}
        
document.addEventListener('DOMContentLoaded', fetchEarthquakeData);

