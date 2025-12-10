// ATTENTION DE PAS PUSH CA SUR GITHUB
const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTc5NTU0ZjJjY2RkYWQ4ZmE0ZjE0NmM3NTE3ZjFhYiIsIm5iZiI6MTc2NDY4NjAzOS4zMTgsInN1YiI6IjY5MmVmOGQ3OTE4NTk3ZDVkNzM5OTM2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nqb8PJ0fxYqZPOJIy-Zw_KrXNxUhwbjV6S841_cB5Fc";
// 

let popularMovies = [];
const selectElement = document.querySelector("#genre-select");
const selectMovies = document.querySelector("#loadMovies");

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
  popularMovies.genres.forEach((genre) => {
    selectElement.innerHTML += `<option value="${genre.id}">${genre.name}</option>`;
  });
  selectElement.removeAttribute("disabled");
};

loadGenres();

selectElement.addEventListener("input", async (event) => {
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

function loadMovies(movies) {
  selectMovies.innerHTML = "";

  movies.forEach((movie) => {
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
    selectMovies.appendChild(movieElement);
  });
}
