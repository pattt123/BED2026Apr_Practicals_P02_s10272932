// Read id from URL, fetch student, populate form, submit PUT
function getIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

async function loadStudent() {
  const id = getIdFromUrl();
  if (!id) {
    alert('No student id provided');
    return;
  }
  try {
    const res = await fetch(`/students/${id}`);
    if (!res.ok) throw new Error('Failed to fetch student');
    const student = await res.json();
    const form = document.getElementById('editForm');
    form.id.value = student.student_id;
    form.name.value = student.name || '';
    form.address.value = student.address || '';
  } catch (err) {
    console.error(err);
    alert('Error loading student');
  }
}

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const id = form.id.value;
  const data = { name: form.name.value.trim(), address: form.address.value.trim() };
  try {
    const res = await fetch(`/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      window.location.href = '/students.html';
    } else {
      const body = await res.json().catch(() => ({}));
      alert(body.error || 'Failed to update student');
    }
  } catch (err) {
    console.error(err);
    alert('Error updating student');
  }
});

window.addEventListener('DOMContentLoaded', loadStudent);
