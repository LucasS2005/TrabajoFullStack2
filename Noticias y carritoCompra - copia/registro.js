const formularioRegistro = document.getElementById('formularioRegistro');
const mensajeError = document.getElementById('mensajeError');
const selectRegion = document.getElementById('region');
const selectComuna = document.getElementById('comuna');

// Comunas por región
const comunasPorRegion = {
  "Metropolitana": ["Santiago", "Las Condes", "Maipú"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
  "Biobío": ["Concepción", "Chillán", "Los Ángeles"]
};

// Llenar comunas según región
selectRegion.addEventListener('change', () => {
  selectComuna.innerHTML = '<option value="">Selecciona tu comuna</option>';
  const comunas = comunasPorRegion[selectRegion.value] || [];
  comunas.forEach(comuna => {
    const opcion = document.createElement('option');
    opcion.value = comuna;
    opcion.textContent = comuna;
    selectComuna.appendChild(opcion);
  });
});

// Validar RUT chileno (simplificado)
function validarRut(rut) {
  const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
  return rutRegex.test(rut);
}

// Validar correo .cl o .com
function validarCorreo(correo) {
  const correoRegex = /^[^\s@]+@[^\s@]+\.(cl|com)$/;
  return correoRegex.test(correo);
}

// Validar nombre/apellido
function validarTexto(texto) {
  const textoRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/;
  return textoRegex.test(texto);
}

// Validar contraseña
function validarContrasena(contrasena) {
  const passRegex = /^[A-Za-z0-9]{6,}$/; // mínimo 6 caracteres, sin símbolos
  return passRegex.test(contrasena);
}

// Evento submit
formularioRegistro.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const rut = document.getElementById('rut').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const contrasena = document.getElementById('contrasena').value.trim();
  const region = selectRegion.value;
  const comuna = selectComuna.value;

  if (!validarTexto(nombre)) return mensajeError.textContent = "Nombre inválido";
  if (!validarTexto(apellido)) return mensajeError.textContent = "Apellido inválido";
  if (!validarRut(rut)) return mensajeError.textContent = "RUT inválido";
  if (!validarCorreo(correo)) return mensajeError.textContent = "Correo inválido (.cl o .com)";
  if (!validarContrasena(contrasena)) return mensajeError.textContent = "Contraseña inválida (mín. 6 caracteres, sin símbolos)";
  if (!region) return mensajeError.textContent = "Seleccione su región";
  if (!comuna) return mensajeError.textContent = "Seleccione su comuna";

  mensajeError.textContent = "";

  // Redirección según tipo de usuario
  if ((correo === "admin@gmail.com" || correo === "admin@dominio.cl") && contrasena === "admin123") {
    window.location.href = "home_admin.html"; // Página del administrador
  } else {
    window.location.href = "home.html"; // Página normal
  }

  formularioRegistro.reset();
});
