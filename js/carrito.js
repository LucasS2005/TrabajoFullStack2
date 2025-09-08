const botonesAgregar = document.querySelectorAll('.agregar_carrito');
const itemsCarrito = document.getElementById('items_carrito');

const subtotalSpan = document.getElementById('total_carrito');          // Subtotal (antes era el "Total")
const totalFinalSpan = document.getElementById('total_final_carrito');   // Total con descuento
const descuentoSpan = document.getElementById('descuento_carrito');
const porcentajeDescSpan = document.getElementById('porcentaje_descuento');
const filaDescuento = document.getElementById('fila_descuento');

const inputCupon = document.getElementById('input_cupon');
const btnAplicarCupon = document.getElementById('btn_aplicar_cupon');

let carrito = [];
let cuponValido = false;

function formatear(n){
  return Number(n).toLocaleString('es-CL');
}

function calcularSubtotal(){
  return carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
}

function calcularTotales(){
  const subtotal = calcularSubtotal();
  subtotalSpan.textContent = formatear(subtotal);

  let descuento = 0;
  let porcentaje = 0;

  if (cuponValido) {
    porcentaje = (subtotal >= 20000) ? 15 : 10;
    descuento = Math.floor(subtotal * porcentaje / 100);

    filaDescuento.style.display = 'block';
    porcentajeDescSpan.textContent = porcentaje;
    descuentoSpan.textContent = formatear(descuento);
  } else {
    filaDescuento.style.display = 'none';
    porcentajeDescSpan.textContent = '0';
    descuentoSpan.textContent = '0';
  }

  const totalFinal = subtotal - descuento;
  totalFinalSpan.textContent = formatear(totalFinal);
}


function renderizarCarrito() {
  itemsCarrito.innerHTML = '';
  carrito.forEach((producto, indice) => {
    const totalProducto = producto.precio * producto.cantidad;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td>$${formatear(producto.precio)}</td>
      <td>
        <button onclick="disminuirCantidad(${indice})">-</button>
        ${producto.cantidad}
        <button onclick="aumentarCantidad(${indice})">+</button>
      </td>
      <td>$${formatear(totalProducto)}</td>
      <td><button onclick="eliminarProducto(${indice})">Eliminar</button></td>
    `;
    itemsCarrito.appendChild(fila);
  });

  calcularTotales();
}

// Acciones de botones de productos
botonesAgregar.forEach(boton => {
  boton.addEventListener('click', () => {
    const nombre = boton.dataset.nombre;
    const precio = Number(boton.dataset.precio);

    const productoExistente = carrito.find(p => p.nombre === nombre);
    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }
    renderizarCarrito();
  });
});

function eliminarProducto(indice) {
  carrito.splice(indice, 1);
  renderizarCarrito();
}

function aumentarCantidad(indice) {
  carrito[indice].cantidad += 1;
  renderizarCarrito();
}

function disminuirCantidad(indice) {
  if (carrito[indice].cantidad > 1) {
    carrito[indice].cantidad -= 1;
  } else {
    eliminarProducto(indice);
  }
  renderizarCarrito();
}


btnAplicarCupon.addEventListener('click', () => {
  const valor = (inputCupon.value || '').trim().toLowerCase();
  if (valor === 'farmacom2025') {
    cuponValido = true;
    calcularTotales();
    alert('Cupon aplicado correctamente');
  } else {
    cuponValido = false;
    calcularTotales();
    alert('Cupon invalido o cupon falso');
  }
});


document.getElementById('btn_finalizar').addEventListener('click', () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }
  const totalFinal = totalFinalSpan.textContent;
  alert("¡Compra finalizada! Total a pagar: $" + totalFinal);


  carrito = [];
  cuponValido = false;
  inputCupon.value = '';
  renderizarCarrito();
});


renderizarCarrito();