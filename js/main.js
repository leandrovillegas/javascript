
let baseDeArticulos = [];
let baseFiltrada = [];
let carrito = new Carrito();
let articulo = new Articulo();
const vaciar = document.getElementById('vaciar-carrito');
//const cargarArticulo = document.getElementById('cargar-articulos');
const ddm = document.getElementById('dropdown01');
const listaArticulos = document.getElementById('lista-articulos');
const listaArticulosCarrito = document.querySelector('#lista-carrito tbody');
const btnOrden = document.getElementById('btnorden');
const btnFiltro = document.getElementById('btnfiltro');
const btnReestablecer = document.getElementById('re');
const select1 = document.getElementById('filtro1');
const select2 = document.getElementById('filtro2');
const select = document.getElementById('orden');
const btnBusqueda = document.querySelector('#btnBusqueda');
const busqueda = document.querySelector('#busqueda');
const btnProcesarCompra = document.querySelector('#procesar-compra');
const btnReEstablecer = document.getElementById('reEstablecer');


//Cargamos de forma asincronica la base de datos de articulos a traves de un fetch
fetch('json/baseDeArticulos.json')
    .then(response => response.json())
    .then(data => data.forEach(element => {
        baseDeArticulos.push(new Articulo(element.id, element.marca, element.tipo, element.nombre, element.img, element.precio, element.cantidad));
    }));

cargarEventos();

function cargarEventos() {
    busqueda.addEventListener('keypress', (e) => { if (e.keyCode === 13 || e.which === 13) { buscarArticulo() } });
    btnBusqueda.addEventListener('click', () => { buscarArticulo() });
    btnReEstablecer.addEventListener('click', () => { reEstablecer() });
    ddm.addEventListener('click', () => { mostrarCarrito() });
    btnOrden.addEventListener('click', () => { ordenar() });
    btnFiltro.addEventListener('click', () => { filtrarArticulos() });
    vaciar.addEventListener('click', (e) => {
        if (carrito.articulos.length != 0) {
            Swal.fire({
                title: 'Seguro que quieres vaciar el carrito?',
                text: "No hay manera de revertirlo",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, estoy seguro!'
            }).then((result) => {
                if (result.value) {
                    Swal.fire(
                        'Vaciado!',
                        'Carrito vaciado con exito.',
                        'success'
                    )
                    carrito.vaciarCarrito(e);
                }
            })
        }
        else {
            Swal.fire('El carrito ya esta vacio');
        }
    });

    btnProcesarCompra.addEventListener('click', (e) => { procederACompra(e) });

    //Automaticos al cargar la pagina
    document.addEventListener('readystatechange', () => { mostrarArticulos(baseDeArticulos) });
    document.addEventListener('readystatechange', () => { cargarCarritoLS() });
    document.addEventListener('readystatechange', () => { cargarFiltros() });

}

//Verifico antes de pasar a compra si hay articulos
function procederACompra(e) {
    e.preventDefault();
    if (carrito.articulos.length == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Parece que no hay ningun articulo para comprar!',
        })
    } else {
        window.location = "compra.html"
    }
}

//Ordeno por el que haya seleccionado. Relevancia(id), Menor o Mayor precio

function ordenar() {

    let value = select.options[select.selectedIndex].value;
    //btnReEstablecer.style.display = 'block';

    limpiarListaAriticulos();

    if (baseFiltrada.length == 0) {
        baseFiltrada = baseDeArticulos;
    }
    if (value == 'ascendente') {
        baseFiltrada.sort((a, b) => a.precio - b.precio);
    } else if (value == 'descendente') {
        baseFiltrada.sort((a, b) => b.precio - a.precio);
    } else {
        baseFiltrada.sort((a, b) => a.id - b.id);
    }
    mostrarArticulos(baseFiltrada);
}



function filtrarArticulos() {

    let filtro1 = select1.options[select1.selectedIndex].value;
    let filtro2 = select2.options[select2.selectedIndex].value;
    baseFiltrada = baseDeArticulos.filter(articulo => {

        if (articulo.tipo.toLowerCase() == filtro1.toLowerCase()) {

            if (articulo.marca.toLowerCase() == filtro2.toLowerCase()) {
                return articulo;
            }

        }
    });

    if (filtro1 == 'sf') {
        Swal.fire('No realizo ningun filtro');
    } else {
        btnReEstablecer.style.display = 'block';
        limpiarListaAriticulos();
        mostrarArticulos(baseFiltrada);
    }

}

function buscarArticulo() {


    let busquedas = busqueda.value;

    baseFiltrada = baseDeArticulos.filter(articulo => {
        if (articulo.tipo.toLowerCase() == busquedas.toLowerCase() || articulo.marca.toLowerCase() == busquedas.toLowerCase() || articulo.nombre.toLowerCase() == busquedas.toLowerCase()) {
            return articulo
        }
    })
    if (baseFiltrada.length === 0) {
        Swal.fire('Todavia no tenemos ese articulo');
    } else {
        btnReEstablecer.style.display = 'block';
        mostrarArticulos(baseFiltrada);
    }


}
function reEstablecer() {
    baseFiltrada = [];
    cargarFiltros();
    mostrarArticulos(baseDeArticulos);
    busqueda.value = '';
    btnReEstablecer.style.display = 'none';
}
