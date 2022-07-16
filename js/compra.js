let carrito = new Carrito();
const cliente = document.querySelector('#cliente');
const email = document.querySelector('#email');
const btnProcesarCompra = document.querySelector('#procesar-compra');


cargarEventos();

function cargarEventos() {

    //Traigo del local storage mi carrito y como se que es un carrito lo seteo con el assign de Object, para tener los metodos del carrito
    if (localStorage.getItem("carrito") != null) {
        carrito = Object.assign(new Carrito(), JSON.parse(localStorage.getItem("carrito")));
    }
    renderizarCarritoCompra(carrito);

    cliente.addEventListener('keypress', e => { if (e.keyCode === 13 || e.which === 13) e.preventDefault() });
    email.addEventListener('keypress', e => { if (e.keyCode === 13 || e.which === 13) e.preventDefault() });

    btnProcesarCompra.addEventListener('click', (e) => { procesarCompra(e) });

}


function validacion(valor) {

    switch (valor) {
        case 'email':
            if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value))) {
                return true
            } else {
                return false
            }

        case 'cliente':
            if ((/^[a-zA-Z ]{2,30}$/.test(cliente.value))) {
                return true
            } else {
                return false
            }

        default:
            break;
    }



}
// Confirma si tiene mail y cliente completos como tambien si hay articulos en el carrito. 
function procesarCompra(e) {
    e.preventDefault();
    if (cliente.value == '' || email.value == '' || !validacion('email') || !validacion('cliente')) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Campo cliente o email estan vacios o incompletos!',
        })
        email.value = '';
        cliente.value = '';
    } else if (carrito.articulos.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Parece que eliminaste todos los articulos. vuelve cuando hayas agregado alguno!',
        })
    } else {
        {
            Swal.fire({
                title: 'Pedido hecho!',
                text: 'Gracias por usar nuestra web.',
                imageUrl: 'img/mail.gif',
                imageAlt: 'Leandro Villegas',
            }).then((result) => {
                if (result.value) {
                    email.value = '';
                    cliente.value = '';
                    finalizoCompra();
                }
            })

        }
    }

}

function finalizoCompra() {

    localStorage.removeItem('carrito');
    carrito.vaciar();
    window.location = 'index.html'

}

