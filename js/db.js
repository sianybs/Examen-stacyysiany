// Gestor de Base de Datos - IndexedDB (PokedexDB)

const DB_NAME = "PokedexDB";
const DB_VERSION = 1;

function abrirBD() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("Error al abrir IndexedDB:", event);
            reject(event);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Creamos el almacén para Entrenadores
            if (!db.objectStoreNames.contains("entrenadores")) {
                db.createObjectStore("entrenadores", { keyPath: "id", autoIncrement: true });
            }
            
            // Creamos el almacén para Equipos
            if (!db.objectStoreNames.contains("equipos")) {
                db.createObjectStore("equipos", { keyPath: "id", autoIncrement: true });
            }
        };
    });
}

// Función para migrar entrenadores desde LocalStorage a IndexedDB (si existen)
function migrarDatosLocales() {
    return abrirBD().then(db => {
        const localTrainers = localStorage.getItem("entrenadores");
        if (localTrainers) {
            try {
                const list = JSON.parse(localTrainers);
                if (Array.isArray(list) && list.length > 0) {
                    const transaction = db.transaction("entrenadores", "readwrite");
                    const store = transaction.objectStore("entrenadores");
                    list.forEach(entrenador => {
                        // Quitamos cualquier ID previo para que autoIncremente
                        delete entrenador.id;
                        store.add(entrenador);
                    });
                    transaction.oncomplete = () => {
                        console.log("Migración completada con éxito.");
                        localStorage.removeItem("entrenadores");
                    };
                } else {
                    localStorage.removeItem("entrenadores");
                }
            } catch (e) {
                console.error("Error al migrar datos:", e);
            }
        }
    });
}

// === Métodos para Entrenadores ===

function obtenerEntrenadores() {
    return abrirBD().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("entrenadores", "readonly");
            const store = transaction.objectStore("entrenadores");
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e);
        });
    });
}

function agregarEntrenador(entrenador) {
    return abrirBD().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("entrenadores", "readwrite");
            const store = transaction.objectStore("entrenadores");
            const request = store.add(entrenador);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e);
        });
    });
}

function borrarEntrenadorBD(id) {
    return abrirBD().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("entrenadores", "readwrite");
            const store = transaction.objectStore("entrenadores");
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e);
        });
    });
}

function obtenerEntrenadorPorId(id) {
    return abrirBD().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("entrenadores", "readonly");
            const store = transaction.objectStore("entrenadores");
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e);
        });
    });
}

// === Métodos para Equipos ===

function obtenerEquipos() {
    return abrirBD().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("equipos", "readonly");
            const store = transaction.objectStore("equipos");
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e);
        });
    });
}

function agregarEquipo(equipo) {
    return abrirBD().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("equipos", "readwrite");
            const store = transaction.objectStore("equipos");
            const request = store.add(equipo);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e);
        });
    });
}

function borrarEquipoBD(id) {
    return abrirBD().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("equipos", "readwrite");
            const store = transaction.objectStore("equipos");
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e);
        });
    });
}

// Ejecutar migración al cargar
migrarDatosLocales();
