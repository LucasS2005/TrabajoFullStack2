
const PKEY = 'productos';

const PREDETERMINADOS = [
  {id:'paracetamol', nombre:'Paracetamol', precio:3000, imagen:'images/paracetamol 2.webp'},
  {id:'ibuprofeno', nombre:'Ibuprofeno', precio:2500, imagen:'images/ibuprofeno2.webp'},
  {id:'vitamina-c', nombre:'Vitamina C', precio:2000, imagen:'images/vitaminaC2.png'},
  {id:'omeprazol', nombre:'Omeprazol', precio:3000, imagen:'images/omeprazol.jpg'},
  {id:'crema', nombre:'Crema', precio:4000, imagen:'images/crema.jpg'},
  {id:'shampoo', nombre:'Shampoo', precio:3500, imagen:'images/shampoo.webp'},
  {id:'aspirina', nombre:'Aspirina', precio:2000, imagen:'images/aspirina.png'},
  {id:'cepillo', nombre:'Cepillo', precio:2300, imagen:'images/cepillo.jpg'},
  {id:'panales', nombre:'Pañales', precio:4000, imagen:'images/pañales.webp'},
  {id:'desodorante', nombre:'Desodorante', precio:1300, imagen:'images/desodorante.webp'},
  {id:'bloqueador', nombre:'Bloqueador', precio:1400, imagen:'images/bloqueador.webp'},
  {id:'suerox', nombre:'SueroX', precio:1200, imagen:'images/suerox.png'},
  {id:'kitadol-antigripal', nombre:'Kitadol antigripal', precio:2000, imagen:'images/antigripales.jpg'},
];

function leer(){ return JSON.parse(localStorage.getItem(PKEY)||'[]'); }
function guardar(arr){ localStorage.setItem(PKEY, JSON.stringify(arr)); }
function slug(str){
  return str.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}
function normalizaNombre(str){
  return str.toString().trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}

if(!localStorage.getItem(PKEY)){ guardar(PREDETERMINADOS); }

const lista = document.getElementById('listaProductos');
const datalist = document.getElementById('listaNombres');
const form = document.getElementById('formProducto');
const msg  = document.getElementById('msg');
const f = {
  id: document.getElementById('prodId'),
  nombre: document.getElementById('nombre'),
  precio: document.getElementById('precio'),
  imagen: document.getElementById('imagen'),
  btnGuardar: document.getElementById('btnGuardar'),
  btnCancelar: document.getElementById('btnCancelar'),
};

function llenaDatalist(){
  const data = leer();
  datalist.innerHTML = data.map(p=>`<option value="${p.nombre}">`).join('');
}

function render(){
  const data = leer();
  lista.innerHTML = data.map(p => `
    <tr>
      <td><img src="${p.imagen}" alt="${p.nombre}" style="width:52px;height:52px;object-fit:contain;border:1px solid #eee;border-radius:8px;background:#fff"></td>
      <td>${p.nombre}</td>
      <td>$${Number(p.precio).toLocaleString('es-CL')}</td>
      <td>
        <button class="btn-fila editar" data-id="${p.id}">Editar</button>
        <button class="btn-fila" data-del="${p.id}">Eliminar</button>
        <a class="btn-fila" href="detalleCompra.html?producto=${p.id}">Ver</a>
      </td>
    </tr>
  `).join('');
  llenaDatalist();
}
render();

lista.addEventListener('click', (e)=>{
  const idEdit = e.target.dataset.id;
  const idDel  = e.target.dataset.del;
  if(idEdit){
    const p = leer().find(x=>x.id===idEdit);
    if(!p) return;
    f.id.value = p.id;
    f.nombre.value = p.nombre;
    f.precio.value = p.precio;
    f.imagen.value = p.imagen;
    f.btnGuardar.textContent = 'Actualizar';
    msg.textContent = 'Editando: ' + p.nombre;
    msg.classList.remove('error');
  }
  if(idDel){
    if(!confirm('¿Eliminar producto?')) return;
    const data = leer().filter(x=>x.id!==idDel);
    guardar(data); render();
    msg.textContent = 'Producto eliminado.';
    msg.classList.remove('error');
  }
});

function hayDuplicadoNombre(nombre, idActual){
  const nom = normalizaNombre(nombre);
  return leer().some(x => normalizaNombre(x.nombre) === nom && x.id !== idActual);
}

f.nombre.addEventListener('input', ()=>{
  const duplicado = hayDuplicadoNombre(f.nombre.value, f.id.value || null);
  if(duplicado){
    msg.textContent = 'Ya existe un producto con ese nombre.';
    msg.classList.add('error');
  }else{
    msg.textContent = '';
    msg.classList.remove('error');
  }
});

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const nombre = f.nombre.value.trim();
  const precio = Number(f.precio.value);
  const imagen = f.imagen.value.trim();
  if(!nombre || isNaN(precio) || !imagen){
    msg.textContent='Completa el formulario.'; msg.classList.add('error'); return;
  }
  if(hayDuplicadoNombre(nombre, f.id.value || null)){
    msg.textContent='Ya existe un producto con ese nombre.'; msg.classList.add('error'); return;
  }

  const data = leer();

  if(f.id.value){ // actualizar
    const i = data.findIndex(x=>x.id===f.id.value);
    if(i>-1){
      data[i].nombre = nombre;
      data[i].precio = precio;
      data[i].imagen = imagen;
      guardar(data); render();
      msg.textContent = 'Producto actualizado.'; msg.classList.remove('error');
    }
  }else{ // crear
    const id = slug(nombre);
    data.push({id,nombre,precio,imagen});
    guardar(data); render();
    msg.textContent = 'Producto creado.'; msg.classList.remove('error');
  }

  form.reset(); f.id.value=''; f.btnGuardar.textContent='Guardar';
});

f.btnCancelar.addEventListener('click', ()=>{
  form.reset(); f.id.value=''; f.btnGuardar.textContent='Guardar'; msg.textContent=''; msg.classList.remove('error');
});
