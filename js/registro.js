document.addEventListener('DOMContentLoaded', () => {
  const formularioRegistro = document.getElementById('formularioRegistro');
  const mensajeError = document.getElementById('mensajeError');
  const selectRegion = document.getElementById('region');
  const selectComuna = document.getElementById('comuna');

  if (!formularioRegistro) return; 


  const comunasPorRegion = {
    "Metropolitana": ["Santiago", "Las Condes", "Maipú"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
    "Biobío": ["Concepción", "Chillán", "Los Ángeles"]
  };


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

 
  function validarRut(rut) {
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    return rutRegex.test(rut);
  }
  function validarCorreo(correo) {
    const correoRegex = /^[^\s@]+@[^\s@]+\.(cl|com)$/;
    return correoRegex.test(correo);
  }
  function validarTexto(texto) {
    const textoRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/;
    return textoRegex.test(texto);
  }
  function validarContrasena(contrasena) {
    const passRegex = /^[A-Za-z0-9]{6,}$/;
    return passRegex.test(contrasena);
  }
  function setError(m){ mensajeError.textContent = m; }

 
  formularioRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const rut = document.getElementById('rut').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();
    const region = selectRegion.value;
    const comuna = selectComuna.value;

    if (!validarTexto(nombre)) return setError("Nombre inválido");
    if (!validarTexto(apellido)) return setError("Apellido inválido");
    if (!validarRut(rut)) return setError("RUT inválido");
    if (!validarCorreo(correo)) return setError("Correo inválido (.cl o .com)");
    if (!validarContrasena(contrasena)) return setError("Contraseña inválida (mín. 6 caracteres, sin símbolos)");
    if (!region) return setError("Seleccione su región");
    if (!comuna) return setError("Seleccione su comuna");

    setError("");

  
    const esAdmin = ((correo === "admin@gmail.com" || correo === "admin@dominio.cl") && contrasena === "admin123");
    localStorage.setItem('auth', '1');
    localStorage.setItem('role', esAdmin ? 'admin' : 'user');

 
    window.location.href = esAdmin ? "home_admin.html" : "index.html";

    formularioRegistro.reset();
  });
});
