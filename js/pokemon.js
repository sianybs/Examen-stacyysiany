const generaciones = {
    primera: [1, 151],
    segunda: [152, 251],
    tercera: [252, 386],
    cuarta: [387, 493],
    quinta: [494, 649]
};

const select = document.getElementById("generaciones");
const contenido = document.getElementById("contenido");


cargarPokemon("primera");


select.addEventListener("change", () => {
    cargarPokemon(select.value);
});

async function cargarPokemon(generacion) {
    contenido.innerHTML = "<h2>Cargando...</h2>";

    const [inicio, fin] = generaciones[generacion];

    contenido.innerHTML = "";

    for (let i = inicio; i <= fin; i++) {
        try {
            const respuesta = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${i}`
            );

            const pokemon = await respuesta.json();

            
            contenido.innerHTML += `
                <div class="card" style="width: 18rem;" onclick="verDetalle(${pokemon.id})">
                    <img
                        src="${pokemon.sprites.other['official-artwork'].front_default}"
                        class="card-img-top"
                        alt="${pokemon.name}"
                    >

                    <div class="card-body">
                        <h5>${pokemon.name.toUpperCase()}</h5>
                        <p>N.º ${pokemon.id}</p>
                        <p>Tipo: ${pokemon.types[0].type.name}</p>
                    </div>
                </div>
            `;
        } catch (error) {
            console.log("Error al cargar el Pokémon", i);
        }
    }
}


function verDetalle(id) {
    const detalleDiv = document.getElementById("detalle");
    

    detalleDiv.innerHTML = `
        <div class="detalle-modal-content">
            <div class="detalle-header">
                <h2>Cargando...</h2>
                <span class="cerrar-btn" onclick="cerrarDetalle()">&times;</span>
            </div>
            <div class="detalle-body text-center" style="display:block;">
                <p>Cargando detalles del Pokémon...</p>
            </div>
        </div>
    `;
    detalleDiv.classList.add("activo");

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/${id}`, true);
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            try {
                const pokemon = JSON.parse(xhr.responseText);

               
                const paddedId = String(pokemon.id).padStart(3, '0');

                let genStr = "05";
                if (pokemon.id <= 151) genStr = "01";
                else if (pokemon.id <= 251) genStr = "02";
                else if (pokemon.id <= 386) genStr = "03";
                else if (pokemon.id <= 493) genStr = "04";

               
                const weightKg = (pokemon.weight / 10).toFixed(1);
                const heightM = (pokemon.height / 10).toFixed(1);

    
                const typesStr = pokemon.types.map(t => t.type.name).join(' - ');
                const abilitiesStr = pokemon.abilities.map(a => a.ability.name.replace('-', ' ')).join(' - ');
                
               
                const movesStr = pokemon.moves.slice(0, 6).map(m => m.move.name.replace('-', ' ')).join(' - ');

             
                detalleDiv.innerHTML = `
                    <div class="detalle-modal-content">
                        <div class="detalle-header">
                            <h2>${pokemon.name.toUpperCase()}</h2>
                            <span class="cerrar-btn" onclick="cerrarDetalle()">&times;</span>
                        </div>
                        <div class="detalle-body">
                            <div class="detalle-img">
                                <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" alt="${pokemon.name}">
                            </div>
                            <div class="detalle-info">
                                <p><strong>Generation:</strong> ${genStr}</p>
                                <p><strong>Pokémon ID:</strong> #${paddedId}</p>
                                <p><strong>Weight:</strong> ${weightKg} kgs</p>
                                <p><strong>Height:</strong> ${heightM} mts</p>
                                
                                <h4>Types:</h4>
                                <p class="capitalize">${typesStr}</p>
                                
                                <h4>Abilities:</h4>
                                <p class="capitalize">${abilitiesStr}</p>
                                
                                <h4>Moves:</h4>
                                <p class="capitalize">${movesStr || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                `;
            } catch (e) {
                console.error("Error al procesar el JSON:", e);
                detalleDiv.innerHTML = `
                    <div class="detalle-modal-content">
                        <div class="detalle-header">
                            <h2>Error</h2>
                            <span class="cerrar-btn" onclick="cerrarDetalle()">&times;</span>
                        </div>
                        <div class="detalle-body text-center" style="display:block;">
                            <p>No se pudo procesar la información del Pokémon.</p>
                        </div>
                    </div>
                `;
            }
        } else {
            detalleDiv.innerHTML = `
                <div class="detalle-modal-content">
                    <div class="detalle-header">
                        <h2>Error</h2>
                        <span class="cerrar-btn" onclick="cerrarDetalle()">&times;</span>
                    </div>
                    <div class="detalle-body text-center" style="display:block;">
                        <p>No se pudo cargar la información (Código ${xhr.status}).</p>
                    </div>
                </div>
            `;
        }
    };

    xhr.onerror = function() {
        detalleDiv.innerHTML = `
            <div class="detalle-modal-content">
                <div class="detalle-header">
                    <h2>Error de Red</h2>
                    <span class="cerrar-btn" onclick="cerrarDetalle()">&times;</span>
                </div>
                <div class="detalle-body text-center" style="display:block;">
                    <p>Por favor revisa tu conexión a internet.</p>
                </div>
            </div>
        `;
    };

    xhr.send();
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
