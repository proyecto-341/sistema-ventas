
const form = document.getElementById("formProducto");
const tabla = document.getElementById("tablaProductos");
const mensaje = document.getElementById("mensaje");

const totalProductos = document.getElementById("totalProductos");
const totalUnidades = document.getElementById("totalUnidades");
const valorInventario = document.getElementById("valorInventario");
const contador = document.getElementById("contador");

let productos = [];
let siguienteId = 1;

const formatoSoles = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN"
});

function actualizarInterfaz() {
    tabla.replaceChildren();

    let unidades = 0;
    let valorTotal = 0;

    productos.forEach((producto) => {
        unidades += producto.cantidad;
        valorTotal += producto.precio * producto.cantidad;

        const fila = document.createElement("tr");

        const valores = [
            producto.nombre,
            producto.categoria,
            formatoSoles.format(producto.precio),
            producto.cantidad,
            formatoSoles.format(producto.precio * producto.cantidad)
        ];

        valores.forEach((valor) => {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        const celdaAccion = document.createElement("td");
        const botonEliminar = document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.className = "btn-delete";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.setAttribute(
            "aria-label",
            `Eliminar ${producto.nombre}`
        );

        botonEliminar.addEventListener("click", () => {
            productos = productos.filter(
                (elemento) => elemento.id !== producto.id
            );

            actualizarInterfaz();
            mostrarMensaje("Producto eliminado correctamente.");
        });

        celdaAccion.appendChild(botonEliminar);
        fila.appendChild(celdaAccion);
        tabla.appendChild(fila);
    });

    if (productos.length === 0) {
        const filaVacia = document.createElement("tr");
        const celdaVacia = document.createElement("td");

        celdaVacia.colSpan = 6;
        celdaVacia.className = "empty";
        celdaVacia.textContent = "No hay productos registrados.";

        filaVacia.appendChild(celdaVacia);
        tabla.appendChild(filaVacia);
    }

    totalProductos.textContent = productos.length;
    totalUnidades.textContent = unidades;
    valorInventario.textContent = formatoSoles.format(valorTotal);

    contador.textContent =
        `${productos.length} ${productos.length === 1 ? "registro" : "registros"}`;
}

function mostrarMensaje(texto, esError = false) {
    mensaje.textContent = texto;
    mensaje.classList.toggle("error", esError);
}

form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document.getElementById("categoria").value;
    const precio = Number(document.getElementById("precio").value);
    const cantidad = Number(document.getElementById("cantidad").value);

    if (
        !nombre ||
        !categoria ||
        !Number.isFinite(precio) ||
        !Number.isFinite(cantidad) ||
        precio <= 0 ||
        cantidad < 1 ||
        !Number.isInteger(cantidad)
    ) {
        mostrarMensaje(
            "Ingresa un nombre, categoría, precio y cantidad válidos.",
            true
        );
        return;
    }

    productos.push({
        id: siguienteId++,
        nombre,
        categoria,
        precio,
        cantidad
    });

    actualizarInterfaz();
    form.reset();

    mostrarMensaje("Producto registrado correctamente.");
});

actualizarInterfaz();
