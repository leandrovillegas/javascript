class Articulo {
    constructor(id, marca, tipo, nombre, img, precio, cantidad) {
        this.id = id;
        this.marca = marca;
        this.tipo = tipo;
        this.nombre = nombre;
        this.img = img;
        this.precio = precio;
        this.cantidad = cantidad;


    }

    devolverPrecio() {
        return this.precio * this.cantidad;
    }

} 