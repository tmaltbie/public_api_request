const body = document.querySelector('body')
// const searchBar = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
const url = 'https://randomuser.me/api/?results=12&nat=US'
// Backup API, if RandomUser.me is not working comment it out and uncomment this one:
// const url = 'https://fsjs-public-api-backup.herokuapp.com/api/'

/**
 * Fetch API information
 * If there is an error, display error to HTML
 */
fetch(url)
  .then(res => res.json())
  .then(data => generateCardHTML(data.results))
  .catch(error => {
      gallery.innerHTML = `<h2>Looks like there was a problem!</h2> <br> ${error}`
      gallery.style.display = 'block'
      gallery.style.color = 'crimson'
    })

/**
 * @function generateUserInfo uses the data from the API to generate and display employee cards.
 * search function is also added and allows user to filter results.
 * @param {API response} users 
 */
const generateCardHTML = (users) => {
  
  // loops over data
  for (let i=0; i<users.length; i++) {
    // creates card elements
    const user = users[i]
    const card = document.createElement('div');
    const imgContainer = document.createElement('div');
    const infoContainer = document.createElement('div');
    // classes and appending to DOM
    card.classList.add('card');
    imgContainer.classList.add('card-img-container');
    infoContainer.classList.add('card-info-container'); 
    gallery.appendChild(card);
    card.appendChild(imgContainer);
    card.appendChild(infoContainer);

    imgContainer.innerHTML = `
        <img class='card-img' src=${user.picture.large} alt='profile picture'>
    `;
    infoContainer.innerHTML = `
        <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
        <p class="card-text">${user.email}</p>
        <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
    `;

    // generates modal for specific employee card clicked
    card.addEventListener('click', () => {
      generateModalHTML(users, i)
    });
  };

  // create search bar
  const form = document.querySelector('.search-container')
  form.innerHTML = `
    <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
  `
  searchInput = document.getElementById('search-input')
  directoryFilter(searchInput)
};

/**
 * @function generateModalHTML uses the data from the API to generate and display modal cards.
 * 
 * @param {API response} users 
 * @param {index} index
 */
const generateModalHTML = (users, index) => {
  const user = users[index]
  // create modal elements for DOM
  const modalContainer = document.createElement('div');
  const modal = document.createElement('div')
  const modalBtn = document.createElement('button')
  const modalInfoContainer = document.createElement('div')
  const modalBtnContainer = document.createElement('div')
  const prev = document.createElement('button')
  const next = document.createElement('button')
  
  //reformat birthday
  const dateObj = new Date(user.dob.date);
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const bDay = `${month}/${day}/${year}`;

  // style, classes, display:
  modalContainer.classList.add('modal-container');
  modal.classList.add('modal');
  modalBtn.id = 'modal-close-btn';
  modalBtn.classList.add('modal-close-btn');
  modalBtn.innerHTML = '<strong>X</strong>';
  modalBtnContainer.classList.add('modal-btn-container');

  modalInfoContainer.innerHTML = `
    <img class='modal-img' src='${user.picture.large}' alt='profile picture'>
    <h3 id='name' class='modal-name cap'> ${user.name.first} ${user.name.last} </h3>
    <p class='modal-text'> ${user.email} </p>
    <p class='modal-text cap'> ${user.location.city} </p>
    <hr>
    <p class='modal-text'> ${user.phone} </p>
    <p class='modal-text'> ${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode} </p>
    <p class='modal-text'> Birthday: ${bDay} </p>
  `;

  prev.innerHTML = `
    <button type='button' id='modal-prev' class='modal-prev btn'>Prev</button>
  `;
  next.innerHTML = `
    <button type='button' id='modal-next' class='modal-next btn'>Next</button>
  `;

  // append modal:
  body.appendChild(modalContainer);
  modalContainer.appendChild(modal);
  modal.appendChild(modalBtn);
  modal.appendChild(modalInfoContainer);
  modal.appendChild(modalBtnContainer);
  modalBtnContainer.appendChild(prev);
  modalBtnContainer.appendChild(next);

  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
      document.body.removeChild(modalContainer);
    };
  });

  // When the user clicks on <button> (x), close the modal
  document.querySelector('.modal-close-btn').addEventListener('click', () => {
      document.body.removeChild(modalContainer);
  });

  // call functions for modal buttons
  prevModal(prev, modalContainer, users, index)
  nextModal(next, modalContainer, users, index)
};

/**
 * @function prevModal creates eventListener for the previous modal button to cycle backwards through employee
 * directory. Can cycle continously.
 * 
 * @param {object} button - reference to the prev button in the modal
 * @param {object} modal - reference to the modal container  
 * @param {object} users - reference to the API data 
 * @param {object} index - reference to the index of each object in the API data array
 */
const prevModal = (button, modal, users, index) => {
  button.addEventListener('click', () => {
    let currIndex = users.indexOf(users[index])
    let prevUser = currIndex-1
    if (currIndex === 0) {
      prevUser = currIndex + (users.length-1)
    }
    document.body.removeChild(modal);
    generateModalHTML(users, prevUser)
  });
}

/**
 * @function nextModal creates eventListener for the previous modal button to cycle forwards through employee
 * directory. Can cycle continously.
 * 
 * @param {object} button - reference to the prev button in the modal
 * @param {object} modal - reference to the modal container  
 * @param {object} users - reference to the API data 
 * @param {object} index - reference to the index of each object in the API data array
 */
const nextModal = (button, modal, users, index) => {
  button.addEventListener('click', () => {
    let currIndex = users.indexOf(users[index])
    let nextUser = currIndex+1
     if (currIndex === users.length-1) {
       nextUser = currIndex - currIndex
     }
    document.body.removeChild(modal);
    generateModalHTML(users, nextUser)
  });
} 

/**
 * @function directoryFilter cycles through the directory and shows the user matching cards.
 * hides cards that do not match.
 * 
 * @param {object} input - reference to the input element of the search bar. 
 * 
 */
const directoryFilter = (input) => {
  const names = document.querySelectorAll('.card-name')
  input.addEventListener('keyup', (e) => {
    const searchString = e.target.value
    for (let i=0; i<names.length; i++){
      if (!(names[i].innerHTML.toLowerCase().includes(searchString.toLowerCase()))) {
        names[i].parentElement.parentElement.style.display = 'none'
      } else {
        names[i].parentElement.parentElement.style.display = ''
      }
    }
  })
}
