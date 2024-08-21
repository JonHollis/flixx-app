const global = {
  currentPage: window.location.pathname,
};

// display 20 most popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `      
    <a href="movie-details.html?id=${movie.id}">
    ${
      movie.poster_path
        ? `      <img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="${movie.title}"
      />`
        : `  <img
  src="images/no-image.jpg"
  class="card-img-top"
  alt=""
/>`
    }
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
    </div>
  `;
    document.querySelector("#popular-movies").appendChild(div);
  });
}

// display 20 most popular tv shows
async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");

  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `      
    <a href="movie-details.html?id=${show.id}">
    ${
      show.poster_path
        ? `      <img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
      />`
        : `  <img
  src="images/no-image.jpg"
  class="card-img-top"
  alt=""
/>`
    }
    </a>
    <div class="card-body">
      <h5 class="card-title">${show.name}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${show.first_air_date}</small>
      </p>
    </div>
  `;
    document.querySelector("#popular-shows").appendChild(div);
  });
}

// display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split("id=")[1];

  const movieDetails = await fetchAPIData(`movie/${movieId}`);

  console.log(movieDetails);

  const div = document.createElement("div");
  div.innerHTML = `
          <div class="details-top">
          <div>

    ${
      movieDetails.poster_path
        ? `      <img
        src="https://image.tmdb.org/t/p/w500${movieDetails.poster_path}"
        class="card-img-top"
        alt="${movieDetails.title}"
      />`
        : `  <img
  src="images/no-image.jpg"
  class="card-img-top"
  alt=""
/>`
    }
          </div>
          <div>
            <h2>${movieDetails.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movieDetails.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movieDetails.release_date}</p>
            <p>
              ${movieDetails.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${movieDetails.genres
              .map((genre) => `<li>${genre.name}</li>`)
              .join("")}
            </ul>
            <a href="${
              movieDetails.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> ${addCommasToNumber(
              movieDetails.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> ${addCommasToNumber(
              movieDetails.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movieDetails.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${
              movieDetails.status
            }</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movieDetails.production_companies.map(
            (company) => ` ${company.name}`
          )}</div>
        </div>
  `;
  document.querySelector("#movie-details").appendChild(div);
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = "e60c890f3743b5d66aaca620da9a2b0b";
  const API_URL = "https://api.themoviedb.org/3/";

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();

  hideSpinner();
  return data;
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

// Highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    console.log(link.getAttribute("href"));
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// function add comma to big number
function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// init App
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayPopularMovies();
      break;

    case "/shows.html":
      displayPopularShows();
      break;

    case "/movie-details.html":
      displayMovieDetails();
      console.log("Movie Details");
      break;

    case "/tv-details.html":
      console.log("TV Details");
      break;

    case "/search.html":
      console.log("Search");
      break;

    default:
      break;
  }
  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
// popularMovies();
