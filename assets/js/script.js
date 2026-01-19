//  MENU
const menuBtn = document.querySelector(".menu-hamburger");
const navLinks = document.querySelector(".nav-links");
const navBar = document.querySelector(".navbar");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    navBar.classList.toggle("open");
  });
}

//  API KEY
let API_KEYUser = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTc5NTU0ZjJjY2RkYWQ4ZmE0ZjE0NmM3NTE3ZjFhYiIsIm5iZiI6MTc2NDY4NjAzOS4zMTgsInN1YiI6IjY5MmVmOGQ3OTE4NTk3ZDVkNzM5OTM2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nqb8PJ0fxYqZPOJIy-Zw_KrXNxUhwbjV6S841_cB5Fc";



const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + API_KEYUser,
  },
};

//  FAVORIS UTILS
function getFavorites(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveFavorites(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

//  SELECTEURS
const selectGenreMovies = document.querySelector("#genre-select");
const selectGenreSeries = document.querySelector("#genre-selectSerie");
const containerMovies = document.querySelector("#loadMovies");
const containerSeries = document.querySelector("#loadSeries");
const topTenMoviesContainer = document.querySelector("#topTenMovies");
const topTenSeriesContainer = document.querySelector("#topTenSeries");
const favoriteMoviesContainer = document.querySelector("#favoriteMovies");
const favoriteSeriesContainer = document.querySelector("#favoriteSeries");

//  API
const getMoviesGenres = async () =>
  fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=fr",
    options
  ).then((r) => r.json());

const getSeriesGenres = async () =>
  fetch("https://api.themoviedb.org/3/genre/tv/list?language=fr", options).then(
    (r) => r.json()
  );

const getPopularMovies = async () =>
  fetch(
    "https://api.themoviedb.org/3/discover/movie?language=fr-FR&sort_by=popularity.desc&page=1",
    options
  ).then((r) => r.json());

const getPopularSeries = async () =>
  fetch(
    "https://api.themoviedb.org/3/discover/tv?language=fr-FR&sort_by=popularity.desc&page=1",
    options
  ).then((r) => r.json());

const getMoviesByGenre = async (id) =>
  fetch(
    `https://api.themoviedb.org/3/discover/movie?language=fr-FR&sort_by=popularity.desc&with_genres=${id}`,
    options
  ).then((r) => r.json());

const getSeriesByGenre = async (id) =>
  fetch(
    `https://api.themoviedb.org/3/discover/tv?language=fr-FR&sort_by=popularity.desc&with_genres=${id}`,
    options
  ).then((r) => r.json());

//  CARTE FILM
function createMovieCard(movie) {
  // ternaire pour l'image
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Pas+d'Image";

  const div = document.createElement("div");
  div.classList.add("movie-card");

  const img = document.createElement("img");
  img.src = poster;
  img.alt = movie.title;

  const divContent = document.createElement("div");
  divContent.classList.add("movie-info");

  const divText = document.createElement("div");
  divText.classList.add("movie-text");

  const divToggle = document.createElement("div");
  divToggle.classList.add("movie-toggle");

  divText.innerHTML = `
    <h3>${movie.title}</h3>
    <p>Note : ${movie.vote_average.toFixed(1)}/10</p>
    <p>${
      movie.release_date ? movie.release_date.slice(0, 4) : "Date inconnue"
    }</p>
  `;

  const imageInitiale = "https://img.icons8.com/ios-filled/50/ff0000/like--v1.png";
  const imageSurvole = "https://img.icons8.com/ios/50/ff0000/like--v1.png";

  const image = document.createElement("img");
  image.style.cursor = "pointer";
  image.style.width = "30px";
  image.style.height = "30px";

  const favorites = getFavorites("favoriteMovies");
  const isFavorite = favorites.some((m) => m.id === movie.id);
  image.src = isFavorite ? imageInitiale : imageSurvole;

  image.addEventListener("click", () => {
    let favs = getFavorites("favoriteMovies");
    const index = favs.findIndex((m) => m.id === movie.id);

    if (index !== -1) {
      favs.splice(index, 1);
      image.src = imageSurvole;
    } else {
      favs.push(movie);
      image.src = imageInitiale;
    }
    saveFavorites("favoriteMovies", favs);
  });

  divToggle.appendChild(image);

  divContent.appendChild(divText);
  divContent.appendChild(divToggle);
  div.appendChild(img);
  div.appendChild(divContent);

  return div;
}

//  CARTE SERIE
function createSerieCard(serie) {
  const poster = serie.poster_path
    ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Pas+d'Image";

  const div = document.createElement("div");
  div.classList.add("movie-card");

  const img = document.createElement("img");
  img.src = poster;
  img.alt = serie.name;

  const divContent = document.createElement("div");
  divContent.classList.add("movie-info");

  const divText = document.createElement("div");
  divText.classList.add("movie-text");

  const divToggle = document.createElement("div");
  divToggle.classList.add("movie-toggle");

  divText.innerHTML = `
    <h3>${serie.name}</h3>
    <p>Note : ${serie.vote_average.toFixed(1)}/10</p>
    <p>${
      serie.first_air_date ? serie.first_air_date.slice(0, 4) : "Date inconnue"
    }</p>
  `;

  const imageInitiale =
    "https://img.icons8.com/ios-filled/50/ff0000/like--v1.png";
  const imageSurvole = "https://img.icons8.com/ios/50/ff0000/like--v1.png";

  const image = document.createElement("img");
  image.style.cursor = "pointer";
  image.style.width = "30px";
  image.style.height = "auto";

  const favorites = getFavorites("favoriteSeries");
  const isFavorite = favorites.some((s) => s.id === serie.id);
  image.src = isFavorite ? imageInitiale : imageSurvole;

  image.addEventListener("click", () => {
    let favs = getFavorites("favoriteSeries");
    const index = favs.findIndex((s) => s.id === serie.id);

    if (index !== -1) {
      favs.splice(index, 1);
      image.src = imageSurvole;
    } else {
      favs.push(serie);
      image.src = imageInitiale;
    }
    saveFavorites("favoriteSeries", favs);
  });

  divToggle.appendChild(image);

  divContent.appendChild(divText);
  divContent.appendChild(divToggle);
  div.appendChild(img);
  div.appendChild(divContent);

  return div;
}

//  RENDER
function renderMovies(movies) {
  containerMovies.innerHTML = "";
  movies.forEach((movie) =>
    containerMovies.appendChild(createMovieCard(movie))
  );
}

function renderSeries(series) {
  containerSeries.innerHTML = "";
  series.forEach((serie) =>
    containerSeries.appendChild(createSerieCard(serie))
  );
}

//  TOP 10
function loadTopTenMovies(movies) {
  topTenMoviesContainer.innerHTML = "<h2>Top 10 des Films Populaires</h2>";
  const list = document.createElement("div");
  list.classList.add("top-ten-list");
  movies.forEach((movie) => list.appendChild(createMovieCard(movie)));
  topTenMoviesContainer.appendChild(list);
}

function loadTopTenSeries(series) {
  topTenSeriesContainer.innerHTML = "<h2>Top 10 des Séries Populaires</h2>";
  const list = document.createElement("div");
  list.classList.add("top-ten-list");
  series.forEach((serie) => list.appendChild(createSerieCard(serie)));
  topTenSeriesContainer.appendChild(list);
}

//  INITIALISATION
// Vérifie si on est sur une page qui doit afficher le top 10 films
if (topTenMoviesContainer) {
  getPopularMovies().then((data) =>
    loadTopTenMovies(data.results.slice(0, 10))
  );
}
// Vérifie si on est sur la page principale des films
if (containerMovies && selectGenreMovies) {
  getPopularMovies().then((data) => renderMovies(data.results));
  getMoviesGenres().then((data) => {
    selectGenreMovies.innerHTML = '<option value="">Tous...</option>';
    data.genres.forEach(
      (g) =>
        (selectGenreMovies.innerHTML += `<option value="${g.id}">${g.name}</option>`)
    );
  });

  selectGenreMovies.addEventListener("input", async (e) => {
    if (e.target.value === "") {
      const data = await getPopularMovies(); //si tous alors charge les pouliare
      renderMovies(data.results);
    } else {
      const data = await getMoviesByGenre(e.target.value); //sinon charge par genre
      renderMovies(data.results);
    }
  });
}

// Vérifie si on est sur une page qui doit afficher le top 10 séries
if (topTenSeriesContainer) {
  getPopularSeries().then((data) =>
    loadTopTenSeries(data.results.slice(0, 10))
  );
}
// Vérifie si on est sur la page principale des séries
if (containerSeries && selectGenreSeries) {
  getPopularSeries().then((data) => renderSeries(data.results));
  getSeriesGenres().then((data) => {
    selectGenreSeries.innerHTML = '<option value="">Tous...</option>';
    data.genres.forEach(
      (g) =>
        (selectGenreSeries.innerHTML += `<option value="${g.id}">${g.name}</option>`)
    );
  });

  selectGenreSeries.addEventListener("input", async (e) => {
    if (e.target.value === "") {
      const data = await getPopularSeries();
      renderSeries(data.results);
    } else {
      const data = await getSeriesByGenre(e.target.value);
      renderSeries(data.results);
    }
  });
}

//  PAGE FAVORIS
if (favoriteMoviesContainer) {
  const favs = getFavorites("favoriteMovies");
  if (favs.length === 0) {
    favoriteMoviesContainer.innerHTML =
      "<h2>Ajoutez les films et les séries qui vous intéressent !</h2>";
  } else {
    favs.forEach((movie) =>
      favoriteMoviesContainer.appendChild(createMovieCard(movie))
    );
  }
}

if (favoriteSeriesContainer) {
  const favs = getFavorites("favoriteSeries");
  if (favs.length === 0) {
  } else {
    favs.forEach((serie) =>
      favoriteSeriesContainer.appendChild(createSerieCard(serie))
    );
  }
}
