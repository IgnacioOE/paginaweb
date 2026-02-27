const api = "https://pokeapi.co/api/v2/pokemon/oshawott";

fetch(api)
    .then(response => {
        if (!response.ok) {
            throw new Error('La respuesta de la red no fue ok');
        }
        return response.json();
    })
    .then(data => {
        const nameElement = document.getElementById('pokemonName');
        const typeElement = document.getElementById('pokemonType');
        const imageElement = document.getElementById('pokemonImage');
        const idElement = document.getElementById('pokemonId');
        const abilitiesElement = document.getElementById('pokemonAbilities');
        const statsElement = document.getElementById('pokemonStats');

        const name = data.name;
        const id = data.id;

        const formatText = (text) => text.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

        const types = data.types.map(typeInfo => formatText(typeInfo.type.name)).join(', ');
        const abilities = data.abilities.map(abilityInfo => formatText(abilityInfo.ability.name)).join(', ');
        const stats = data.stats.map(statInfo => `<p><strong>${formatText(statInfo.stat.name)}:</strong> ${statInfo.base_stat}</p>`).join('');
        const image = data.sprites.other.home.front_default;

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
        }

        console.log(`Nombre: ${name}, Tipos: ${types}, Imagen: ${image}`);
    })
    .catch(error => {
        console.error('Hubo un problema con la petición fetch:', error);
        document.getElementById('pokemonName').textContent = 'Error al cargar';
    });