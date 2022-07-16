//-----------------------------------------------------------Inicio de Renderizacion de carrito---------------------------------------------------//
//Muestra Dinamicamente los articulos del carrito al oprimir el botón del carrito
function mostrarCarrito() {
    limpiarTabla();
    for (const articulo of carrito.articulos) {
        listaArticulosCarrito.innerHTML += `
        <td>
        <img src="${articulo.img}" width=100>
        </td>
        <td>${articulo.nombre.toUpperCase()}</td>
        <td>${articulo.precio}</td>
        <td>${articulo.cantidad}</td>
        <td>
        <button class='btn btn-danger' id='borrar${articulo.id}'>X</button>
        </td>
`;
    }
    carrito.articulos.forEach(articulo => {
        document.getElementById(`borrar${articulo.id}`).addEventListener('click', () => {
            Swal.fire({
                title: 'Seguro que quieres eliminar ' + `${articulo.nombre.toUpperCase()}` + ' del carrito?',
                text: "No hay manera de revertirlo",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, estoy seguro!'
            }).then((result) => {
                if (result.value) {
                    Swal.fire(
                        'Eliminado!',
                        'El articulo fue eliminado con exito.',
                        'success',
                        carrito.eliminarArticuloDeCarrito(articulo.id),
                        carrito.guardarCarritoEnStorage(),
                        Toastify({
                            text: "El articulo " + `${articulo.nombre.toUpperCase()}` + " ha sido eliminado del carrito",
                            style: {
                                background: "#eb4034",
                            }
                        }).showToast(),
                    )

                }
            })


        });
    });
}
//Misma funcion que la anterior pero trae de LocalStorage
function cargarCarritoLS() {
    if (localStorage.getItem("carrito") != null) {
        let carritoLS = JSON.parse(localStorage.getItem('carrito'));

        for (const articulo of carritoLS.articulos) {
            listaArticulosCarrito.innerHTML += `
            <td>
            <img src="${articulo.img}" width=100>
            </td>
            <td>${articulo.nombre.toUpperCase()}</td>
            <td>${articulo.precio}</td>
            <td>${articulo.cantidad}</td>
            <td>
            <button class='btn btn-danger' id='borrar${articulo.id}'>X</button>
            </td>
    `;
        }
        carrito.articulos = carritoLS.articulos;
        carrito.subTotal = carritoLS.subTotal;
        carrito.total = carritoLS.total;
    }
    else { carrito.vaciar(); }

}

//Funcion renderizado de carrito para la etapa de compra
function renderizarCarritoCompra(carrito) {

    limpiarTablaCompra();
    for (const articulo of carrito.articulos) {
        document.getElementById("tabla-carrito").innerHTML += `
        <td>${articulo.id}</td>
        <td>
        <img src="${articulo.img}" width=100>
        </td>
        <td>${articulo.nombre.toUpperCase()}</td>
        <td>$${articulo.precio}</td>
        <td><input type="number" min='1' max='100' id='cant${articulo.id}' value='${articulo.cantidad}'></td>
        <td>
        $${articulo.cantidad * articulo.precio}
        </td>
        <td>
        <button class='btn btn-danger' id='borrar${articulo.id}'>X</button>
        </td>
`;
    }

    document.getElementById("infoFinal").innerHTML += `
    <tr>
    <td>Sub-Total</td>
    <td colspan="4" scope="col" class="text-right">$${convertirNumero(carrito.subTotal)}</td>
    </tr>
    <tr>
    <td>IVA 21%</td>
    <td colspan="4" scope="col" class="text-right">$${convertirNumero(carrito.subTotal * 0.21)}</td>
    </tr>
    <tr>
    <td>Total a pagar</td>
    <td colspan="4" scope="col" class="text-right">$${convertirNumero(carrito.total)}</td>
    </tr>
    `;


    //Por cada articulo borrado(Se guarda en storage y actualiza)
    carrito.articulos.forEach(articulo => {
        document.getElementById(`borrar${articulo.id}`).addEventListener('click', () => {

            Swal.fire({
                title: 'Seguro que quieres eliminar ' + `${articulo.nombre.toUpperCase()}` + ' del carrito?',
                text: "No hay manera de revertirlo",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, estoy seguro!'
            }).then((result) => {
                if (result.value) {
                    Swal.fire(
                        'Eliminado!',
                        'El articulo fue eliminado con exito.',
                        'success',
                        carrito.eliminarArticuloDeCarrito(articulo.id),
                        carrito.guardarCarritoEnStorage(),
                        renderizarCarritoCompra(carrito)
                    )
                }
            })
        });
    });

    //Modificar la cantidad de articulos(Se guarda en storage y actualiza)
    carrito.articulos.forEach(articulo => {
        document.getElementById(`cant${articulo.id}`).addEventListener('focusout', () => {

            let cantnueva = document.getElementById(`cant${articulo.id}`).value;
            if (cantnueva <= 0 || cantnueva > 100) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Se ingreso un valor incorrecto, vuelva a intentarlo (1 al 100)!',
                })
                document.getElementById(`cant${articulo.id}`).value = articulo.cantidad;
            } else {
                if (articulo.cantidad != cantnueva) {
                    Swal.fire({
                        title: 'Seguro que quieres cambiar la cantidad del articulo?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, estoy seguro!'
                    }).then((result) => {
                        if (result.value) {
                            Swal.fire(
                                'Cambio realizado!',
                                'se realizo con exito.',
                                'success',
                                carrito.cambiarCant(articulo.id, cantnueva),
                                carrito.guardarCarritoEnStorage(),
                                renderizarCarritoCompra(carrito)
                            )
                        }
                    })
                }
            }
        });
    });
}

//-----------------------------------------------------------Fin de Renderizacion de carrito---------------------------------------------------//
//-----------------------------------------------------------Inicio de Renderizacion de Articulos----------------------------------------------//
//Muestra Dinamicamente arituclos pasandole una base de datos
function mostrarArticulos(bd) {
    limpiarListaAriticulos();
    const separador = document.createElement('div');
    separador.className = 'card__wrap--outer';
    separador.id = 'separador';
    for (const articulo of bd) {

        separador.innerHTML += `
        <div class="card__wrap--inner">
        <div class="card">
        <div class="card__img">
            <img src=${articulo.img} class="card-img-top">
        </div>
            <div class="card__item">
                <h4 class="my-0 font-weight-bold">${articulo.nombre.toUpperCase()}</h4>
            </div>
            <div class="card__sub">
                ${articulo.marca.toUpperCase()}
            </div>
            <div class="card__item flexible">
                <ul class="list-unstyled mt-3 mb-4">
                    <li></li>
                    <li>8 GB RAM</li>
                    <li>COLOR PLATEADO</li>
                    <li>256 GB DISCO SSD</li>
                </ul>
            </div>
                <div class="card__item">
                    <small class="card-title pricing-card-title precio">Precio: $<span
                            class="precio">${articulo.precio}</span></small>
                </div>

                <div class="card__footer">
                    <!--<input type="number" id='cant${articulo.id}' value="1" min="1" max="10">-->
                    <button class='btn btn-danger' id='btn${articulo.id}'>Comprar</button>
                </div>

            
        </div>
    </div>
    `;

    }
    listaArticulos.appendChild(separador);


    //Boton para agregar al carrito
    bd.forEach(articulo => {
        document.getElementById(`btn${articulo.id}`).addEventListener('click', function () {
            //articulo.cantidad=parseInt(document.getElementById(`cant${articulo.id}`).value);
            Toastify({
                text: "Se agrego " + `${articulo.nombre.toUpperCase()}` + " al carrito",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();

            carrito.agregarAlCarrito(articulo);
        });
    });

}
//-----------------------------------------------------------Fin de Renderizacion de Articulos----------------------------------------------//

//-----------------------------------------------------------Inicio de Renderizacion de Filtros----------------------------------------------//
function cargarFiltros() {

    let filtro1 = document.querySelector('#filtro1');
    let filtro2 = document.querySelector('#filtro2');
    filtro2.style.display = 'none';
    filtro1.length = 1;

    let arrayTipos = [];
    let arrayMarca = [];
    //Cargo el 1er filtro dinamicamente con los tipos de la base de datos.
    baseDeArticulos.forEach((a) => {
        if (!arrayTipos.includes(a.tipo)) {
            arrayTipos.push(a.tipo);
        }
    });

    arrayTipos.forEach((a) => {
        filtro1.innerHTML += `
        <option value="${a}">${a.toUpperCase()}</option>
        `});

    //Al momento de seleccinar el filtro 1 se carga el 2 dinamicamente para traer filtros especificos
    select1.addEventListener('change', (e) => {

        e.preventDefault();
        filtro2.options.length = 0;
        arrayMarca = [];
        filtro2.style.display = 'block';


        if (!(filtro1.options[filtro1.selectedIndex].value == "sf")) {
            baseFiltrada = baseDeArticulos.filter(articulo => {
                if (articulo.tipo == filtro1.options[filtro1.selectedIndex].value) {
                    return articulo;
                }

            });

            baseFiltrada.forEach((af) => {
                if (!arrayMarca.includes(af.marca)) {
                    arrayMarca.push(af.marca);
                }
            });
            arrayMarca.forEach((af) => {
                filtro2.innerHTML += `
        <option value="${af}">${af.toUpperCase()}</option>
        `});

        } else {
            filtro2.style.display = 'none';
        }


    })

}
//-----------------------------------------------------------Fin de Renderizacion de Filtros----------------------------------------------//


//------------------------------------Inicio Funciones para limpiar ----------------------------------//
function limpiarTabla() {

    while (listaArticulosCarrito.firstChild) {
        listaArticulosCarrito.firstChild.remove();
    }
}
function limpiarListaAriticulos() {
    if (document.getElementById('separador')) {
        separador.remove();
    }
}

function limpiarTablaCompra() {
    while (document.getElementById('tabla-carrito').firstChild) {
        document.getElementById('tabla-carrito').firstChild.remove();

    }
    while (document.getElementById('infoFinal').firstChild) {
        document.getElementById('infoFinal').firstChild.remove();
    }
}
//Agrego un . por  centenas 
function convertirNumero(numero) {

    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

}
//------------------------------------Fin Funciones para limpiar ----------------------------------//