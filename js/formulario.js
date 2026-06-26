const formulario = document.getElementById("form-entrenador");
const galeria = document.getElementById("galeria-fotos");
const fotoInput = document.getElementById("foto");


const fotosDisponibles = [
    "https://play.pokemonshowdown.com/sprites/trainers/red.png",      
    "https://play.pokemonshowdown.com/sprites/trainers/misty.png",    
    "https://play.pokemonshowdown.com/sprites/trainers/brock.png",    
    "https://play.pokemonshowdown.com/sprites/trainers/ash.png",      
    "https://play.pokemonshowdown.com/sprites/trainers/serena.png",   
    "https://play.pokemonshowdown.com/sprites/trainers/dawn.png",     
    "https://play.pokemonshowdown.com/sprites/trainers/leaf.png",     
    "https://play.pokemonshowdown.com/sprites/trainers/blue.png",     
    "https://play.pokemonshowdown.com/sprites/trainers/lucas.png",    
          
];

function cargarGaleria() {
    galeria.innerHTML = "";

    fotosDisponibles.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        img.className = "foto-opcion";

        img.onclick = () => seleccionarFoto(img, url);

        galeria.appendChild(img);
    });
}


function seleccionarFoto(imgElemento, url) {
    document.querySelectorAll(".foto-opcion").forEach(img => img.classList.remove("seleccionada"));

    imgElemento.classList.add("seleccionada");
    fotoInput.value = url;
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!fotoInput.value) {
        alert("Por favor elige una foto para el entrenador.");
        return;
    }

    const nuevoEntrenador = {
        nombre: document.getElementById("nombre").value.trim(),
        sexo: document.getElementById("sexo").value,
        residencia: document.getElementById("residencia").value.trim(),
        foto: fotoInput.value
    };

    // Guardamos en IndexedDB en lugar de localStorage
    agregarEntrenador(nuevoEntrenador).then(() => {
        window.location.href = "entrenadores.html";
    }).catch(error => {
        console.error("Error al guardar entrenador:", error);
        alert("Hubo un error al guardar el entrenador. Intente de nuevo.");
    });
});

window.addEventListener("DOMContentLoaded", cargarGaleria);