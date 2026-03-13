document.addEventListener("DOMContentLoaded", function() {
    const cardHTML = `
        <div id="PokemonCard" class="card">
            <div class="card-content">
                <span class="close-btn" id="closeCard">&times;</span>
                <h2>Información del Pokémon</h2>
                <p><strong>N° Pokedex:</strong> <span id="pokemonId"></span></p>
                <p><strong>Nombre:</strong> <span id="pokemonName">Cargando...</span></p>
                <p><strong>Tipo:</strong> <span id="pokemonType"></span></p>
                <p><strong>Habilidades:</strong> <span id="pokemonAbilities"></span></p>
                <button id="choosePokemonBtn" style="margin-top: 15px; padding: 10px 20px; font-size: 1.1em; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Elegir Pokémon</button>
            
                <div class="stats-row">
                    <img id="pokemonImage" src="" alt="Imagen" style="display: none;">
                    <div>
                        <strong style="font-size: 1.3em;">Stats</strong> <span id="pokemonStats"></span>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .card {
                display: none;
                position: fixed;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                align-items: center;
                justify-content: center;
            }
            .card-content {
                background: white;
                border-radius: 15px;
                padding: 20px;
                width: 520px;
                text-align: center;
                position: relative;
            }
            .close-btn {
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 24px;
                cursor: pointer;
                color: red;
            }
            .close-btn:hover {
                color: #000;
            }
            #pokemonImage {
                max-width: 300px;
                width: 100%;
                height: auto;
            }
            .stats-row {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px; 
                margin-top: 20px;
                text-align: left;
            }
        </style>
    `;

    document.body.insertAdjacentHTML('beforeend', cardHTML);

    const card = document.getElementById('PokemonCard');
    const closeCardBtn = document.getElementById('closeCard');
    const choosePokemonBtn = document.getElementById('choosePokemonBtn');
    const battleButton = document.getElementById('battleButton');

    window.chosenPokemonForBattle = window.chosenPokemonForBattle || [];

    choosePokemonBtn.addEventListener('click', () => {
        const id = document.getElementById('pokemonId').textContent;
        const name = document.getElementById('pokemonName').textContent;
        const image = document.getElementById('pokemonImage').src;


        if (window.chosenPokemonForBattle.find(p => p.id === id)) {
            alert(name + " ya está elegido para la batalla.");
            return;
        }

        if (window.chosenPokemonForBattle.length < 2) {
            window.chosenPokemonForBattle.push({ id, name, image });
            console.log("Elegido:", name, window.chosenPokemonForBattle);
            alert("Has elegido a " + name + " para la batalla!");
            
            if (battleButton) {
                battleButton.textContent = "Batalla (" + window.chosenPokemonForBattle.length + "/2)";
                if (window.chosenPokemonForBattle.length === 2) {
                    battleButton.disabled = false;
                    battleButton.style.backgroundColor = "#e01818";
                    battleButton.style.cursor = "pointer";
                    battleButton.textContent = "Iniciar Batalla";
                }
            }
            card.style.display = 'none';
        } else {
            alert("Ya has elegido 2 Pokémon.");
        }
    });

    if (battleButton) {
        battleButton.addEventListener('click', () => {
            if (window.chosenPokemonForBattle.length === 2) {
                localStorage.setItem('battlePokemon', JSON.stringify(window.chosenPokemonForBattle));

                // Reiniciar para la siguiente batalla
                window.chosenPokemonForBattle = [];
                battleButton.textContent = "Batalla (0/2)";
                battleButton.disabled = true;
                battleButton.style.backgroundColor = "#ccc";
                battleButton.style.cursor = "not-allowed";

                window.location.href = 'battle.html';
            }
        });
    }

    closeCardBtn.addEventListener('click', () => {
        card.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === card) {
            card.style.display = 'none';
        }
    });
});