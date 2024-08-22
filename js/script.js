// IMDB
// https://developer.themoviedb.org/reference/intro/getting-started

const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    total_pages: 1,
  },
  api: {
    apiKey: "e60c890f3743b5d66aaca620da9a2b0b",
    apiURL: "https://api.themoviedb.org/3/",
  },
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
    <a href="tv-details.html?id=${show.id}">
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

  // background
  displayBackgroundImage("movie", movieDetails.backdrop_path);

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
            (company) => ` <span>${company.name}</span>`
          )}</div>
        </div>
  `;
  document.querySelector("#movie-details").appendChild(div);
}

// display TV show details
async function displayShowDetails() {
  const showId = window.location.search.split("id=")[1];

  const show = await fetchAPIData(`tv/${showId}`);

  // background
  displayBackgroundImage("show", show.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `
          <div class="details-top">
          <div>

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
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.release_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${
              show.homepage
            }" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              show.number_of_episodes
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                show.last_air_date
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map(
            (company) => ` <span>${company.name}</span>`
          )}</div>
        </div>
  `;
  document.querySelector("#show-details").appendChild(div);
}

// display details pages background
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();

  hideSpinner();
  return data;
}

// make search request
async function searchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`
  );
  const data = await response.json();

  hideSpinner();
  return data;
}

// search
async function search() {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    // make request and display results
    const { results, total_pages, page } = await searchAPIData();

    if (results.length === 0) {
      showAlert("No results found", "error");
      return;
    }
    console.log(results, total_pages, page);

    document.getElementById("search-term").value = "";
    displaySearchResults(results, total_pages, page);
  } else {
    showAlert("Please enter a search phrase", "error");
    return;
  }
}

// display search results
function displaySearchResults(results, total_pages, page) {
  console.log(results);

  const type = global.search.type;

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `      
    <a href="${type}-details.html?id=${result.id}">
    ${
      result.poster_path
        ? `      <img
        src="https://image.tmdb.org/t/p/w500${result.poster_path}"
        class="card-img-top"
        alt="${global.search.type === "movie" ? result.title : result.name}"
      />`
        : `  <img
  src="images/no-image.jpg"
  class="card-img-top"
  alt="${global.search.type === "movie" ? result.title : result.name}"
/>`
    }
    </a>
    <div class="card-body">
      <h5 class="card-title">${
        global.search.type === "movie" ? result.title : result.name
      }</h5>
      <p class="card-text">
        <small class="text-muted">${
          global.search.type === "movie"
            ? result.release_date
            : result.first_air_date
        }</small>
      </p>
    </div>
  `;
    document.querySelector("#search-results").appendChild(div);
  });
}

// fetch api slider
async function displaySwiper() {
  const { results } = await fetchAPIData("movie/now_playing");

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
    <div class="swiper-slide">
      <a href="movie-details.html?id=${result.id}">
        <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${
      result.title
    }" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${result.vote_average.toFixed(
          1
        )} / 10
      </h4>
    </div>`;

    document.querySelector(".swiper-wrapper").appendChild(div);
    initSwiper();
  });
}

// swiper
function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      800: {
        slidesPerView: 3,
      },
      1400: {
        slidesPerView: 4,
      },
    },
  });
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
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// show error alert
function showAlert(message, className) {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));

  document.getElementById("alert").appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
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
      displaySwiper();
      displayPopularMovies();
      break;

    case "/shows.html":
      displayPopularShows();
      break;

    case "/movie-details.html":
      displayMovieDetails();
      break;

    case "/tv-details.html":
      displayShowDetails();
      break;

    case "/search.html":
      search();
      break;

    default:
      break;
  }
  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
// popularMovies();
