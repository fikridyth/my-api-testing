const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
let pokemons = [];
let nextUrl = apiUrl;

const fetchPokemonsBtn = document.getElementById('fetchPokemonsBtn');
const pokemonList = document.getElementById('pokemon-list');

fetchData(apiUrl);

fetchPokemonsBtn.addEventListener('click', fetchData);

$('#search-button').on('click', searchPokemons);

$('#search-input').on('keyup', function (e) {
    if (e.keyCode === 13) {
        searchPokemons();
    }
});

$('#pokemon-list').on('click', '.see-detail', function () {
    let pokemonId = $(this).data('id');
    DetailPokemons(pokemonId);
});

function fetchData() {
    fetch(nextUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            nextUrl = data.next;
            pokemons = pokemons.concat(data.results);
            displayPokemons();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            pokemonList.innerHTML = `
                <div class="col">
                    <h5 class="text-center">Failed to fetch Pokémon data.</h5>
                </div>
            `;
        });
}

function displayPokemons() {
    pokemonList.innerHTML = '';
    pokemons.forEach(pokemon => {
        let pokemonId = getIdFromUrl(pokemon.url);
        let showPokemonId = pokemonId.toString().padStart(4, '0');
        let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

        pokemonList.innerHTML += `
            <div class="col-6 col-lg-2 mb-3">
                <div class="card">
                    <img src="${imageUrl}" class="card-img-top" alt="${pokemon.name}">
                    <p class="mb-n1 fs-12 mx-2 mx-lg-3">#${showPokemonId}</p>
                    <p class="h6 mx-2 mx-lg-3">${capital(pokemon.name)}</p>
                    <a href="#" class="btn btn-sm btn-primary see-detail mx-2 mx-lg-3 mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${pokemonId}">Detail</a>
                </div>
            </div>
        `;
    });
}

function searchPokemons() {
    let searchInput = $('#search-input').val().toLowerCase().trim();
    
    if (searchInput === '') {
        fetchPokemonsBtn.hidden = false;
        fetchData(apiUrl);
        return;
    }
    
    pokemonList.innerHTML = '';

    $.ajax({
        url: `${apiUrl}${searchInput}/`,
        type: 'GET',
        dataType: 'json',
        success: function (pokemon) {
            fetchPokemonsBtn.hidden = true;
            let pokemonId = getIdFromUrl(this.url);
            let showPokemonId = pokemonId.toString().padStart(4, '0');
            let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

            pokemonList.innerHTML += `
                <div class="col-6 col-lg-2 mb-3">
                    <div class="card">
                        <img src="${imageUrl}" class="card-img-top" alt="${pokemon.name}">
                        <p class="mb-n1 fs-12 mx-2 mx-lg-3">#${showPokemonId}</p>
                        <p class="h6 mx-2 mx-lg-3">${capital(pokemon.name)}</p>
                        <a href="#" class="btn btn-sm btn-primary see-detail mx-2 mx-lg-3 mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${pokemonId}">Detail</a>
                    </div>
                </div>
            `;
        },
        error: function (error) {
            console.error('Error fetching Pokemon:', error);
            pokemonList.innerHTML = `
                <div class="col">
                    <h5 class="text-center">Pokemon not found.</h5>
                </div>
            `;
        }
    });
}

function DetailPokemons(pokemonId) {
    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
        type: 'GET',
        dataType: 'json',
        success: function (pokemon) {
            let showPokemonId = pokemonId.toString().padStart(4, '0');
            $('.modal-body').html(`
                <div class="row text-center mt-n12">
                    <div class="col col-md-6">
                        <img src="${pokemon.sprites.front_default}" class="detail-image">
                    </div>
                    <div class="col col-md-6 hide-on-lg">
                        <img src="${pokemon.sprites.back_default}" class="detail-image">
                    </div>
                </div>
                <div>
                    <ul class="list-group">
                        <li class="list-group-item"><h3 class="text-center">${capital(pokemon.name)}</h3></li>
                        <li class="list-group-item"><b>Id:</b> ${showPokemonId}</li>
                        <li class="list-group-item"><b>Height:</b> ${pokemon.height / 10} m</li>
                        <li class="list-group-item"><b>Weight:</b> ${pokemon.weight / 10} kg</li>
                        <li class="list-group-item"><b>Abilities:</b> ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</li>
                        <li class="list-group-item"><b>Types:</b> ${pokemon.types.map(type => type.type.name).join(', ')}</li>
                    </ul>
                </div>
            `);
        },
        error: function (error) {
            console.error('Error fetching Pokemon:', error);
        }
    });
}

function getIdFromUrl(url) {
    let segments = url.split('/');
    return segments[segments.length - 2];
}

function capital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}