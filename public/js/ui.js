// setup materialize components
document.addEventListener("DOMContentLoaded", function () {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});

const breeds = document.querySelector(".breeds");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");

const setupUI = (user) => {
  if (user) {
    //toggle UI elements
    loggedInLinks.forEach((item) => (item.style.display = "block"));
    loggedOutLinks.forEach((item) => (item.style.display = "none"));
  } else {
    //toggle UI elements
    loggedInLinks.forEach((item) => (item.style.display = "none"));
    loggedOutLinks.forEach((item) => (item.style.display = "block"));
  }
};

// mobile sideNav
const sideNav = document.querySelector(".sidenav");
M.Sidenav.init(sideNav, {});

// Add breed
const forms = document.querySelectorAll(".side-form");
M.Sidenav.init(forms, { edge: "left" });

//image slider
const slider = document.querySelector(".slider");
M.Slider.init(slider, {
  height: 650,
  transition: 500,
  interval: 4000,
});

//autocomplete data
const autoComp = document.querySelector(".autocomplete");
M.Autocomplete.init(autoComp, {
  data: {
    "French Bulldog": null,
    "Golden Doodle": null,
    "Labrador Retriever": null,
    "German Shepherd": null,
    Poodle: null,
    Bulldog: null,
    Beagle: null,
    "Yorkshire Terrier": null,
    Boxer: null,
    "Siberian Husky": null,
    Dachshund: null,
    "Shih Tzu": null,
    Rottweiler: null,
    "Great Dane": null,
    Pug: null,
    "Doberman Pinscher": null,
    Chihuahua: null,
    "Golden Retriever": null,
    "Border Collie": null,
    "Australian Shepherd": null,
    "Cocker Spaniel": null,
    "Bernese Mountain Dog": null,
    "Basset Hound": null,
    "Boston Terrier": null,
    Dalmatian: null,
    "Chow Chow": null,
    Greyhound: null,
    "Shetland Sheepdog": null,
    Pomeranian: null,
    "Saint Bernard": null,
    Papillon: null,
  },
});

//Populate data
const setupBreeds = (data) => {
  let html = "";
  data.forEach((doc) => {
    const breed = doc.data();
    const li = `    
    <div class="card-panel task white row" data-id ="${breed.id}">
    <img src="/img/task.png" class="responsive-img materialboxed" alt="">
    <div class="task-detail">
        <div class="task-title">${breed.title}</div>
        <div class="task-description">${breed.description}</div>
    </div>
    <div class="task-delete">
        <i class="material-icons" data-id ="${breed.id}">delete_outline</i>
    </div>
</div>`;
    html += li;
  });

  breeds.innerHTML = html;
};

const renderBreed = (data, id) => {
  //adds document to webpage
  const html = `
  <div class="card-panel breed white row" data-id ="${id}">
            
            <div class="breed-detail">
                <div class="breed-title">${data.breed}</div>
                <div class="breed-description">${data.description}</div>
            </div>
            <div class="breed-delete">
                <i class="material-icons" data-id ="${id}">delete_outline</i>
            </div>
        </div>
  `;

  breeds.innerHTML += html;
};

//remove breed from DOM
const removeBreed = (id) => {
  const breed = document.querySelector(`.breed[data-id ="${id}"]`);
  breed.remove();
};
