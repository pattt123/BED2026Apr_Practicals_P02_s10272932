document.getElementById('createForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value.trim(),
    address: form.address.value.trim(),
  };

  try {
    const res = await fetch('/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.status === 201) {
      window.location.href = '/students.html';
    } else {
      const body = await res.json().catch(() => ({}));
      alert(body.error || 'Failed to create student');
    }
  } catch (err) {
    console.error(err);
    alert('Error creating student');
  }
});
