const errorDiv = document.getElementById('__dp_error');
const passwordInput = document.getElementById('__dp_password');
const cPasswordInput = document.getElementById('__dp_c_password');
const submitButton = document.getElementById('__dp_submit');
const form = document.getElementById('__dp_form');
const currentUrl = new URL(window.location.href);
const id = currentUrl.pathname.split('/').filter(Boolean).pop();
const token = new URLSearchParams(currentUrl.hash.slice(1)).get('token');

submitButton.disabled = !id || !token;
if (!id || !token) {
  errorDiv.textContent = 'Ce lien est invalide ou a expiré.';
}

const validatePasswords = () => {
  if (passwordInput.value.length < 12) {
    errorDiv.textContent =
      'Le mot de passe doit contenir au moins 12 caractères.';
    submitButton.disabled = true;
    return;
  }

  if (new TextEncoder().encode(passwordInput.value).length > 72) {
    errorDiv.textContent =
      'Le mot de passe ne peut pas dépasser 72 octets.';
    submitButton.disabled = true;
    return;
  }

  if (passwordInput.value !== cPasswordInput.value) {
    errorDiv.textContent = 'Les mots de passe ne correspondent pas.';
    submitButton.disabled = true;
    return;
  }

  errorDiv.textContent = '';
  submitButton.disabled = !id || !token;
};

passwordInput.addEventListener('input', validatePasswords);
cPasswordInput.addEventListener('input', validatePasswords);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (
    !id ||
    !token ||
    passwordInput.value.length < 12 ||
    new TextEncoder().encode(passwordInput.value).length > 72
  ) {
    return;
  }

  submitButton.disabled = true;
  try {
    await axios.post('/auth/set-password', {
      id,
      token,
      password: passwordInput.value,
    });
    alert('Mot de passe défini avec succès');
    location.replace('https://admin-dgpr-concours.easyiteam.bj');
  } catch {
    errorDiv.textContent =
      'Le lien est invalide ou expiré. Demandez une nouvelle réinitialisation.';
    submitButton.disabled = false;
  }
});
