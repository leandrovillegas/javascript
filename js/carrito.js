class Carrito {

    constructor() {
        this.articulos = [];
        this.subTotal = 0;
        this.total = 0;
    }

    sumarACarrito(articulo) {

        let valido = false;

        for (const item of this.articulos) {
            if (item.id == articulo.id) {

                //item.cantidad += articulo.cantidad;
                item.cantidad++;
                valido = true;
            }
        }
        if (!valido) {
            articulo.cantidad = 1;
            this.articulos.push(articulo);

        }
    }

    restarACarrito(articulo) {
        for (const item of this.articulos) {
            if (item.id == articulo.id) {
                item.cantidad--;
            }
        }
    }

    cambiarCant(id, n) {
        for (let index = 0; index < this.articulos.length; index++) {
            if (this.articulos[index].id == id) {
                this.articulos[index].cantidad = Number(n);
            }
        }
    }
    calcularTotal() {
        this.subTotal = 0;
        this.total = 0;
        for (const iterator of this.articulos) {
            this.subTotal += iterator.cantidad * iterator.precio;
        }
        this.total = this.subTotal * 1.21;
    }

    eliminarArticuloDeCarrito(id) {

        for (let index = 0; index < this.articulos.length; index++) {
            if (this.articulos[index].id == id) {
                this.articulos.splice(index, 1);
            }
        }
    }

    vaciar() {
        this.articulos = [];
    }

    //Agrego al carrito y tambien al localStorage por si quiere movilizarse a hacer la compra
    agregarAlCarrito(nuevoAritculo) {

        this.sumarACarrito(nuevoAritculo);
        this.guardarCarritoEnStorage();

    }

    guardarCarritoEnStorage() {
        this.calcularTotal();
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    vaciarCarrito(e) {
        Toastify({
            text: "El carrito fue vaciado",
            style: {
                background: "#37549e",
            }
        }).showToast();

        e.preventDefault();
        limpiarTabla();
        this.vaciar();
        localStorage.removeItem('carrito');
    }


}