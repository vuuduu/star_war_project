let nameH1;
let birthYearSpan;
let heightSpan;
let massSpan;
let filmsDiv;
let planetDiv;
const baseUrl = `https://swapi2.azurewebsites.net/api`;

// Runs on page load
addEventListener('DOMContentLoaded', () => {
  nameH1 = document.querySelector('h1#name');
  birthYearSpan = document.querySelector('span#birth_year');
  massSpan = document.querySelector('span#mass');
  heightSpan = document.querySelector('span#height');
  homeworldSpan = document.querySelector('span#homeworld');
  filmsUl = document.querySelector('#films>ul');
  const sp = new URLSearchParams(window.location.search)
  const id = sp.get('id')
  getCharacter(id)
});

async function fetchFilm(id) {
  let filmUrl = `${baseUrl}/films/${id}`;
  const filmResponse = await fetch(filmUrl).then(res => res.json())
  .then(responseJson => {
    localStorage.setItem(`film${responseJson.id}`, JSON.stringify(responseJson));
    return responseJson;
  });

  return filmResponse;
}

async function getCharacter(id) {
  // Try grabbing current character from browser cache
  var character = localStorage.getItem(`character${id}`);

  if (!character) {
    try {
      character = await fetchCharacter(id)
      character.homeworld = await fetchHomeworld(character)
      character.films = await fetchFilms(character)
    }
    catch (ex) {
      console.error(`Error reading character ${id} data.`, ex.message);
    }
    localStorage.setItem(`character${id}`, character);
  }
  renderCharacter(character);
  
  // Asynchronously preload content for all the links on the page
  
}
async function fetchCharacter(id) {
  let characterUrl = `${baseUrl}/characters/${id}`;
  return await fetch(characterUrl)
    .then(res => res.json())
}

async function fetchHomeworld(character) {
  const homeworldId = character?.homeworld;
  var planet = localStorage.getItem(`planet${homeworldId}`);

  if (!planet) {
    const url = `${baseUrl}/planets/${homeworldId}`;
    const planet = await fetch(url)
      .then(res => res.json());
    localStorage.setItem(`planet${homeworldId}`, JSON.stringify(planet));
  }
  
  return `planet${homeworldId}`;
}

async function fetchFilms(character) {
  const url = `${baseUrl}/characters/${character?.id}/films`;
  var filmKeyList = [];
  const films = await fetch(url)
    .then(res => res.json())
    .then(filmList => filmList.forEach(film => {
      var currFilm = localStorage.getItem(`film${film.id}`);

      if (!currFilm) {
        fetchFilm(film.id);
      }

      filmKeyList.push(`film${film.id}`);
    }))
  return filmKeyList;
}

const renderCharacter = character => {
  document.title = `SWAPI - ${character?.name}`;  // Just to make the browser tab say their name
  nameH1.textContent = character?.name;
  heightSpan.textContent = character?.height;
  massSpan.textContent = character?.mass;
  birthYearSpan.textContent = character?.birth_year;
  // Grabs homeworldObject from local storage
  const homeworldObject = JSON.parse(localStorage.getItem(character?.homeworld));
  homeworldSpan.innerHTML = `<a href="/planet.html?id=${homeworldObject.id}">${homeworldObject.name}</a>`;
  const filmsList = character?.films?.map(filmKey => {
    const filmObject = JSON.parse(localStorage.getItem(filmKey));
    console.log(filmObject);
    return `<li><a href="/film.html?id=${filmObject.id}">${filmObject.title}</li>`;
  })
  filmsUl.innerHTML = filmsList.join("");
}
