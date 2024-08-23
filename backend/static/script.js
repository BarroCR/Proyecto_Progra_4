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

    var userInfoElement = document.querySelector('.user-info');
    var userNameElement = document.getElementById('user-name');
    var userName = userInfoElement.getAttribute('data-username');
    var userId = userInfoElement.getAttribute('data-id'); 
    if (userNameElement) {
        userNameElement.textContent = userName;
    }

    var updateNameInput = document.getElementById('update_name');
    var updateLastNameInput = document.getElementById('update_lastName');
    var updatePasswordInput = document.getElementById('update_password');
    var updateDateInput = document.getElementById('update_date');

    updateNameInput.value = userInfoElement.getAttribute('data-username');
    updateLastNameInput.value = userInfoElement.getAttribute('data-lastname');
    // updatePasswordInput.value = userInfoElement.getAttribute('data-password');
    updateDateInput.value = userInfoElement.getAttribute('data-birthdate');
});

let subMenu = document.getElementById('subMenu');
function toggleMenu() {
    subMenu.classList.toggle('open-menu');
}


var map = L.map('map').setView([0, 0], 2);
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

const showUpdateModal = () => {
    const modalWrp = document.querySelector(".modal-update-wrp");
    modalWrp.classList.remove("invisible");
    const success_span = document.getElementById('success_span')
    success_span.textContent = 'Resultado del cambio';
};

function closeUpdateModal() {
    const modalWrp = document.querySelector(".modal-update-wrp");
    modalWrp.classList.add("invisible");
}

function showProfilePicModal() {
    const modalWrp = document.querySelector(".modal-upload-pic-wrp");
    modalWrp.classList.remove("invisible");
}

function closeProfilePicModal() {
    const modalWrp = document.querySelector(".modal-upload-pic-wrp");
    modalWrp.classList.add("invisible");

}

document.getElementById('update-user-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const userId = form.getAttribute('data-id');
    const data = {
        update_name: document.getElementById('update_name').value,
        update_lastName: document.getElementById('update_lastName').value,
        update_password: document.getElementById('update_password').value,
        update_date: document.getElementById('update_date').value,
    };

    const success_span = document.getElementById('success_span')

    fetch(`/updateUser/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            success_span.textContent = 'Usuario actualizado con éxito';
            console.log('Usuario actualizado con éxito');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            success_span.textContent = 'ERROR: No se pudo actualizar el usuario';
            console.error('Error:', error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

window.addEventListener('beforeunload', function () {
    navigator.sendBeacon('/logout');
});


document.getElementById('profile-pic-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData();
    const fileField = document.getElementById('profile_photo');

    formData.append('profile_photo', fileField.files[0]);

    fetch('/upload_profile_pic', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Actualizar la imagen de perfil
            document.getElementById('user-pic').src = data.filepath;
            document.getElementById('user-pic-submenu').src = data.filepath;
            closeProfilePicModal();
        } else {
            console.error('Error:', data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});