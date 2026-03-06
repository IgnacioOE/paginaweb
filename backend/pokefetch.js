const listContainer = document.getElementById('catalogList');
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');

let allPokemon = []; 
let typeMap = {};

function fetchPokemonList() {
    fetch('https://pokeapi.co/api/v2/pokemon-species?limit=1025')
        .then(response => response.json())
        .then(data => {
            allPokemon = data.results.map((pokemon, index) => {
                return {
                    name: pokemon.name,
                    id: index + 1,
                    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
                };
            });
            renderCatalog(allPokemon);
        })
        .catch(error => {
            console.error('Error al cargar la lista:', error);
            if (listContainer) listContainer.innerHTML = '<p>Error al cargar la lista.</p>';
        });
}

function fetchTypes() {
    fetch('https://pokeapi.co/api/v2/type')
        .then(response => response.json())
        .then(data => {
            const validTypes = data.results.filter(t => !["unknown", "stellar", "shadow"].includes(t.name)); // sólo tipos que corresponden a los pokemones
            
            validTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.name;
                option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
                typeFilter.appendChild(option);
            });
        });
}

function renderCatalog(pokemonList) {
    if (!listContainer) return;
    listContainer.innerHTML = '';
    
    if (pokemonList.length === 0) {
        listContainer.innerHTML = '<p style="grid-column: 1 / -1;">No se encontraron Pokémon.</p>';
        return;
    }

    pokemonList.forEach(pokemon => {
        const item = document.createElement('div');
        item.className = 'catalog-item';
        
        item.innerHTML = `
            <img src="${pokemon.imageUrl}" alt="${pokemon.name}">
            <br>
            <p style="margin: 5px; font-size: 0.8em; color: #888;">N° ${pokemon.id}</p>
            <strong>${pokemon.name}</strong>
        `;

        item.addEventListener('click', () => fetchPokemonData(pokemon.id));
        listContainer.appendChild(item);
    });
}

async function filterPokemon() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedType = typeFilter.value;

    let filtered = allPokemon;

    if (selectedType) {
        if (!typeMap[selectedType]) {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
                const data = await response.json();
                typeMap[selectedType] = data.pokemon.map(p => p.pokemon.name);
            } catch (error) {
                console.error("Error cargando tipo", error);
            }
        }
        
        if (typeMap[selectedType]) {
            filtered = filtered.filter(p => typeMap[selectedType].includes(p.name));
        }
    }

    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.includes(searchTerm) || 
            p.id.toString() === searchTerm
        );
    }

    renderCatalog(filtered);
}

// Escuchadores de eventos para los filtros
if (searchInput) searchInput.addEventListener('input', filterPokemon);
if (typeFilter) typeFilter.addEventListener('change', filterPokemon);


function fetchPokemonData(pokemonName) {
    const api = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    fetch(api)
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta de la API');
            return response.json();
        })
        .then(data => {
            const nameElement = document.getElementById('pokemonName');
            const typeElement = document.getElementById('pokemonType');
            const imageElement = document.getElementById('pokemonImage');
            const idElement = document.getElementById('pokemonId');
            const abilitiesElement = document.getElementById('pokemonAbilities');
            const statsElement = document.getElementById('pokemonStats');

            const name = data.species.name;
            const id = data.id;

            const formatText = (text) => text.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

            const types = data.types.map(typeInfo => formatText(typeInfo.type.name)).join(', ');
            const abilities = data.abilities.map(abilityInfo => formatText(abilityInfo.ability.name)).join(', ');
            const stats = data.stats.map(statInfo => `<p style="margin: 15px;"><strong>${formatText(statInfo.stat.name)}:</strong> ${statInfo.base_stat}</p>`).join('');
            const image = data.sprites.other.home.front_default || data.sprites.front_default;

            nameElement.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            typeElement.textContent = types;
            idElement.textContent = id;
            abilitiesElement.textContent = abilities;
            statsElement.innerHTML = stats;

            if (image) {
                imageElement.src = image;
                imageElement.style.display = 'block';
            } else {
                imageElement.alt = 'No se encontró imagen';
                imageElement.style.display = 'none';
            }
            
            const card = document.getElementById('PokemonCard');
            if (card) {
                card.style.display = 'flex';
            }
        })
        .catch(error => {
            console.error('Hubo un problema con la petición fetch:', error);
            document.getElementById('pokemonName').textContent = 'Error al cargar';
        });
}

const urlParams = new URLSearchParams(window.location.search);
const initialPokemon = urlParams.get('name');

fetchPokemonList();
fetchTypes();

if (initialPokemon) {
    fetchPokemonData(initialPokemon);
}