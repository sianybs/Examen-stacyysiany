const contenedor = document.getElementById("lista-equipos");

function cargarEquipos() {
    obtenerEquipos().then(equipos => {
        contenedor.innerHTML = "";

        if (equipos.length === 0) {
            contenedor.innerHTML = `<p class="sin-entrenadores">Aún no hay equipos Pokémon registrados. ¡Crea el primero!</p>`;
            return;
        }

        equipos.forEach(equipo => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "card team-card";
            tarjeta.onclick = () => verDetalleEquipo(equipo);

            tarjeta.innerHTML = `
                <img src="${equipo.foto}" alt="${equipo.nombre}" onerror="this.src='https://placehold.co/180x180?text=Sin+Imagen'">
                <div class="card-body">
                    <h5>${equipo.nombre}</h5>
                    <p><strong>Pokémones:</strong> ${equipo.pokemons.length} / 6</p>
                    <button class="btn-borrar-team" data-id="${equipo.id}">Borrar</button>
                </div>
            `;

            contenedor.appendChild(tarjeta);
        });

       
        document.querySelectorAll(".btn-borrar-team").forEach(boton => {
            boton.addEventListener("click", (e) => {
                e.stopPropagation(); // Evitamos que se abra el modal de detalle
                const id = parseInt(boton.dataset.id, 10);
                borrarEquipo(id);
            });
        });
    }).catch(error => {
        console.error("Error al obtener equipos:", error);
    });
}

function borrarEquipo(id) {
    const confirmar = confirm("¿Seguro que quieres borrar este equipo?");
    if (!confirmar) return;

    borrarEquipoBD(id).then(() => {
        cargarEquipos();
    }).catch(error => {
        console.error("Error al borrar equipo:", error);
    });
}

function verDetalleEquipo(equipo) {
    const detalleDiv = document.getElementById("detalle");
    
    detalleDiv.innerHTML = `
        <div class="detalle-modal-content" style="max-width: 750px;">
            <div class="detalle-header">
                <h2>Cargando Detalles...</h2>
                <span class="cerrar-btn" onclick="cerrarDetalle()">&times;</span>
            </div>
            <div class="detalle-body text-center" style="display:block;">
                <p>Cargando información del equipo...</p>
            </div>
        </div>
    `;
    detalleDiv.classList.add("activo");

    
    obtenerEntrenadorPorId(parseInt(equipo.entrenadorId, 10)).then(entrenador => {
        let entrenadorHtml = `
            <div class="detalle-trainer-info">
                <p class="text-danger"><strong>Entrenador no encontrado</strong> (ID: ${equipo.entrenadorId})</p>
            </div>
        `;

        if (entrenador) {
            entrenadorHtml = `
                <div class="detalle-trainer-profile">
                    <img class="modal-trainer-foto" src="${entrenador.foto}" alt="${entrenador.nombre}" onerror="this.src='https://placehold.co/100x100?text=Sin+Foto'">
                    <div class="modal-trainer-datos">
                        <h5>${entrenador.nombre}</h5>
                        <p><strong>Sexo:</strong> ${entrenador.sexo}</p>
                        <p><strong>Lugar Residencia:</strong> ${entrenador.residencia}</p>
                    </div>
                </div>
            `;
        }

       
        let pokemonsHtml = `<div class="modal-pokemons-grid">`;
        if (equipo.pokemons.length === 0) {
            pokemonsHtml += `<p class="sin-pokemons">Este equipo no tiene Pokémones asignados.</p>`;
        } else {
            equipo.pokemons.forEach(poke => {
                pokemonsHtml += `
                    <div class="modal-poke-card">
                        <img src="${poke.foto}" alt="${poke.nombre}" onerror="this.src='https://placehold.co/80x80?text=?'">
                        <span class="capitalize">${poke.nombre}</span>
                    </div>
                `;
            });
        }
        pokemonsHtml += `</div>`;

        detalleDiv.innerHTML = `
            <div class="detalle-modal-content" style="max-width: 750px;">
                <div class="detalle-header">
                    <h2>${equipo.nombre.toUpperCase()}</h2>
                    <span class="cerrar-btn" onclick="cerrarDetalle()">&times;</span>
                </div>
                <div class="detalle-body" style="display: flex; flex-direction: column; gap: 20px;">
                    
                    <div class="detalle-team-top" style="display: flex; flex-direction: column; gap: 15px; border-bottom: 2px solid #ccc; padding-bottom: 15px;">
                        <div>
                            <h4>Imagen del Grupo:</h4>
                            <img src="${equipo.foto}" alt="${equipo.nombre}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px;" onerror="this.style.display='none'">
                        </div>
                        
                        <div>
                            <h4>Entrenador Encargado:</h4>
                            ${entrenadorHtml}
                        </div>
                    </div>

                    <div>
                        <h4>Pokémones del Equipo (${equipo.pokemons.length} de 6):</h4>
                        ${pokemonsHtml}
                    </div>

                </div>
            </div>
        `;
    }).catch(err => {
        console.error("Error al obtener detalles del equipo:", err);
        detalleDiv.innerHTML = `
            <div class="detalle-modal-content">
                <div class="detalle-header">
                    <h2>Error</h2>
                    <span class="cerrar-btn" onclick="cerrarDetalle()">&times;</span>
                </div>
                <div class="detalle-body text-center" style="display:block;">
                    <p>Error al cargar los detalles del equipo.</p>
                </div>
            </div>
        `;
    });
}

function cerrarDetalle() {
    const detalleDiv = document.getElementById("detalle");
    detalleDiv.classList.remove("activo");
    detalleDiv.innerHTML = "";
}


window.addEventListener("click", (evento) => {
    const detalleDiv = document.getElementById("detalle");
    if (evento.target === detalleDiv) {
        cerrarDetalle();
    }
});

window.addEventListener("DOMContentLoaded", cargarEquipos);
