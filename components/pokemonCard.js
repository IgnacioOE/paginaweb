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

    closeCardBtn.addEventListener('click', () => {
        card.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === card) {
            card.style.display = 'none';
        }
    });
});