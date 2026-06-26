const contenedor = document.getElementById("lista-entrenadores");

function cargarEntrenadores() {
    const entrenadores = JSON.parse(localStorage.getItem("entrenadores")) || [];

    contenedor.innerHTML = "";

    if (entrenadores.length === 0) {
        contenedor.innerHTML = `<p class="sin-entrenadores">Aún no hay entrenadores registrados. ¡Crea el primero!</p>`;
        return;
    }

    entrenadores.forEach((entrenador, indice) => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "card trainer-card";

        tarjeta.innerHTML = `
            <img src="${entrenador.foto}" alt="${entrenador.nombre}" onerror="this.src='https://placehold.co/180x180?text=Sin+Foto'">
            <div class="card-body">
                <h5>${entrenador.nombre}</h5>
                <p><strong>Sexo:</strong> ${entrenador.sexo}</p>
                <p><strong>Residencia:</strong> ${entrenador.residencia}</p>
                <button class="btn-borrar" data-indice="${indice}">Borrar</button>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });

    // Conectamos cada botón "Borrar" con el entrenador que le corresponde
    document.querySelectorAll(".btn-borrar").forEach(boton => {
        boton.addEventListener("click", () => {
            const indice = parseInt(boton.dataset.indice, 10);
            borrarEntrenador(indice);
        });
    });
}

function borrarEntrenador(indice) {
    const confirmar = confirm("¿Seguro que quieres borrar este entrenador?");
    if (!confirmar) return;

    const entrenadores = JSON.parse(localStorage.getItem("entrenadores")) || [];
    entrenadores.splice(indice, 1);
    localStorage.setItem("entrenadores", JSON.stringify(entrenadores));

    cargarEntrenadores();
}

window.addEventListener("DOMContentLoaded", cargarEntrenadores);