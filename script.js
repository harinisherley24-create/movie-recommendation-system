
/* =========================================
   CINEMATCH - MOVIE RECOMMENDATION SYSTEM
   ========================================= */


/* MOVIE DATABASE */

const movies = [

    {
        title: "Inception",
        genre: "Sci-Fi",
        rating: 8.8,
        poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
        description: "A skilled thief who steals secrets through dreams is offered a chance to erase his criminal past. His mission is to plant an idea inside someone's mind, leading to a mind-bending adventure."
    },

    {
        title: "The Dark Knight",
        genre: "Action",
        rating: 9.0,
        poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        description: "Batman faces his greatest challenge when the Joker spreads chaos across Gotham City. As the city struggles with fear and crime, Batman must make difficult choices to protect its people."
    },

    {
        title: "Interstellar",
        genre: "Sci-Fi",
        rating: 8.7,
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        description: "When Earth faces an environmental crisis, a group of explorers travels through a mysterious wormhole in search of a new home for humanity. The journey explores love, time, sacrifice and survival."
    },

    {
        title: "The Notebook",
        genre: "Romance",
        rating: 7.8,
        poster: "https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg",
        description: "A young couple from different social backgrounds fall deeply in love. Despite family pressures, separation and the challenges of life, their emotional connection remains unforgettable."
    },

    {
        title: "Joker",
        genre: "Drama",
        rating: 8.4,
        poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
        description: "Arthur Fleck is a struggling comedian who feels rejected by society. As he faces personal struggles and isolation, a series of events transforms his life in a disturbing way."
    },

    {
        title: "The Hangover",
        genre: "Comedy",
        rating: 7.7,
        poster: "https://image.tmdb.org/t/p/w500/A0uS9rHR56FeBtpjVki16M5xxSW.jpg",
        description: "After a wild bachelor party in Las Vegas, three friends wake up with no memory of the previous night. They must solve a series of hilarious mysteries to find their missing friend."
    },

    {
        title: "Avengers: Endgame",
        genre: "Action",
        rating: 8.4,
        poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        description: "After a devastating loss, the remaining Avengers come together for one final mission. They attempt to reverse the destruction caused by Thanos and restore hope to the universe."
    },

    {
        title: "Shutter Island",
        genre: "Thriller",
        rating: 8.2,
        poster: "https://image.tmdb.org/t/p/w500/4GDy0PHYX3VRXUtwK5ysFbg3kEx.jpg",
        description: "Two investigators travel to a remote island to investigate the disappearance of a patient from a psychiatric hospital. As they uncover strange clues, nothing seems to be what it first appears."
    },

    {
        title: "The Pursuit of Happyness",
        genre: "Drama",
        rating: 8.0,
        poster: "images/pursuit-of-happyness.jpg",
        description: "A struggling father faces homelessness and financial difficulties while trying to build a better future for his young son. Through determination, hard work and hope, he pursues a life-changing career opportunity."
    }

];


/* FAVORITES STORAGE */

let favorites = JSON.parse(
    localStorage.getItem("cinematchFavorites")
) || [];


/* DOM ELEMENTS */

const movieContainer = document.getElementById("movieContainer");
const favoriteContainer = document.getElementById("favoriteContainer");

const genreSelect = document.getElementById("genre");
const ratingSelect = document.getElementById("rating");
const searchInput = document.getElementById("search");

const resultCount = document.getElementById("resultCount");
const filterBtn = document.getElementById("filterBtn");

const movieModal = document.getElementById("movieModal");
const closeModal = document.getElementById("closeModal");

const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalGenre = document.getElementById("modalGenre");
const modalRating = document.getElementById("modalRating");
const modalDescription = document.getElementById("modalDescription");
const modalFavorite = document.getElementById("modalFavorite");

let selectedMovie = null;


/* DISPLAY MOVIES */

function displayMovies(movieList, container) {

    container.innerHTML = "";

    if (movieList.length === 0) {

        const message = document.createElement("div");

        message.className = "empty-message";

        message.textContent =
            container === favoriteContainer
                ? "You haven't saved any favourite movies yet. ❤️"
                : "No movies found. Try changing your filters.";

        container.appendChild(message);

        return;
    }

    movieList.forEach((movie) => {

        const card = document.createElement("div");

        card.className = "movie-card";

        const isFavorite = favorites.some(
            (item) => item.title === movie.title
        );

        card.innerHTML = `

            <img
                src="${movie.poster}"
                alt="${movie.title} poster"
                class="movie-poster"
            >

            <div class="movie-info">

                <h3>${movie.title}</h3>

                <p>${movie.genre}</p>

                <p class="rating">⭐ ${movie.rating}/10</p>

                <button class="details-btn">
                    View Details
                </button>

            </div>

            <button
                class="favorite-btn ${isFavorite ? "active" : ""}"
                aria-label="${isFavorite ? "Remove from" : "Add to"} favorites"
                title="${isFavorite ? "Remove from favorites" : "Add to favorites"}"
            >
                ${isFavorite ? "♥" : "♡"}
            </button>

        `;


        /* POSTER FALLBACK */

        const poster = card.querySelector(".movie-poster");

        poster.addEventListener("error", function () {

            const fallback = document.createElement("div");

            fallback.className = "poster-fallback";

            fallback.textContent = movie.title;

            poster.replaceWith(fallback);

        });


        /* FAVORITE BUTTON */

        const favoriteBtn = card.querySelector(".favorite-btn");

        favoriteBtn.addEventListener("click", function () {

            toggleFavorite(movie);

        });


        /* DETAILS BUTTON */

        const detailsBtn = card.querySelector(".details-btn");

        detailsBtn.addEventListener("click", function () {

            showMovieDetails(movie);

        });


        container.appendChild(card);

    });

}


/* RECOMMEND MOVIES */

function recommendMovies() {

    const selectedGenre = genreSelect.value;

    const minimumRating = Number(ratingSelect.value);

    const searchText = searchInput.value.toLowerCase().trim();


    const filteredMovies = movies.filter((movie) => {

        const genreMatch =
            selectedGenre === "All" ||
            movie.genre === selectedGenre;

        const ratingMatch =
            movie.rating >= minimumRating;

        const searchMatch =
            movie.title.toLowerCase().includes(searchText);

        return genreMatch && ratingMatch && searchMatch;

    });


    resultCount.textContent =
        `Showing ${filteredMovies.length} of ${movies.length} movies`;


    displayMovies(filteredMovies, movieContainer);

}


/* TOGGLE FAVORITES */

function toggleFavorite(movie) {

    const existingIndex = favorites.findIndex(
        (item) => item.title === movie.title
    );

    if (existingIndex === -1) {

        favorites.push(movie);

    } else {

        favorites.splice(existingIndex, 1);

    }


    localStorage.setItem(
        "cinematchFavorites",
        JSON.stringify(favorites)
    );


    recommendMovies();

    displayMovies(favorites, favoriteContainer);


    if (selectedMovie) {

        updateModalFavoriteButton();

    }

}


/* SHOW MOVIE DETAILS */

function showMovieDetails(movie) {

    selectedMovie = movie;

    modalPoster.src = movie.poster;
    modalPoster.alt = movie.title + " poster";

    modalTitle.textContent = movie.title;

    modalGenre.textContent =
        "🎭 Genre: " + movie.genre;

    modalRating.textContent =
        "⭐ Rating: " + movie.rating + "/10";

    modalDescription.textContent =
        movie.description;


    modalPoster.onerror = function () {

        this.style.display = "none";

    };

    modalPoster.onload = function () {

        this.style.display = "block";

    };


    updateModalFavoriteButton();

    movieModal.style.display = "flex";

}


/* UPDATE MODAL FAVORITE BUTTON */

function updateModalFavoriteButton() {

    if (!selectedMovie) return;

    const isFavorite = favorites.some(
        (item) => item.title === selectedMovie.title
    );

    modalFavorite.textContent = isFavorite
        ? "♥ Remove from Favorites"
        : "♡ Add to Favorites";

}


/* FAVORITE BUTTON INSIDE MODAL */

modalFavorite.addEventListener("click", function () {

    if (selectedMovie) {

        toggleFavorite(selectedMovie);

    }

});


/* CLOSE MODAL */

function closeMovieModal() {

    movieModal.style.display = "none";

    selectedMovie = null;

}


closeModal.addEventListener("click", closeMovieModal);


movieModal.addEventListener("click", function (event) {

    if (event.target === movieModal) {

        closeMovieModal();

    }

});


document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeMovieModal();

    }

});


/* EVENT LISTENERS */

filterBtn.addEventListener("click", recommendMovies);

genreSelect.addEventListener("change", recommendMovies);

ratingSelect.addEventListener("change", recommendMovies);

searchInput.addEventListener("input", recommendMovies);


/* INITIAL DISPLAY */

recommendMovies();

displayMovies(favorites, favoriteContainer);
