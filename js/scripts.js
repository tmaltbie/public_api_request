const body = document.querySelector('body')
const searchBar = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
const url = 'https://randomuser.me/api/?nat=us'
// const url = 'https://fsjs-public-api-backup.herokuapp.com/api'


// ------------------------------------------
//  SEARCH
// ------------------------------------------

//create form element with action=# and method=GET
const form = document.createElement('form');
form.action = '#';
form.method = "GET";
//create input, type="search" id="search-input" class="search-input" placeholder="Search..."
const searchInput = document.createElement('input');
searchInput.type = 'search';
searchInput.id = 'search-input';
searchInput.classList.add('search-input');
searchInput.placeholder = 'Search...';
//create input2, type="submit", value="&#x1F50D;" id="search-submit" class="search-submit"
const searchSubmit = document.createElement('input');
searchSubmit.type = 'submit';
searchSubmit.value;
searchSubmit.id = 'search-input';
searchInput.classList.add('search-submit');
//append inputs to form
form.appendChild(searchInput);
form.appendChild(searchSubmit);
//append form to searchBar 
searchBar.appendChild(form);

// ------------------------------------------
//  GALLERY
// ------------------------------------------

//create function that will generate user cards:
const generateCardHTML = (img, firstName, lastName, email, city, state) => {
  const card = document.createElement('div');
  const imgContainer = document.createElement('div');
  const infoContainer = document.createElement('div');

  card.classList.add('card');
  imgContainer.classList.add('card-img-container');
  infoContainer.classList.add('card-info-container'); 

  gallery.appendChild(card);
  card.appendChild(imgContainer);
  card.appendChild(infoContainer);
  imgContainer.innerHTML = `
      <img class='card-img' src=${img} alt='profile picture'>
  `;
  infoContainer.innerHTML = `
      <h3 id="name" class="card-name cap">${firstName} ${lastName}</h3>
      <p class="card-text">${email}</p>
      <p class="card-text cap">${city}, ${state}</p>
  `;
}

// ------------------------------------------
//  FETCH DATA
// ------------------------------------------

for (let i=0; i<12; i++) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const Img = data.results[0].picture.large;
            const FirstName = data.results[0].name.first;
            const LastName = data.results[0].name.last;
            const userEmail = data.results[0].email;
            const city = data.results[0].location.city
            const state = data.results[0].location.state
            const userPhone = data.results[0].phone;
            const userAddrNum = data.results[0].location.street.number;
            const userAddrStreet = data.results[0].location.street.name;
            const dateObj = new Date(data.results[0].dob.date);
            const month = dateObj.getUTCMonth() + 1;
            const day = dateObj.getUTCDate();
            const year = dateObj.getUTCFullYear();
            const bDay = console.log(`${month}/${day}/${year}`);

            generateCardHTML(Img, FirstName, LastName, userEmail, city, state);
        });
}

// ------------------------------------------
//  MODAL
// ------------------------------------------

// create modal:
const modalContainer = document.createElement('div');
modalContainer.classList.add('modal-container');
body.appendChild(modalContainer)
modalContainer.style.display = 'none'

const card = document.querySelector('.card')

card.addEventListener('click', () => {
    console.log('poop')
   // modalContainer.style.display = '';
  
})

