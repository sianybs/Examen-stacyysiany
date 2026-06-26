const contenedor = document.getElementById("lista-entrenadores");

function cargarEntrenadores() {
    obtenerEntrenadores().then(entrenadores => {
        contenedor.innerHTML = "";

        if (entrenadores.length === 0) {
            contenedor.innerHTML = `<p class="sin-entrenadores">Aún no hay entrenadores registrados. ¡Crea el primero!</p>`;
            return;
        }

        entrenadores.forEach((entrenador) => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "card trainer-card";

            tarjeta.innerHTML = `
                <img src="${entrenador.foto}" alt="${entrenador.nombre}" onerror="this.src='https://placehold.co/180x180?text=Sin+Foto'">
                <div class="card-body">
                    <h5>${entrenador.nombre}</h5>
                    <p><strong>Sexo:</strong> ${entrenador.sexo}</p>
                    <p><strong>Residencia:</strong> ${entrenador.residencia}</p>
                    <button class="btn-borrar" data-id="${entrenador.id}">Borrar</button>
                </div>
            `;

            contenedor.appendChild(tarjeta);
        });

        // Conectamos cada botón "Borrar" con el entrenador que le corresponde en IndexedDB
        document.querySelectorAll(".btn-borrar").forEach(boton => {
            boton.addEventListener("click", () => {
                const id = parseInt(boton.dataset.id, 10);
                borrarEntrenador(id);
            });
        });
    }).catch(error => {
        console.error("Error al cargar entrenadores:", error);
    });
}

function borrarEntrenador(id) {
    const confirmar = confirm("¿Seguro que quieres borrar este entrenador?");
    if (!confirmar) return;

    borrarEntrenadorBD(id).then(() => {
        cargarEntrenadores();
    }).catch(error => {
        console.error("Error al borrar entrenador:", error);
    });
}

window.addEventListener("DOMContentLoaded", cargarEntrenadores);