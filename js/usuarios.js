let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
const tbody = document.getElementById('tbody_usuarios');

const form = document.getElementById('form_usuario');
const tituloForm = document.getElementById('titulo_form');
const hiddenId = document.getElementById('usuario_id');
const inputNombre = document.getElementById('nombre');
const inputEmail  = document.getElementById('email');
const selectRol   = document.getElementById('rol');
const checkActivo = document.getElementById('activo');

const btnCancelar = document.getElementById('btn_cancelar');
const btnNuevo = document.getElementById('btn_nuevo');

const modal = document.getElementById('modal');
const detalleUsuario = document.getElementById('detalle_usuario');
const cerrarModal = document.getElementById('cerrar_modal');

const guardarLS = () => localStorage.setItem('usuarios', JSON.stringify(usuarios));
const uid = () => Date.now() + Math.floor(Math.random() * 1000);

function emailValido(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function resetForm() {
  hiddenId.value = '';
  form.reset();
  checkActivo.checked = true;
  tituloForm.textContent = 'Nuevo Usuario';
  btnCancelar.style.display = 'none';
}

function cargarEnFormulario(u) {
  hiddenId.value = u.id;
  inputNombre.value = u.nombre;
  inputEmail.value  = u.email;
  selectRol.value   = u.rol;
  checkActivo.checked = !!u.activo;
  tituloForm.textContent = 'Editar Usuario';
  btnCancelar.style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  tbody.innerHTML = '';

  if (usuarios.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#777;">Sin registros</td></tr>`;
    return;
  }

  usuarios.forEach((u, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${u.nombre}</td>
      <td>${u.email}</td>
      <td>${u.rol}</td>
      <td><span class="badge ${u.activo ? 'activo' : 'inactivo'}">${u.activo ? 'Activo' : 'Inactivo'}</span></td>
      <td>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn_sm btn_ver" data-accion="ver" data-id="${u.id}">Ver</button>
          <button class="btn_sm btn_editar" data-accion="editar" data-id="${u.id}">Editar</button>
          <button class="btn_sm btn_eliminar" data-accion="eliminar" data-id="${u.id}">Eliminar</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = inputNombre.value.trim();
  const email  = inputEmail.value.trim().toLowerCase();
  const rol    = selectRol.value;
  const activo = checkActivo.checked;

  if (!nombre)  return alert('El nombre es obligatorio.');
  if (!emailValido(email)) return alert('Email inválido.');
  if (!rol) return alert('Selecciona un rol.');

  const id = hiddenId.value;

  if (id) {
    usuarios = usuarios.map(u => u.id == id ? { ...u, nombre, email, rol, activo } : u);
    alert('Usuario actualizado ✔');
  } else {
    usuarios.push({ id: uid(), nombre, email, rol, activo, creado: new Date().toISOString() });
    alert('Usuario creado ✔');
  }

  guardarLS();
  render();
  resetForm();
});


btnCancelar.addEventListener('click', resetForm);


btnNuevo.addEventListener('click', () => {
  resetForm();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


tbody.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-accion]');
  if (!btn) return;
  const accion = btn.dataset.accion;
  const id = btn.dataset.id;

  const usuario = usuarios.find(u => String(u.id) === String(id));
  if (!usuario) return;

  if (accion === 'ver') {
    detalleUsuario.innerHTML = `
      <p><strong>Nombre:</strong> ${usuario.nombre}</p>
      <p><strong>Email:</strong> ${usuario.email}</p>
      <p><strong>Rol:</strong> ${usuario.rol}</p>
      <p><strong>Estado:</strong> ${usuario.activo ? 'Activo' : 'Inactivo'}</p>
      ${usuario.actualizado ? `<p><strong>Actualizado:</strong> ${new Date(usuario.actualizado).toLocaleString()}</p>` : ''}
    `;
    modal.setAttribute('aria-hidden', 'false');
  }

  if (accion === 'editar') {
    cargarEnFormulario(usuario);
  }

  if (accion === 'eliminar') {
    if (confirm('¿Eliminar este usuario?')) {
      usuarios = usuarios.filter(u => String(u.id) !== String(id));
      guardarLS();
      render();
    }
  }
});

cerrarModal.addEventListener('click', () => modal.setAttribute('aria-hidden', 'true'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.setAttribute('aria-hidden','true'); });


if (usuarios.length === 0) {
  usuarios = [
    { id: uid(), nombre: 'Admin Ejemplo', email:'admin@farma.com', rol:'Administrador', activo:true, creado:new Date().toISOString() },
    { id: uid(), nombre: 'Vendedor 1', email:'venta@farma.com', rol:'Vendedor', activo:true, creado:new Date().toISOString() },
  ];
  guardarLS();
}

// Inicializar
render();
resetForm();