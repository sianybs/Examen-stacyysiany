
        const selector = document.getElementById('generaciones');
        const contenedor = document.getElementById('pokemon-content');
        const searchInput = document.getElementById('pokemon-search');
        
        let pokemonListCache = []; 

        
        function padId(id) {
            return String(id).padStart(3, '0');
        }

       
        function padGen(gen) {
            return String(gen).padStart(2, '0');
        }

       
        function getGenFromId(id) {
            if (id <= 151) return 1;
            if (id <= 251) return 2;
            if (id <= 386) return 3;
            if (id <= 493) return 4;
            return 5;
        }

       
        function handleImageError(imgElement, name, id) {
          
            const paddedId = padId(id);
            const secondaryUrl = `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${paddedId}.png`;
            
            if (imgElement.src !== secondaryUrl) {
                imgElement.src = secondaryUrl;
            } else {
                
                imgElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                imgElement.onerror = () => {
                    
                    imgElement.src = "https://placehold.co/120x120?text=No+Image";
                };
            }
        }

      
        function mostrarCargando() {
            contenedor.innerHTML = `
                <div class="spinner-container" id="loading-spinner">
                    <div class="pokeball-spinner"></div>
                    <div class="loading-text">Cargando Pokémon...</div>
                </div>
            `;
        }

        
        function mostrarError(mensaje, retryCallback) {
            contenedor.innerHTML = `
                <div class="error-view" id="error-alert">
                    <h4><i class="fa-solid fa-triangle-exclamation"></i> Error de Conexión</h4>
                    <p>${mensaje}</p>
                    <button class="btn-retry" id="btn-retry">Reintentar</button>
                </div>
            `;
            const btnRetry = document.getElementById('btn-retry');
            if (btnRetry) {
                btnRetry.onclick = retryCallback;
            }
        }

        
        function cargarGeneracion(offset, limit) {
            mostrarCargando();
            searchInput.value = ""; 

            
            const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
            
          
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 400) {
                    try {
                        const datos = JSON.parse(xhr.responseText);
                        
                        
                        pokemonListCache = datos.results.map(pokemon => {
                            const parts = pokemon.url.split('/');
                            const id = parseInt(parts[parts.length - 2], 10);
                            return {
                                name: pokemon.name,
                                id: id,
                                url: pokemon.url
                            };
                        });
                        
                       
                        renderPokemonCards(pokemonListCache);
                    } catch (error) {
                        console.error("Error parsing response JSON:", error);
                        mostrarError("No se pudieron procesar los datos de los Pokémon.", () => cargarGeneracion(offset, limit));
                    }
                } else {
                    console.error("HTTP error code returned:", xhr.status);
                    mostrarError("Error al obtener los Pokémon del servidor (Código " + xhr.status + ").", () => cargarGeneracion(offset, limit));
                }
            };
            
            xhr.onerror = function() {
                console.error("Network error occurred during XMLHttpRequest");
                mostrarError("No se pudo establecer conexión con PokeAPI. Revisa tu conexión a internet.", () => cargarGeneracion(offset, limit));
            };
            
            xhr.send();
        }

        
        function renderPokemonCards(lista) {
            contenedor.innerHTML = "";
            
            if (lista.length === 0) {
                contenedor.innerHTML = `<div class="text-center py-5 w-100 text-muted">No se encontraron Pokémon que coincidan con la búsqueda.</div>`;
                return;
            }

            lista.forEach(pokemon => {
              
                const urlImagen = `https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/${pokemon.name}.png`;
                const paddedIdStr = padId(pokemon.id);

             
                const tarjeta = document.createElement('div');
                tarjeta.className = "card";
                tarjeta.id = `pokemon-card-${pokemon.id}`;
                
                
                tarjeta.onclick = function() {
                    mostrarDetalles(pokemon.id);
                };

                tarjeta.innerHTML = `
                    <span class="card-number">#${paddedIdStr}</span>
                    <img src="${urlImagen}" alt="${pokemon.name}" onerror="handleImageError(this, '${pokemon.name}', ${pokemon.id})">
                    <div class="card-body p-0">
                        <p class="card-text">${pokemon.name.replace('-', ' ')}</p>
                    </div>
                `;

                contenedor.appendChild(tarjeta);
            });
        }

       
        function mostrarDetalles(pokemonId) {
         
            const modalElement = document.getElementById('pokemonDetailModal');
            const modalContainer = document.getElementById('modal-container-content');
            const bsModal = new bootstrap.Modal(modalElement);
            
           
            modalContainer.innerHTML = `
                <div class="modal-body text-center py-5">
                    <div class="pokeball-spinner mx-auto"></div>
                    <div class="loading-text mt-3">Obteniendo detalles del Pokémon...</div>
                </div>
            `;
            
            bsModal.show();

            
            const detailUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
            const xhr = new XMLHttpRequest();
            xhr.open('GET', detailUrl, true);
            
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 400) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        
                        // Parse values
                        const name = data.name;
                        const id = data.id;
                        const gen = getGenFromId(id);
                        const weightKg = (data.weight / 10).toFixed(1); // PokeAPI weight is in hectograms
                        const heightM = (data.height / 10).toFixed(1); // PokeAPI height is in decimeters
                        
                        
                        const types = data.types.map(t => t.type.name).join(' - ');
                        
                       
                        const abilities = data.abilities.map(a => a.ability.name.replace('-', ' ')).join(' - ');
                        
                        
                        const moves = data.moves.slice(0, 6).map(m => m.move.name.replace('-', ' ')).join(' - ');
                        
                        
                        const paddedId = padId(id);
                        const officialImageUrl = `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${paddedId}.png`;
                        
                        
                        modalContainer.innerHTML = `
                            <div class="modal-header-banner">
                                <h2 id="modal-pokemon-name">${name}</h2>
                                <button type="button" class="btn-close-custom" data-bs-dismiss="modal" aria-label="Close" id="btn-close-modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div class="detail-grid">
                                    <div class="detail-image-container">
                                        <!-- Main details image with PokeDB image fallback -->
                                        <img src="${officialImageUrl}" alt="${name}" onerror="this.src='https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/${name}.png'">
                                    </div>
                                    <div class="detail-info">
                                        <div class="info-item">
                                            <span class="info-label">Generation:</span>
                                            <span class="info-value">${padGen(gen)}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">Pokémon ID:</span>
                                            <span class="info-value">#${paddedId}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">Weight:</span>
                                            <span class="info-value">${weightKg} kgs</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">Height:</span>
                                            <span class="info-value">${heightM} mts</span>
                                        </div>
                                        
                                        <h4>Types:</h4>
                                        <div class="info-value capitalize">${types}</div>
                                        
                                        <h4>Abilities:</h4>
                                        <div class="info-value capitalize">${abilities}</div>
                                        
                                        <h4>Moves:</h4>
                                        <div class="info-value capitalize">${moves || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        `;
                    } catch (error) {
                        console.error("Error parsing details JSON:", error);
                        modalContainer.innerHTML = `
                            <div class="modal-body text-center py-4">
                                <i class="fa-solid fa-circle-exclamation text-danger fs-1 mb-3"></i>
                                <h4>Error</h4>
                                <p>No se pudo procesar la información detallada.</p>
                                <button class="btn btn-secondary mt-3" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        `;
                    }
                } else {
                    console.error("HTTP error loading details:", xhr.status);
                    modalContainer.innerHTML = `
                        <div class="modal-body text-center py-4">
                            <i class="fa-solid fa-circle-exclamation text-danger fs-1 mb-3"></i>
                            <h4>Error de Servidor</h4>
                            <p>No se pudo obtener la información (Código ${xhr.status}).</p>
                            <button class="btn btn-secondary mt-3" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    `;
                }
            };
            
            xhr.onerror = function() {
                console.error("Network error on loading details");
                modalContainer.innerHTML = `
                    <div class="modal-body text-center py-4">
                        <i class="fa-solid fa-wifi text-danger fs-1 mb-3"></i>
                        <h4>Error de Conexión</h4>
                        <p>Por favor revisa tu conexión de red.</p>
                        <button class="btn btn-secondary mt-3" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                `;
            };
            
            xhr.send();
        }

      
        searchInput.addEventListener('input', (evento) => {
            const query = evento.target.value.toLowerCase().trim();
            if (query === "") {
                renderPokemonCards(pokemonListCache);
            } else {
                const filtrados = pokemonListCache.filter(pokemon => {
                    return pokemon.name.toLowerCase().includes(query) || String(pokemon.id).includes(query);
                });
                renderPokemonCards(filtrados);
            }
        });

       
        selector.addEventListener('change', (evento) => {
            const valores = evento.target.value.split(',');
            const offset = valores[0];
            const limit = valores[1];
            
            cargarGeneracion(offset, limit);
        });

   
        window.addEventListener('DOMContentLoaded', () => {
            cargarGeneracion(0, 151);
        });
    