const container = document.getElementById('container-profile');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

function checkPasswordStrength() {
    const password = document.getElementById('register-password').value;
    const strengthText = document.getElementById('password-strength');
    let strength = 0;

    // Comprobar la longitud de la contraseña
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Comprobar la inclusión de letras mayúsculas, minúsculas, números y caracteres especiales
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength <= 2) {
        strengthText.textContent = 'Nivel de seguridad: Bajo';
        strengthText.className = 'password-strength low';
    } else if (strength <= 4) {
        strengthText.textContent = 'Nivel de seguridad: Medio';
        strengthText.className = 'password-strength medium';
    } else {
        strengthText.textContent = 'Nivel de seguridad: Alto';
        strengthText.className = 'password-strength high';
    }
}