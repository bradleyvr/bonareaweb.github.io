// envuelve todo para evitar problemas si el script se ejecuta antes del DOM
document.addEventListener("DOMContentLoaded", function () {

    /* ------------------------
        CARRITO DE COMPRAS
    ------------------------- */

    let carrito = [];
    const numeroCarrito = document.querySelector(".content-shopping-cart .number");

    // si por alguna razón no existe, evitamos que rompa
    if (!numeroCarrito) {
        console.warn("No se encontró .content-shopping-cart .number");
    }

    /* Agregar producto al carrito */
    document.querySelectorAll(".add-cart").forEach((btn) => {
        btn.addEventListener("click", () => {
            const producto = btn.closest(".card-product");
            if (!producto) return;

            const nombre = producto.querySelector("h3") ? producto.querySelector("h3").innerText.trim() : "Producto";
            // tomamos solo la parte visible del precio (antes del <span> tachado)
            let precioRaw = "";
            const precioNode = producto.querySelector(".price");
            if (precioNode) {
                // si .price tiene texto y un <span>, childNodes[0] suele ser el texto del precio visible
                precioRaw = precioNode.childNodes[0] ? precioNode.childNodes[0].textContent.trim() : precioNode.innerText.trim();
            }
            // normalizamos el separador decimal (por si usan coma)
            precioRaw = precioRaw.replace("€", "").replace("$", "").replace(/\s/g, "").replace(",", ".");

            carrito.push({ nombre, precio: precioRaw });
            if (numeroCarrito) numeroCarrito.textContent = `(${carrito.length})`;

            alert("Producto agregado: " + nombre);
            actualizarCarrito();
        });
    });

    /* ------------------------
        MODAL DEL CARRITO
    ------------------------- */
    const modal = document.createElement("div");
    modal.id = "modalCarrito";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.6)";
    modal.style.display = "none";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";

    modal.innerHTML = `
        <div style="
            background:white;
            padding:20px;
            width:350px;
            max-height:420px;
            overflow:auto;
            border-radius:10px;
            text-align:center;
            box-shadow:0 0 10px rgba(0,0,0,0.3);
        ">
            <h2>Carrito de Compras</h2>

            <ul id="listaCarrito" style="list-style:none; padding:0;"></ul>

            <h3>Total: <span id="totalCarrito">0€</span></h3>

            <button id="pagarBtn" style="
                width:100%;
                padding:10px;
                background:green;
                color:white;
                border:none;
                border-radius:8px;
                cursor:pointer;
                font-size:16px;
                margin-bottom:10px;
            ">Pagar ahora</button>

            <button id="cerrarModal" style="
                padding:8px 15px;
                border:none;
                background:#333;
                color:white;
                border-radius:5px;
                cursor:pointer;
            ">Cerrar</button>
        </div>
    `;

    document.body.appendChild(modal);

    /* Abrir modal al hacer clic en el carrito */
    const contUser = document.querySelector(".container-user");
    if (contUser) {
        contUser.addEventListener("click", () => {
            modal.style.display = "flex";
        });
    }

    /* Cerrar modal (delegado) */
    document.addEventListener("click", function (e) {
        if (e.target && (e.target.id === "cerrarModal" || e.target.id === "modalCarrito")) {
            modal.style.display = "none";
        }
    });

    /* ------------------------
        ACTUALIZAR LISTA DEL CARRITO
    ------------------------- */
    function actualizarCarrito() {
        const lista = document.getElementById("listaCarrito");
        if (!lista) return;
        lista.innerHTML = "";

        carrito.forEach((producto, index) => {
            const li = document.createElement("li");
            li.style.margin = "10px 0";

            // usamos data-index para eliminar desde JS (mejor que inline onclick),
            // pero dejamos compatibilidad con eliminar() global también.
            li.innerHTML = `
                ${producto.nombre} - ${producto.precio}€
                <button class="btn-eliminar" data-index="${index}" style="
                    margin-left:10px;
                    background:red;
                    color:white;
                    border:none;
                    padding:4px 8px;
                    cursor:pointer;
                    border-radius:5px;
                ">X</button>
            `;

            lista.appendChild(li);
        });
        calcularTotal();
    }

    /* eliminar usando delegación */
    document.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("btn-eliminar")) {
            const idx = parseInt(e.target.getAttribute("data-index"), 10);
            if (!isNaN(idx)) window.eliminar(idx);
        }
    });

    /* ------------------------
        CALCULAR TOTAL
    ------------------------- */
    function calcularTotal() {
        let total = 0;

        carrito.forEach((p) => {
            const precioNum = parseFloat(String(p.precio).replace(",", "."));
            if (!isNaN(precioNum)) total += precioNum;
        });

        const totalEl = document.getElementById("totalCarrito");
        if (totalEl) totalEl.textContent = total.toFixed(2) + "€";
    }

    /* ------------------------
        ELIMINAR PRODUCTO DEL CARRITO
    ------------------------- */
    // Exponemos la función en global porque la usábamos con onclick antes
    window.eliminar = function (indice) {
        if (indice < 0 || indice >= carrito.length) return;
        const nombre = carrito[indice].nombre;

        carrito.splice(indice, 1);
        if (numeroCarrito) numeroCarrito.textContent = `(${carrito.length})`;

        alert("Producto eliminado: " + nombre);

        actualizarCarrito();
    };

/* ------------------------
        PAGAR AHORA
------------------------- */
document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "pagarBtn") {
        if (carrito.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        alert("¡Compra realizada con éxito! Gracias por tu compra.");

        carrito = [];
        if (numeroCarrito) numeroCarrito.textContent = "(0)";
        actualizarCarrito();
        modal.style.display = "none";
    }
});

/* MENÚ FLOTANTE */
const btnHamburguesa = document.querySelector(".fa-bars");
const menuFlotante = document.getElementById("menuFlotante"); // ✅ ESTA LÍNEA FALTABA

if (btnHamburguesa) {
    btnHamburguesa.addEventListener("click", () => {
        menuFlotante.style.display =
            menuFlotante.style.display === "block" ? "none" : "block";
    });
}
}); // DOMContentLoaded end
