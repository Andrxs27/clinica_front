const apiUrl = 'http://localhost:3000/medicos';

const medicoForm = document.getElementById('medicoForm');
const idMedicoInput = document.getElementById('idMedico');
const identificacionInput = document.getElementById('identificacion');
const nombresInput = document.getElementById('nombres');
const telefonoInput = document.getElementById('telefono');
const correoInput = document.getElementById('correo');
const tablaMedicosBody = document.getElementById('tablaMedicosBody');

// Cargar médicos al iniciar la página
window.onload = () => {
    cargarMedicos();
};

// Función para cargar los médicos y mostrarlos en la tabla
function cargarMedicos() {
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            tablaMedicosBody.innerHTML = ''; // Limpiar tabla
            data.forEach(medico => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${medico.idMedico}</td>
                    <td>${medico.identificacion}</td>
                    <td>${medico.nombres}</td>
                    <td>${medico.telefono}</td>
                    <td>${medico.correo}</td>
                    <td>
                        <button class="edit-btn" onclick="editarMedico('${medico.idMedico}')">Editar</button>
                        <button class="delete-btn" onclick="eliminarMedico('${medico.idMedico}')">Eliminar</button>
                    </td>
                `;
                tablaMedicosBody.appendChild(tr);
            });
        })
        .catch(err => alert('Error cargando médicos: ' + err));
}

// Guardar o actualizar médico
medicoForm.addEventListener('submit', e => {
    e.preventDefault();

    const idMedico = idMedicoInput.value.trim();
    const identificacion = identificacionInput.value.trim();
    const nombres = nombresInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const correo = correoInput.value.trim();

    if (!idMedico || !identificacion || !nombres || !telefono || !correo) {
        alert('Por favor complete todos los campos.');
        return;
    }

    const medicoData = { idMedico, identificacion, nombres, telefono, correo };

    // Si existe el ID, hacemos PUT (editar); si no, POST (crear)
    const metodo = existeMedico(idMedico) ? 'PUT' : 'POST';
    const url = metodo === 'POST' ? apiUrl : `${apiUrl}/${idMedico}`;

    fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicoData),
    })
        .then(res => {
            if (!res.ok) return res.json().then(e => Promise.reject(e.error));
            return res.json();
        })
        .then(() => {
            alert(metodo === 'POST' ? 'Médico agregado' : 'Médico actualizado');
            limpiarFormulario();
            cargarMedicos();
        })
        .catch(err => alert('Error: ' + err));
});

// Verifica si ya existe un médico con ese ID (solo en frontend para saber si es PUT o POST)
function existeMedico(idMedico) {
    return Array.from(tablaMedicosBody.children).some(
        row => row.children[0].textContent === idMedico
    );
}

// Llenar el formulario para editar
function editarMedico(idMedico) {
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            const medico = data.find(m => m.idMedico === idMedico);
            if (!medico) {
                alert('Médico no encontrado');
                return;
            }
            idMedicoInput.value = medico.idMedico;
            identificacionInput.value = medico.identificacion;
            nombresInput.value = medico.nombres;
            telefonoInput.value = medico.telefono;
            correoInput.value = medico.correo;
        });
}

// Eliminar médico
function eliminarMedico(idMedico) {
    if (!confirm('¿Seguro que quieres eliminar este médico?')) return;

    fetch(`${apiUrl}/${idMedico}`, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) throw new Error('Error al eliminar médico');
            return res.json();
        })
        .then(() => {
            alert('Médico eliminado');
            cargarMedicos();
        })
        .catch(err => alert(err));
}

// Limpiar formulario
function limpiarFormulario() {
    idMedicoInput.value = '';
    identificacionInput.value = '';
    nombresInput.value = '';
    telefonoInput.value = '';
    correoInput.value = '';
}
