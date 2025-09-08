
document.addEventListener('DOMContentLoaded', () => {
  const PKEY = 'productos';
  if (localStorage.getItem(PKEY)) return;

  const slug = s => s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const productos = [...document.querySelectorAll('.tarjeta_producto')].map(card => {
    const nombre = card.querySelector('h3')?.textContent.trim() || '';
    const precio = parseInt((card.querySelector('p')?.textContent || '').replace(/[^\d]/g,''), 10) || 0;
    const imagen = card.querySelector('img')?.getAttribute('src') || '';
    return { id: slug(nombre), nombre, precio, imagen };
  });

  if (productos.length) localStorage.setItem(PKEY, JSON.stringify(productos));
});

const botonesAgregar   = document.querySelectorAll('.agregar_carrito');
const itemsCarrito     = document.getElementById('items_carrito');
const subtotalSpan     = document.getElementById('total_carrito');
const totalFinalSpan   = document.getElementById('total_final_carrito') || null;
const descuentoSpan    = document.getElementById('descuento_carrito') || null;
const porcentajeSpan   = document.getElementById('porcentaje_descuento') || null;
const filaDescuento    = document.getElementById('fila_descuento') || null;
const inputCupon       = document.getElementById('input_cupon') || null;
const btnAplicarCupon  = document.getElementById('btn_aplicar_cupon') || null;

let carrito = [];
let cuponValido = false;

const formatear = n => Number(n).toLocaleString('es-CL');

const calcularSubtotal = () =>
  carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

function calcularTotales(){
  const subtotal = calcularSubtotal();
  if (subtotalSpan) subtotalSpan.textContent = formatear(subtotal);

  let descuento = 0;
  let porcentaje = 0;

  if (cuponValido && subtotal > 0) {
    porcentaje = (subtotal >= 20000) ? 15 : 10;
    descuento = Math.floor(subtotal * porcentaje / 100);
    if (filaDescuento)      filaDescuento.style.display = 'table-row';
    if (porcentajeSpan)     porcentajeSpan.textContent = porcentaje;
    if (descuentoSpan)      descuentoSpan.textContent = formatear(descuento);
  } else {
    if (filaDescuento)      filaDescuento.style.display = 'none';
    if (porcentajeSpan)     porcentajeSpan.textContent = '0';
    if (descuentoSpan)      descuentoSpan.textContent = '0';
  }

  const totalFinal = subtotal - descuento;
  if (totalFinalSpan) totalFinalSpan.textContent = formatear(totalFinal);
}

function renderizarCarrito() {
  itemsCarrito.innerHTML = '';
  carrito.forEach((producto, i) => {
    const totalProducto = producto.precio * producto.cantidad;
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td>$${formatear(producto.precio)}</td>
      <td>
        <button onclick="disminuirCantidad(${i})">-</button>
        ${producto.cantidad}
        <button onclick="aumentarCantidad(${i})">+</button>
      </td>
      <td>$${formatear(totalProducto)}</td>
      <td><button onclick="eliminarProducto(${i})">Eliminar</button></td>
    `;
    itemsCarrito.appendChild(fila);
  });
  calcularTotales();
}

botonesAgregar.forEach(boton => {
  boton.addEventListener('click', () => {
    const nombre = boton.dataset.nombre;
    const precio = Number(boton.dataset.precio) || 0;
    const existente = carrito.find(p => p.nombre === nombre);
    if (existente) existente.cantidad += 1;
    else carrito.push({ nombre, precio, cantidad: 1 });
    renderizarCarrito();
  });
});

function eliminarProducto(i){ carrito.splice(i,1); renderizarCarrito(); }
function aumentarCantidad(i){ carrito[i].cantidad += 1; renderizarCarrito(); }
function disminuirCantidad(i){
  if (carrito[i].cantidad > 1) carrito[i].cantidad -= 1;
  else eliminarProducto(i);
  renderizarCarrito();
}
window.eliminarProducto = eliminarProducto;
window.aumentarCantidad = aumentarCantidad;
window.disminuirCantidad = disminuirCantidad;

if (btnAplicarCupon && inputCupon) {
  btnAplicarCupon.addEventListener('click', () => {
    const valor = (inputCupon.value || '').trim().toLowerCase();
    cuponValido = (valor === 'farmacom2025');
    calcularTotales();
    alert(cuponValido ? 'Cupón aplicado correctamente' : 'Cupón inválido');
  });
}

const btnFinalizar = document.getElementById('btn_finalizar');
if (btnFinalizar) {
  btnFinalizar.addEventListener('click', () => {
    if (!carrito.length) { alert('Tu carrito está vacío'); return; }
    const totalTexto = (totalFinalSpan?.textContent) || subtotalSpan.textContent;
    alert('¡Compra finalizada! Total a pagar: $' + totalTexto);
    carrito = []; cuponValido = false; if (inputCupon) inputCupon.value = '';
    renderizarCarrito();
  });
}

renderizarCarrito();
