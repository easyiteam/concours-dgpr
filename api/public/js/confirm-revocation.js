const passwordInput = document.getElementById('__dp_password');
const form = document.getElementById('__dp_form');

const [id] = location.href.split('/').reverse();
console.log(id);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const result = await axios.patch(`/validators/${id}/confirm-revocation`, {
    pin: passwordInput.value,
  });

  console.log(result);

  if (result.data) {
    alert('Révocation confirmée avec succès');
    location.replace('https://admin-dgpr-concours.easyiteam.bj');
  }
});
