const body = document.querySelector('body')
const searchBar = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
// const url = 'https://randomuser.me/api/?results=12?nat=us'
const url = 'https://fsjs-public-api-backup.herokuapp.com/api/'

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
//  FETCH DATA
// ------------------------------------------
function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function fetchData(url) {
  return fetch(url)
           .then(checkStatus)  
           .then(res => res.json())
}

fetchData(url)
  .then(data => {
    const arr = data.results
    for (let i=0; i<arr.length; i++) {
      const img = data.results[i].picture.large;
      const firstName = data.results[i].name.first;
      const lastName = data.results[i].name.last;
      const email = data.results[i].email;
      const city = data.results[i].location.city
      const state = data.results[i].location.state
      const phone = data.results[i].phone;
      const addrNum = data.results[i].location.street.number;
      const addrStreet = data.results[i].location.street.name;
      const zip = data.results[i].location.postcode;
      const dateObj = new Date(data.results[i].dob.date);
      const month = dateObj.getUTCMonth() + 1;
      const day = dateObj.getUTCDate();
      const year = dateObj.getUTCFullYear();
      const bDay = `${month}/${day}/${year}`;
      
      generateCardHTML(img, firstName, lastName, email, city, state, phone, addrNum, addrStreet, zip, bDay, function(){
        
        //this is not going to work x_x
        window.addEventListener('click', (e) => {
          if (e.target.tagName === 'BUTTON' && e.target.innerText === 'NEXT') {
            console.log('this is the next user:', data.results[i+1])
          }
        })
      })        
    }
  })
  .catch(error => console.log('Looks like there was a problem!', error))

// ------------------------------------------
//  GALLERY
// ------------------------------------------


const generateCardHTML = (img, firstName, lastName, email, city, state, zip, phone, addrNum, addrStreet, birthday, callback) => {
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
  
  card.addEventListener('click', (e) => {
    //call generateModalHTML function to generate modal for clicked user
    generateModalHTML(img, firstName, lastName, email, city, state, zip, phone, addrNum, addrStreet, birthday, callback)
  });
}

const generateModalHTML = (img, firstName, lastName, email, city, state, phone, addrNum, addrStreet, zip, birthday, callback) => {
  
  const modalContainer = document.createElement('div');
  const modal = document.createElement('div')
  const modalBtn = document.createElement('button')
  const modalInfoContainer = document.createElement('div')
  const modalBtnContainer = document.createElement('div')
  const modalPrev = document.createElement('button')
  const modalNext = document.createElement('button')

  // style, classes, display:
  modalContainer.classList.add('modal-container');
  modal.classList.add('modal');
  modalBtn.id = 'modal-close-btn';
  modalBtn.classList.add('modal-close-btn');
  modalBtn.innerHTML = '<strong>X</strong>';
  modalBtnContainer.classList.add('modal-btn-container');

  modalInfoContainer.innerHTML = `
    <img class='modal-img' src='${img}' alt='profile picture'>
    <h3 id='name' class='modal-name cap'> ${firstName} ${lastName} </h3>
    <p class='modal-text'> ${email} </p>
    <p class='modal-text cap'> ${city} </p>
    <hr>
    <p class='modal-text'> ${phone} </p>
    <p class='modal-text'> ${addrNum} ${addrStreet}, ${city}, ${state} ${zip} </p>
    <p class='modal-text'> Birthday: ${birthday} </p>
  `;

  modalPrev.innerHTML = `
    <button type='button' id='modal-prev' class='modal-prev btn'>Prev</button>
  `;
  modalNext.innerHTML = `
    <button type='button' id='modal-next' class='modal-next btn'>Next</button>
  `;

  // append modal:
  body.appendChild(modalContainer);
  modalContainer.appendChild(modal);
  modal.appendChild(modalBtn);
  modal.appendChild(modalInfoContainer);
  modal.appendChild(modalBtnContainer);
  modalBtnContainer.appendChild(modalPrev);
  modalBtnContainer.appendChild(modalNext);

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

  modalPrev.addEventListener('click', (e) => {
    console.log('click prev is functional', e.target.tagName, e.target.innerText);
    callback(modalPrev)
  });

  modalNext.addEventListener('click', () => {
    console.log('click next is functional');
    callback(modalNext)
  });
};

