// Fetch and display all students; handle edit/delete actions
async function loadStudents() {
  try {
    const res = await fetch('/students');
    if (!res.ok) throw new Error('Failed to fetch students');
    const students = await res.json();
    const tbody = document.querySelector('#studentsTable tbody');
    tbody.innerHTML = '';
    students.forEach(s => {
      const tr = document.createElement('tr');
      const actionsTd = document.createElement('td');
      actionsTd.className = 'actions';

      const editLink = document.createElement('a');
      editLink.href = `/edit-student.html?id=${s.student_id}`;
      editLink.textContent = 'Edit';
      editLink.style.marginRight = '8px';

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => handleDelete(s.student_id, tr));

      actionsTd.appendChild(editLink);
      actionsTd.appendChild(delBtn);

      tr.innerHTML = `<td>${s.student_id}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.address)}</td>`;
      tr.appendChild(actionsTd);
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function handleDelete(id, row) {
  if (!confirm('Delete this student?')) return;
  try {
    const res = await fetch(`/students/${id}`, { method: 'DELETE' });
    if (res.status === 204) {
      row.remove();
    } else {
      const body = await res.json().catch(() => ({}));
      alert(body.error || 'Failed to delete');
    }
  } catch (err) {
    console.error(err);
    alert('Error deleting student');
  }
}

window.addEventListener('DOMContentLoaded', loadStudents);
