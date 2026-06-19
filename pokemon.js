const generaciones = {
    primera: [1, 151],
    segunda: [152, 251],
    tercera: [252, 386],
    cuarta: [387, 493],
    quinta: [494, 649]
};

const select = document.getElementById("generaciones");
const contenido = document.getElementById("contenido");

// Carga la primera generación al abrir la página
cargarPokemon("primera");

// Cuando cambia el select
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
                <div class="card" style="width: 18rem;">
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