// --- GESTION DU MENU ---
const menuBtn = document.querySelector(".menu-hamburger");
const navLinks = document.querySelector(".nav-links");
const navBar = document.querySelector(".navbar");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    navBar.classList.toggle("open");
  });
}

// --- GESTION API KEY ---
let API_KEYUser = localStorage.getItem("tmdb_token");

if (!API_KEYUser) {
  API_KEYUser = prompt("Veuillez saisir votre Token d'accès (Bearer) TMDB :");
  if (API_KEYUser) {
    localStorage.setItem("tmdb_token", API_KEYUser);
  }
}

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + API_KEYUser,
  },
};

// --- SELECTEURS DOM ---
const selectGenreMovies = document.querySelector("#genre-select");
const selectGenreSeries = document.querySelector("#genre-selectSerie");
const containerMovies = document.querySelector("#loadMovies");
const containerSeries = document.querySelector("#loadSeries");
const topTenMoviesContainer = document.querySelector("#topTenMovies");
const topTenSeriesContainer = document.querySelector("#topTenSeries");
const favoriteMoviesContainer = document.querySelector("#favoriteMovies");
const favoriteSeriesContainer = document.querySelector("#favoriteSeries");

const getMoviesGenres = async () => {
  const res = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=fr",
    options
  );
  return res.json();
};

const getSeriesGenres = async () => {
  const res = await fetch(
    "https://api.themoviedb.org/3/genre/tv/list?language=fr",
    options
  );
  return res.json();
};

const getPopularMovies = async () => {
  const res = await fetch(
    "https://api.themoviedb.org/3/discover/movie?language=fr-FR&sort_by=popularity.desc&page=1",
    options
  );
  return res.json();
};

const getPopularSeries = async () => {
  const res = await fetch(
    "https://api.themoviedb.org/3/discover/tv?language=fr-FR&sort_by=popularity.desc&page=1",
    options
  );
  return res.json();
};

const getMoviesByGenre = async (genreId) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?language=fr-FR&sort_by=popularity.desc&with_genres=${genreId}`,
    options
  );
  return res.json();
};

const getSeriesByGenre = async (genreId) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?language=fr-FR&sort_by=popularity.desc&with_genres=${genreId}`,
    options
  );
  return res.json();
};

function createMovieCard(movie) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Pas+d'Image";

  const div = document.createElement("div");
  div.classList.add("movie-card");

  const img = document.createElement("img");
  img.src = poster;
  img.alt = movie.title;

  const divText = document.createElement("div");
  divText.classList.add("movie-text");

  divText.innerHTML = `
    <h3>${movie.title}</h3>
    <p>Note : ${movie.vote_average.toFixed(1)}/10</p>
    <p>${
      movie.release_date ? movie.release_date.slice(0, 4) : "Date inconnue"
    }</p>
  `;

  div.appendChild(img);
  div.appendChild(divText);

  return div;
}

function createSerieCard(serie) {
  const poster = serie.poster_path
    ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Pas+d'Image";

  const div = document.createElement("div");
  div.classList.add("movie-card");

  const img = document.createElement("img");
  img.src = poster;
  img.alt = serie.name;

  const divText = document.createElement("div");
  divText.classList.add("movie-text");

  divText.innerHTML = `
    <h3>${serie.name}</h3>
    <p>Note : ${serie.vote_average.toFixed(1)}/10</p>
    <p>${
      serie.first_air_date ? serie.first_air_date.slice(0, 4) : "Date inconnue"
    }</p>
  `;

  div.appendChild(img);
  div.appendChild(divText);

  return div;
}

// --- AFFICHAGE ---
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

// --- INITIALISATION ---
if (topTenMoviesContainer) {
  const initTopTenMovies = async () => {
    const data = await getPopularMovies();
    loadTopTenMovies(data.results.slice(0, 10));
  };
  initTopTenMovies();
}

if (containerMovies && selectGenreMovies) {
  const initMovies = async () => {
    const data = await getPopularMovies();
    renderMovies(data.results);
  };

  const loadGenres = async () => {
    const data = await getMoviesGenres();
    selectGenreMovies.innerHTML = '<option value="">Tous...</option>';
    data.genres.forEach((g) => {
      selectGenreMovies.innerHTML += `<option value="${g.id}">${g.name}</option>`;
    });
  };

  initMovies();
  loadGenres();

  selectGenreMovies.addEventListener("input", async (e) => {
    if (e.target.value === "") {
      initMovies();
    } else {
      const data = await getMoviesByGenre(e.target.value);
      renderMovies(data.results);
    }
  });
}

if (topTenSeriesContainer) {
  const initTopTenSeries = async () => {
    const data = await getPopularSeries();
    loadTopTenSeries(data.results.slice(0, 10));
  };
  initTopTenSeries();
}

if (containerSeries && selectGenreSeries) {
  const initSeries = async () => {
    const data = await getPopularSeries();
    renderSeries(data.results);
  };

  const loadGenresSeries = async () => {
    const data = await getSeriesGenres();
    selectGenreSeries.innerHTML = '<option value="">Tous...</option>';
    data.genres.forEach((g) => {
      selectGenreSeries.innerHTML += `<option value="${g.id}">${g.name}</option>`;
    });
  };

  initSeries();
  loadGenresSeries();

  selectGenreSeries.addEventListener("input", async (e) => {
    if (e.target.value === "") {
      initSeries();
    } else {
      const data = await getSeriesByGenre(e.target.value);
      renderSeries(data.results);
    }
  });
}
