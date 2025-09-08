const botonesAgregar = document.querySelectorAll('.agregar_carrito');
const itemsCarrito = document.getElementById('items_carrito');
const totalCarrito = document.getElementById('total_carrito');

let carrito = [];

// Función para renderizar el carrito
function renderizarCarrito() {
  itemsCarrito.innerHTML = ''; // Limpiar tabla
  let total = 0;

  carrito.forEach((producto, indice) => {
    const totalProducto = producto.precio * producto.cantidad;
    total += totalProducto;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td>$${producto.precio}</td>
      <td>
        <button onclick="disminuirCantidad(${indice})">-</button>
        ${producto.cantidad}
        <button onclick="aumentarCantidad(${indice})">+</button>
      </td>
      <td>$${totalProducto}</td>
      <td><button onclick="eliminarProducto(${indice})">Eliminar</button></td>
    `;
    itemsCarrito.appendChild(fila);
  });

  totalCarrito.textContent = total;
}

// Agregar producto al carrito
botonesAgregar.forEach(boton => {
  boton.addEventListener('click', () => {
    const nombre = boton.dataset.nombre;
    const precio = Number(boton.dataset.precio);

    const productoExistente = carrito.find(producto => producto.nombre === nombre);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }

    renderizarCarrito();
  });
});

// Eliminar producto del carrito
function eliminarProducto(indice) {
  carrito.splice(indice, 1);
  renderizarCarrito();
}

// Aumentar cantidad
function aumentarCantidad(indice) {
  carrito[indice].cantidad += 1;
  renderizarCarrito();
}

// Disminuir cantidad del carrito
function disminuirCantidad(indice) {
  if (carrito[indice].cantidad > 1) {
    carrito[indice].cantidad -= 1;
  } else {
    eliminarProducto(indice);
  }
  renderizarCarrito();
}

document.getElementById('btn_finalizar').addEventListener('click', () => {
  if(carrito.length === 0) {
    alert("Tu carrito está vacío");
  } else {
    alert("¡Compra finalizada! Total a pagar: $" + totalCarrito.textContent);
    carrito = [];
    renderizarCarrito();
  }
});