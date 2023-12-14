function validateAndRedirect() {
    // Realiza la validación
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const countryCode = document.getElementById('countryCode').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const address = document.getElementById('address').value;

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const addressError = document.getElementById('addressError');

    nameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';
    addressError.textContent = '';

    let isValid = true;

    if (name.length < 3) {
        nameError.textContent = 'El nombre debe tener al menos 3 caracteres.';
        isValid = false;
    }

    if (!isValidEmail(email)) {
        emailError.textContent = 'Ingrese un correo electrónico válido.';
        isValid = false;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
        phoneError.textContent = 'Ingrese un número de teléfono válido.';
        isValid = false;
    }

    if (address.length < 5) {
        addressError.textContent = 'La dirección debe tener al menos 5 caracteres.';
        isValid = false;
    }

    if (isValid) {
        const urlParams = new URLSearchParams();
        urlParams.append('nombre', name);

        // Cambia la ruta según tu estructura de archivos
        window.location.href = `pokedex.html?${urlParams.toString()}`;
    }
}


function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidPhoneNumber(phone) {
    const phonePattern = /^\d{2,14}$/;
    return phonePattern.test(phone);
}