const entrenadorSelect = document.getElementById("entrenador-select");
const pokemonBusqueda = document.getElementById("pokemon-busqueda");
const sugerenciasDiv = document.getElementById("sugerencias-pokemon");
const seleccionadosGrid = document.getElementById("pokemons-seleccionados");
const formEquipo = document.getElementById("form-equipo");

let pokemonSearchList = [];
let pokemonsSeleccionados = [];

// 1. Cargar la lista de entrenadores desde IndexedDB en el select dropdown
function cargarEntrenadoresDropdown() {
    obtenerEntrenadores().then(entrenadores => {
        entrenadorSelect.innerHTML = "";

        if (entrenadores.length === 0) {
            entrenadorSelect.innerHTML = `<option value="">Registra un entrenador primero</option>`;
            entrenadorSelect.disabled = true;
            
            // alert
            alert("No hay entrenadores registrados. Debes registrar al menos uno antes de crear un equipo.");
            return;
        }

        entrenadorSelect.disabled = false;
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.innerText = "Selecciona un entrenador...";
        entrenadorSelect.appendChild(defaultOption);

        entrenadores.forEach(entrenador => {
            const option = document.createElement("option");
            option.value = entrenador.id;
            option.innerText = entrenador.nombre;
            entrenadorSelect.appendChild(option);
        });
    }).catch(error => {
        console.error("Error al obtener entrenadores:", error);
    });
}

// 2. Cargar índice de búsqueda de Pokémon (Generaciones 1-5, ID 1 al 649)
function cargarIndicePokemon() {
   
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://pokeapi.co/api/v2/pokemon?limit=649", true);
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            try {
                const data = JSON.parse(xhr.responseText);
                pokemonSearchList = data.results.map((p, index) => {
                    return {
                        name: p.name,
                        id: index + 1
                    };
                });
            } catch (e) {
                console.error("Error al parsear índice de Pokémon:", e);
            }
        }
    };
    xhr.send();
}

// 3. Manejar el buscador de Pokémon
pokemonBusqueda.addEventListener("input", () => {
    const query = pokemonBusqueda.value.toLowerCase().trim();
    sugerenciasDiv.innerHTML = "";

    if (!query) return;

    // Filtrar Pokémon por coincidencia de nombre
    const resultados = pokemonSearchList.filter(p => p.name.includes(query)).slice(0, 5);

    resultados.forEach(p => {
        const item = document.createElement("div");
        item.className = "sugerencia-item";
        item.innerHTML = `
            <span>${p.name.toUpperCase()}</span>
            <span style="color: #888; font-size: 12px; margin-left: 8px;">#${String(p.id).padStart(3, '0')}</span>
        `;
        item.onclick = () => {
            agregarPokemon(p);
            pokemonBusqueda.value = "";
            sugerenciasDiv.innerHTML = "";
        };
        sugerenciasDiv.appendChild(item);
    });
});


document.addEventListener("click", (e) => {
    if (e.target !== pokemonBusqueda && e.target !== sugerenciasDiv) {
        sugerenciasDiv.innerHTML = "";
    }
});

// 4. Agregar Pokémon al equipo (máximo 6)
function agregarPokemon(p) {
    if (pokemonsSeleccionados.length >= 6) {
        alert("¡Tu equipo ya está completo! (Máximo 6 Pokémones)");
        return;
    }

    // Evitar duplicados
    const yaExiste = pokemonsSeleccionados.some(sel => sel.id === p.id);
    if (yaExiste) {
        alert("Este Pokémon ya ha sido agregado al equipo.");
        return;
    }

    // Construir la URL oficial de la imagen para guardarla directamente
    const paddedId = String(p.id).padStart(3, '0');
    const fotoUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`;

    pokemonsSeleccionados.push({
        id: p.id,
        nombre: p.name,
        foto: fotoUrl
    });

    actualizarListaVisual();
}

// 5. Eliminar Pokémon del equipo
function eliminarPokemon(id) {
    pokemonsSeleccionados = pokemonsSeleccionados.filter(p => p.id !== id);
    actualizarListaVisual();
}

// 6. Actualizar la cuadrícula de seleccionados
function actualizarListaVisual() {
    seleccionadosGrid.innerHTML = "";

    pokemonsSeleccionados.forEach(p => {
        const card = document.createElement("div");
        card.className = "pokemon-seleccionado-card";

        card.innerHTML = `
            <img src="${p.foto}" alt="${p.nombre}" onerror="this.src='https://placehold.co/80x80?text=Error'">
            <span class="capitalize">${p.nombre}</span>
            <button type="button" class="btn-quitar-poke" onclick="eliminarPokemon(${p.id})">&times;</button>
        `;

        seleccionadosGrid.appendChild(card);
    });
}

// 7. Guardar equipo en IndexedDB
formEquipo.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("nombre-equipo").value.trim();
    const foto = document.getElementById("imagen-equipo").value.trim();
    const entrenadorId = entrenadorSelect.value;

    if (!entrenadorId) {
        alert("Por favor selecciona un entrenador a cargo.");
        return;
    }

    if (pokemonsSeleccionados.length === 0) {
        alert("Por favor agrega al menos un Pokémon a tu equipo.");
        return;
    }

    const nuevoEquipo = {
        nombre: nombre,
        foto: foto,
        entrenadorId: entrenadorId,
        pokemons: pokemonsSeleccionados
    };

    agregarEquipo(nuevoEquipo).then(() => {
        window.location.href = "equipos.html";
    }).catch(error => {
        console.error("Error al guardar el equipo:", error);
        alert("Ocurrió un error al intentar guardar el equipo.");
    });
});

// Inicialización de la vista
window.addEventListener("DOMContentLoaded", () => {
    cargarEntrenadoresDropdown();
    cargarIndicePokemon();
});
