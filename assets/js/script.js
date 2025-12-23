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
const API_KEY = API_KEYUser;

let options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + API_KEY,
  },
};

// --- SÉLECTEURS DOM ---
const selectGenreMovies = document.querySelector("#genre-select");
const selectGenreSeries = document.querySelector("#genre-selectSerie");
const containerMovies = document.querySelector("#loadMovies");
const containerSeries = document.querySelector("#loadSeries");

// --- FONCTIONS FETCH (API) ---

// Récupérer les genres (Films)
const getMoviesGenres = async () => {
  try {
    const res = await fetch("https://api.themoviedb.org/3/genre/movie/list?language=fr", options);
    return await res.json();
  } catch (error) {
    console.error("Erreur Genres Films:", error);
  }
};

const getSeriesGenres = async () => {
  try {
    const res = await fetch("https://api.themoviedb.org/3/genre/tv/list?language=fr", options);
    return await res.json();
  } catch (error) {
    console.error("Erreur Genres Séries:", error);
  }
};

async function getMoviesByGenre(genreId) {
  try {
    const res = await fetch(
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fr-FR&page=1&sort_by=popularity.desc&with_genres=" + genreId,
      options
    );
    return await res.json();
  } catch (error) {
    console.error("Erreur Recherche Films:", error);
  }
}

async function getSeriesByGenre(genreId) {
  try {
    const res = await fetch(
      "https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=fr-FR&page=1&sort_by=popularity.desc&with_genres=" + genreId,
      options
    );
    return await res.json();
  } catch (error) {
    console.error("Erreur Recherche Séries:", error);
  }
}

const getPopularMovies = async () => {
  try {
    const res = await fetch(
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fr-FR&page=1&sort_by=popularity.desc",
      options
    );
    return await res.json();
  } catch (error) {
    console.error("Erreur Init Movies:", error);
  }
};

const getPopularSeries = async () => {
  try {
    const res = await fetch(
      "https://api.themoviedb.org/3/discover/tv?language=fr-FR&page=1&sort_by=popularity.desc",
      options
    );
    return await res.json();
  } catch (error) {
    console.error("Erreur Init Series:", error);
  }
};

// --- FONCTIONS D'AFFICHAGE ---

function createMovieCard(movie) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Pas+d'Image";
  
  const div = document.createElement("div");
  div.classList.add("movie-card");
  div.innerHTML = `
        <img src="${posterUrl}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
        <p>Note : ${movie.vote_average.toFixed(1)}/10</p>
        <p>${movie.release_date ? movie.release_date.substring(0, 4) : "Date inconnue"}</p>
    `;
  return div;
}

function createSerieCard(serie) {
  const posterUrl = serie.poster_path
    ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Pas+d'Image";
    
  const div = document.createElement("div");
  div.classList.add("movie-card");
  div.innerHTML = `
        <img src="${posterUrl}" alt="${serie.name}" />
        <h3>${serie.name}</h3>
        <p>Note : ${serie.vote_average.toFixed(1)}/10</p>
        <p>${serie.first_air_date ? serie.first_air_date.substring(0, 4) : "Date inconnue"}</p>
    `;
  return div;
}

function renderMovies(movies) {
  if (!containerMovies) return;
  containerMovies.innerHTML = "";
  movies.forEach((movie) => {
    containerMovies.appendChild(createMovieCard(movie));
  });
}

function renderSeries(series) {
  if (!containerSeries) return;
  containerSeries.innerHTML = "";
  series.forEach((serie) => {
    containerSeries.appendChild(createSerieCard(serie));
  });
}

if (containerMovies && selectGenreMovies) {
  const initMovies = async () => {
    const data = await getPopularMovies();
    if (data && data.results) renderMovies(data.results);
  };

  const loadGenres = async () => {
    const data = await getMoviesGenres();
    selectGenreMovies.innerHTML = '<option value="">Tous</option>';
    if (data && data.genres) {
      data.genres.forEach((genre) => {
        selectGenreMovies.innerHTML += `<option value="${genre.id}">${genre.name}</option>`;
      });
      selectGenreMovies.removeAttribute("disabled");
    }
  };

  initMovies();
  loadGenres();

  selectGenreMovies.addEventListener("input", async (event) => {
    const genreId = event.target.value;
    if (genreId === "") {
      initMovies();
    } else {
      const data = await getMoviesByGenre(genreId);
      if (data && data.results) renderMovies(data.results);
    }
  });
}

if (containerSeries && selectGenreSeries) {
  const initSeries = async () => {
    const data = await getPopularSeries();
    if (data && data.results) renderSeries(data.results);
  };
  const loadGenresSeries = async () => {
    const data = await getSeriesGenres();
    selectGenreSeries.innerHTML = '<option value="">Tous</option>';
    if (data && data.genres) {
      data.genres.forEach((genre) => {
        selectGenreSeries.innerHTML += `<option value="${genre.id}">${genre.name}</option>`;
      });
      selectGenreSeries.removeAttribute("disabled");
    }
  };

  initSeries();
  loadGenresSeries();

  selectGenreSeries.addEventListener("input", async (event) => {
    const genreId = event.target.value;
    if (genreId === "") {
      initSeries();
    } else {
      const data = await getSeriesByGenre(genreId);
      if (data && data.results) renderSeries(data.results);
    }
  });
}