const passwordInput = document.getElementById('__dp_password');
const form = document.getElementById('__dp_form');

const [id] = location.href.split('/').reverse();
console.log(id);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const result = await axios.patch(`/validators/validation/${id}/confirm`, {
    pin: passwordInput.value,
  });

  if (result.status === 200) {
    alert('Révocation confirmée avec succès');
    location.replace('https://google.bj');
  }
});
