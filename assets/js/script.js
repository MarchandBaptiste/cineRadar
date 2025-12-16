const menuBtn = document.querySelector('.menu-hamburger');
const navLinks = document.querySelector('.nav-links');
const navBar = document.querySelector('.navbar')
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navBar.classList.toggle('open');
});


// vérif si la clé est déjà sauvegardée dans le navigateur
let API_KEYUser = localStorage.getItem('tmdb_token');

// existe pas on demande à l'utilisateur
if (!API_KEYUser) {
    API_KEYUser = prompt("Veuillez saisir votre Token d'accès (Bearer) TMDB :");
    
    // quelque chopse est saisi on sauvegarde pour la prochaine fois
    if (API_KEYUser) {
        localStorage.setItem('tmdb_token', API_KEYUser);
    }
}
const API_KEY = API_KEYUser;

let popularMovies = [];
const selectElement = document.querySelector("#genre-select");
const selectMovies = document.querySelector("#loadMovies");
const topTenMoviesContainer = document.querySelector("#topTenMovies");
const topTenSeriesContainer = document.querySelector("#topTenSerie");

let options = {
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_KEY,
    },
};

const getMovies = async () => {
    const promise = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list?language=fr",
        options
    );

    return await promise.json();
};

const loadGenres = async () => {
    popularMovies = await getMovies();
    selectElement.innerHTML = '<option value="">Genres...</option>';
    if (popularMovies && popularMovies.genres) {
        popularMovies.genres.forEach((genre) => {
            selectElement.innerHTML += `<option value="${genre.id}">${genre.name}</option>`;
        });
        selectElement.removeAttribute("disabled");
    } else {
        console.error("Erreur lors du chargement des genres : L'API n'a pas retourné les données attendues.");
    }
};

loadGenres();

selectElement.addEventListener("input", async (event) => {
    if (event.target.value === "") {
        selectMovies.innerHTML = "";
        topTenMoviesContainer.style.display = "block";
        topTenSeriesContainer.style.display = "block";
        return;
    }

    topTenMoviesContainer.style.display = "none";
    topTenSeriesContainer.style.display = "none";
    const moviesData = await byGenres(event.target.value);
    loadMovies(moviesData.results);
});

async function byGenres(value) {
    const listMovies = await fetch(
        "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fr-FR&page=1&sort_by=popularity.desc&with_genres=" +
            value,
        options
    );
    return await listMovies.json();
}

function createMovieCard(movie) {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "https://via.placeholder.com/300x450?text=Pas+d'Image";
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie-card");

    movieElement.innerHTML = `
        <img src="${posterUrl}" alt="Affiche de ${movie.title}" />
        <h3>${movie.title}</h3>
        <p>Note : ${movie.vote_average.toFixed(1)}/10</p>
        <p>${
            movie.release_date
                ? movie.release_date.substring(0, 4)
                : "Date inconnue"
        }</p>
    `;
    return movieElement;
}

function createSerieCard(serie) {
    const posterUrl = serie.poster_path
        ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
        : "https://via.placeholder.com/300x450?text=Pas+d'Image";
    const serieElement = document.createElement("div");
    serieElement.classList.add("movie-card");
    serieElement.innerHTML = `
        <img src="${posterUrl}" alt="Affiche de ${serie.name}" />
        <h3>${serie.name}</h3>
        <p>Note : ${serie.vote_average.toFixed(1)}/10</p>
        <p>${
            serie.first_air_date
                ? serie.first_air_date.substring(0, 4)
                : "Date inconnue"
        }</p>
    `;
    return serieElement;
}

function loadMovies(movies) {
    selectMovies.innerHTML = "";
    movies.forEach((movie) => {
        selectMovies.appendChild(createMovieCard(movie));
    });
}

function loadTopTenMovies(movies) {
    topTenMoviesContainer.innerHTML = "<h2>Top 10 des Films Populaires</h2>";
    const topTenList = document.createElement("div");
    topTenList.classList.add("top-ten-list");
    movies.forEach((movie) => {
        topTenList.appendChild(createMovieCard(movie));
    });
    topTenMoviesContainer.appendChild(topTenList);
}

function loadTopTenSeries(series) {
    topTenSeriesContainer.innerHTML = "<h2>Top 10 des Séries Populaires</h2>";
    const topTenList = document.createElement("div");
    topTenList.classList.add("top-ten-list");
    series.forEach((serie) => {
        topTenList.appendChild(createSerieCard(serie));
    });
    topTenSeriesContainer.appendChild(topTenList);
}

const getInitialMovies = async () => {
    const response = await fetch(
        "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fr-FR&page=1&sort_by=popularity.desc",
        options
    );
    const data = await response.json();
    const top10Movies = data.results.slice(0, 10);
    loadTopTenMovies(top10Movies);
};

getInitialMovies();

const getInitialSeries = async () => {
    const response = await fetch(
        "https://api.themoviedb.org/3/discover/tv?language=fr-FR&page=1&sort_by=popularity.desc",
        options
    );
    const data = await response.json();
    const top10Series = data.results.slice(0, 10);
    loadTopTenSeries(top10Series);
};

getInitialSeries();