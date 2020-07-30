const body = document.querySelector('body')
const searchBar = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
const url = 'https://randomuser.me/api/?results=12&nat=US'
// const url = 'https://fsjs-public-api-backup.herokuapp.com/api/'

// ------------------------------------------
//  FETCH DATA
// ------------------------------------------
// function checkStatus(response) {
//   if (response.ok) {
//     return Promise.resolve(response);
//   } else {
//     return Promise.reject(new Error(response.statusText));
//   }
// }

// function fetchData(url) {
//   return fetch(url)
//            .then(checkStatus)  
//            .then(res => res.json())
// }

fetch(url)
  .then(res => res.json())
  .then(data => generateCardHTML(data.results))
  .catch(error => {
      gallery.innerHTML = `<h2>Looks like there was a problem!</h2> <br> ${error}`
      gallery.style.display = 'block'
      gallery.style.color = 'crimson'
    })

// ------------------------------------------
//  SEARCH BAR
// ------------------------------------------
const form = document.createElement('form');
form.action = '#';
form.method = "GET";

const searchInput = document.createElement('input');
searchInput.type = 'search';
searchInput.id = 'search-input';
searchInput.classList.add('search-input');
searchInput.placeholder = 'Search...';

const searchSubmit = document.createElement('input');
searchSubmit.type = 'submit';
searchSubmit.value;
searchSubmit.id = 'search-input';
searchInput.classList.add('search-submit');

form.appendChild(searchInput);
form.appendChild(searchSubmit);

searchBar.appendChild(form);

// ------------------------------------------
//  GENERATE CARD HTML AND SO MUCH MORE
// ------------------------------------------
const generateCardHTML = (users) => {
  
  for (let i=0; i<users.length; i++) {
    const user = users[i]
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
        <img class='card-img' src=${user.picture.large} alt='profile picture'>
    `;
    infoContainer.innerHTML = `
        <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
        <p class="card-text">${user.email}</p>
        <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
    `;
    card.addEventListener('click', () => {
      generateModalHTML(users, i)
    });
  };

  directoryFilter(searchInput)
};

const generateModalHTML = (users, index) => {
  const user = users[index]
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

  prevModal(prev, modalContainer, users, index)
  nextModal(next, modalContainer, users, index)
};

const prevModal = (previous, modal, users, index) => {
  previous.addEventListener('click', () => {
    let currIndex = users.indexOf(users[index])
    let prevUser = currIndex-1
    if (currIndex === 0) {
      prevUser = currIndex + (users.length-1)
    }
    document.body.removeChild(modal);
    generateModalHTML(users, prevUser)
  });
}

const nextModal = (next, modal, users, index) => {
  next.addEventListener('click', () => {
    let currIndex = users.indexOf(users[index])
    let nextUser = currIndex+1
     if (currIndex === users.length-1) {
       nextUser = currIndex - currIndex
     }
    document.body.removeChild(modal);
    generateModalHTML(users, nextUser)
  });
} 

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
