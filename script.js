/*nav bar*/
let menu=document.querySelector("#menu-btn");
let navbar=document.querySelector(".header .navbar");

menu.onclick = ()=>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

window.scroll = ()=>{
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
}

/*slider*/
var swiper = new Swiper(".home-slider", {
    loop:true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });


  var swiper = new Swiper(".reviews-slider", {
    loop:true,
    spaceBetween:20,
    autoHeight:true,
    grabCursor:true,
   breakpoints: {
        640: {
          slidesPerView: 1,
         
        },
        768: {
          slidesPerView: 2,
          
        },
        1024: {
          slidesPerView: 3,
          
        },
      },
  });


/* fetch data api */
const API_URL = "https://api.tvmaze.com/search/shows?q="; 


async function fetchMovies(query) {
  showLoader(); 
  const API_URL = "https://api.tvmaze.com/search/shows?q=";

  try {
    const response = await fetch(API_URL + query);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();

    hideLoader(); 

    if (data.length === 0) {
      displayNoResultsMessage(query);
    } else {
      renderMovies(data);
    }
  } catch (error) {
    hideLoader(); 
    console.error("Error fetching movies:", error);
    alert("Something went wrong while fetching movies!");
  }
}

function displayNoResultsMessage(query) {
  const movieGrid = document.getElementById("movie-grid");
  movieGrid.innerHTML = `
    <div class="no-results">
      <p class="no-result-message">No results found for "${query}". Please try a different search term.</p>
    </div>
  `;
}

function showLoader() {
  const movieGrid = document.getElementById("movie-grid");
  movieGrid.innerHTML = `
    <div class="loader">
      <p>Loading...</p>
    </div>
  `;
}

function hideLoader() {
  const loader = document.querySelector(".loader");
  if (loader) loader.remove();
}




/* function to dynamically render the movies in the grid:*/

function renderMovies(movies) {
  const movieGrid = document.getElementById("movie-grid");
  movieGrid.innerHTML = ""; 

  movies.forEach((movieData) => {
    const movie = movieData.show || movieData; 
    const movieItem = document.createElement("div");
    movieItem.className = "movie-item";

    movieItem.innerHTML = `
    <div class="box" data-aos="fade-right" data-aos-duration="1000">
    <div class="image">
    <img src="${movie.image ? movie.image.medium : 'placeholder.jpg'}" alt="${movie.name}" />
        <button class="close-btn">✖</button>
         <button class="add-to-grid">Add to Favorites</button>
    </div>

    <div class="content">
    <h3>${movie.name}</h3>
    <p>${movie.summary ? movie.summary.slice(0, 100) + "..." : "No description available."}</p>
       
    </div>
</div>
      
      
      
      
    `;
    








    movieGrid.appendChild(movieItem);
  });
}
/* an event listener to the search */

/*document.getElementById("search-input").addEventListener("keyup", async () => {
  const query = document.getElementById("search-input").value.trim();
  if (!query) return alert("Please enter a search term!");

  const movies = await fetchMovies(query);
  renderMovies(movies);
});*/
document.getElementById("search-input").addEventListener("keyup", async () => {
  const query = document.getElementById("search-input").value.trim();
  if (!query) {
    alert("Please enter a search term!");
    return;
  }

  await fetchMovies(query);
});




let favorites = [];

function renderFavorites() {
  const favoriteGrid = document.getElementById("favorites-grid");
  favoriteGrid.innerHTML = ""; 

  favorites.forEach((movie) => {
    const movieItem = document.createElement("div");
    movieItem.className = "movie-item";

    movieItem.innerHTML = `
     <div class="box" data-aos="fade-right" data-aos-duration="1000">
    <div class="image">
    <img src="${movie.image ? movie.image.medium : 'placeholder.jpg'}" alt="${movie.name}" />
        <button class="close-btn ">✖</button>
        
    </div>

    <div class="content">
    <h3>${movie.name}</h3>
   <button class="remove-from-grid">Remove</button>
       
    </div>
</div>
    `;

    




    // Remove from favorites on click
    movieItem.querySelector(".remove-from-grid").addEventListener("click", () => {
      favorites = favorites.filter((fav) => fav.id !== movie.id);
      renderFavorites();
    });

    favoriteGrid.appendChild(movieItem);
  });
}

/*Modify the renderMovies function to add a listener for the "Add to Favorites" button:*/

function renderMovies(movies) {
  const movieGrid = document.getElementById("movie-grid");
  movieGrid.innerHTML = ""; 

  movies.forEach((movieData) => {
    const movie = movieData.show || movieData; 
    const movieItem = document.createElement("div");
    movieItem.className = "movie-item";

    movieItem.innerHTML = `
     <div class="box" data-aos="fade-right" data-aos-duration="1000">
    <div class="image">
    <img src="${movie.image ? movie.image.medium : 'images/no image.png'}" alt="${movie.name}" />
        <button class="close-btn">✖</button>
        <button class="add-to-grid">Add to Favorites</button>
    </div>

    <div class="content">
    <h3>${movie.name}</h3>
    <p>${movie.summary ? movie.summary.slice(0, 100) + "..." : "No description available."}</p>
       
    </div>
</div>
      
      
      
     
    `;

   









    // Add to favorites on click
    movieItem.querySelector(".add-to-grid").addEventListener("click", () => {
      if (!favorites.some((fav) => fav.id === movie.id)) {
        favorites.push(movie);
        renderFavorites();
      } else {
        alert("Already in favorites!");
      }
    });

    movieGrid.appendChild(movieItem);
  });
}



  