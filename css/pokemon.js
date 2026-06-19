const generaciones = {
    primera: [1, 151],
    segunda: [152, 251],
    tercera: [252, 386],
    cuarta: [387, 493],
    quinta: [494, 649]
};

const select = document.getElementById("generaciones");
const contenido = document.getElementById("contenido");
const detalle = document.getElementById("detalle");

// cargar primera generación al inicio
cargarPokemon("primera");

select.addEventListener("change", () => {
    cargarPokemon(select.value);
});

async function cargarPokemon(generacion) {

    contenido.innerHTML = "";
    detalle.innerHTML = "";

    const [inicio, fin] = generaciones[generacion];

    for (let i = inicio; i <= fin; i++) {

        try {
            const respuesta = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${i}`
            );

            const pokemon = await respuesta.json();

            const tarjeta = document.createElement("div");
            tarjeta.classList.add("card");

            tarjeta.innerHTML = `
                <img
                    src="${pokemon.sprites.other['official-artwork'].front_default}"
                    alt="${pokemon.name}"
                    width="180"
                >

                <div class="card-body">
                    <h4>${pokemon.name.toUpperCase()}</h4>
                    <p>N.º ${pokemon.id}</p>
                </div>
            `;

            // CLICK FUNCIONA AQUÍ 👇
            tarjeta.addEventListener("click", () => {
                mostrarDetalle(pokemon);
            });

            contenido.appendChild(tarjeta);

        } catch (error) {
            console.log("Error con Pokémon:", i);
        }
    }
}

function mostrarDetalle(pokemon) {

    const tipos = pokemon.types
        .map(t => t.type.name)
        .join(", ");

    const habilidades = pokemon.abilities
        .map(h => h.ability.name)
        .join(", ");

    detalle.innerHTML = `
        <h2>${pokemon.name.toUpperCase()}</h2>

        <img
            src="${pokemon.sprites.other['official-artwork'].front_default}"
            width="250"
        >

        <p><strong>Número:</strong> ${pokemon.id}</p>
        <p><strong>Tipo:</strong> ${tipos}</p>
        <p><strong>Altura:</strong> ${pokemon.height}</p>
        <p><strong>Peso:</strong> ${pokemon.weight}</p>
        <p><strong>Habilidades:</strong> ${habilidades}</p>
    `;
}