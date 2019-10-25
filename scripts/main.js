const addMovieModal = document.getElementById("add-movie-modal");

async function getMoviesFromApi() {
  // Fetch send a Get request by default, first parameter is the url
  const response = await fetch(
    "https://powerful-bayou-93318.herokuapp.com/movies"
  );

  // when  response is recieved we only get the response body with .json() method
  const movies = await response.json();
  // looping over each  movie object

  movies.forEach(movie => {
    // ew create an html template markup for each movie
    let markup = `
          
            <div class="card-body">
              <h5 class="card-title">${movie.name}</h5>
              <p class="card-text">${movie.description}</p>
              <button class="btn btn-danger delete-movie" data-movieid="${
                movie._id
              }">Delete Movie</button>
            </div>
            <div class="card-footer">
            ${movie.genre
              .map(
                genre =>
                  `span class="badge badge-pill badge-primary m-1">${genre}</span`
              )
              .join("")}
        </div>

          
        `;
    let card = document.createElement("div"); // create a node that contains the template markup
    card.classList.add("card"); // add "card" class to card node
    card.style.width = "300px"; // add styles to card node
    card.innerHTML = markup; // fill card node with the template markup
    document.getElementById("movies").appendChild(card); //  append card nıde to movies
  });
}
async function postMovieToAPI(event) {
  //Prevent default behaviour of the current event which is the form
  event.preventDefault();

  // Get values of the form inputs

  const movieName = document.getElementById("movie-name").value;
  const movieDescription = document.getElementById("movie-description").value;
  const movieRelease = document.getElementById("movie-release").value;
  const movieGenres = document.getElementById("movie-genres").value;

  // split genres by "," then trim to avoid whitespaces

  const genreArray = movieGenres.split(",").map(genre => genre.trim());

  // prepare the body of the request , keys must match with the movie model

  const requestBody = {
    name: movieName,
    description: movieDescription,
    genre: movieGenres,
    release: movieRelease,
    genre: genreArray
  };

  // Give Options to Fetch like http method,additional headers etc.
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  };

  // SEnd the post request and await for response
  const response = await fetch(
    "https://powerful-bayou-93318.herokuapp.com/movies",
    options
  );

  const responseJson = await response.json();

  $("#add-movie-modal").modal("toggle"); //Toggle modal
  $("#movies").html(""); //Reset the content of the div with id movies
  getMoviesFromApi(); // Fetch all movies again
}

async function deleteMovieFromAPI() {
  const movieId = $(this).data("movieid");
  await fetch(`https://powerful-bayou-93318.herokuapp.com/movies/${movieId}`, {
    method: "DELETE"
  });
  $("#movies").html(""); // Reset the content of the div with id movies
  getMoviesFromApi(); //fetch all movies again
}

getMoviesFromApi(); // Fetch all movies when a user first enters the website

const addMovieForm = document.getElementById("add-movie-form");

/// ADD eventlistener for the form,when a user submit call postMovieToAPI
addMovieForm.addEventListener("submit", postMovieToAPI);

// Add evetn listener for classes of delete - movie inside movies container,whne any of the buttons clicked call delete movieFromAPI function

$("#movies").on("click", ".delete-movie", deleteMovieFromAPI);
