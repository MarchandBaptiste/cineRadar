// ATTENTION DE PAS PUSH CA SUR GITHUB
const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTc5NTU0ZjJjY2RkYWQ4ZmE0ZjE0NmM3NTE3ZjFhYiIsIm5iZiI6MTc2NDY4NjAzOS4zMTgsInN1YiI6IjY5MmVmOGQ3OTE4NTk3ZDVkNzM5OTM2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nqb8PJ0fxYqZPOJIy-Zw_KrXNxUhwbjV6S841_cB5Fc";

let popularMovies = [];
const selectElement = document.querySelector("#genre-select");

const getMovies = async () => {
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + API_KEY,
    },
  };

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

// local storage
// ne pas mettre sa clé d'api sur gitub
// et voir api reférence cliquer sur node et try it
// pour le select mettre un input en addeventlistener
// charger tous les films avec un seul url et faire un double trie (genre et popularité)
// local storage poyur enregistrer les film déja vue (il faut trasfomer en chaine de caractère le json stringify ) j'uste ca fonctione