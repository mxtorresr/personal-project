const listaPokemon = document.querySelector("#listaPokemon");
const btnVerTodos = document.getElementById("ver-todos");
const selectTipo = document.getElementById("select-tipo");
const selectPeso = document.getElementById("select-peso");
let URL = "https://pokeapi.co/api/v2/pokemon/";

let filtroTipo = selectTipo.value;
let filtroPeso = selectPeso.value;

for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}

function filtrarPokemon() {
    listaPokemon.innerHTML = "";

    const fetchPromises = [];
    let resultadosEncontrados = false;

    for (let i = 1; i <= 151; i++) {
        fetchPromises.push(
            fetch(URL + i)
                .then((response) => response.json())
                .then(data => {
                    const tipos = data.types.map(type => type.type.name);
                    const pesoEnKilogramos = (data.weight / 10).toFixed(1);

                    const tipoCoincide = (filtroTipo === "ver-todos" || tipos.includes(filtroTipo));
                    const pesoCoincide = (filtroPeso === "50/..." || 
                        (pesoEnKilogramos >= parseFloat(filtroPeso.split('/')[0]) && pesoEnKilogramos <= parseFloat(filtroPeso.split('/')[1])));

                    if ((tipoCoincide && !filtroPeso) || (!filtroTipo && pesoCoincide)) {
                        resultadosEncontrados = true;
                        return data;
                    }

                    if (tipoCoincide && pesoCoincide) {
                        resultadosEncontrados = true;
                        return data;
                    }

                    return null;
                })
        );
    }

    Promise.all(fetchPromises)
    .then(pokemonArray => {
        const mensajeContainer = document.getElementById("mensaje-container");
        const mensajeResultado = document.getElementById("mensaje-resultado");

        if (!resultadosEncontrados) {
            mensajeResultado.innerText = "No se encontraron resultados con esas características";
            mensajeContainer.style.display = "block";
        } else {
            mensajeResultado.innerText = "";
            mensajeContainer.style.display = "none";
            pokemonArray.forEach(pokemon => {
                if (pokemon !== null) {
                    mostrarPokemon(pokemon);
                }
            });
        }
    });

}

selectTipo.addEventListener("change", (event) => {
    filtroTipo = event.target.value;
    filtrarPokemon();
});

selectPeso.addEventListener("change", (event) => {
    filtroPeso = event.target.value;
    filtrarPokemon();
});

btnVerTodos.addEventListener("click", () => {
    selectTipo.value = "ver-todos";
    selectPeso.value = "50/...";
    
    filtroTipo = selectTipo.value;
    filtroPeso = selectPeso.value;

    filtrarPokemon();
});

function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const alturaEnMetros = (poke.height / 10).toFixed(1);
    const pesoEnKilogramos = (poke.weight / 10).toFixed(1);

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${alturaEnMetros}m</p>
                <p class="stat">${pesoEnKilogramos}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}