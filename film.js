let titleH1;
let episodeSpan;
let releaseDateSpan;
let directorSpan;
let producerSpan;
let openingCrawlSpan;
let charactersDiv;
let planetsDiv;
const baseUrl = `https://swapi2.azurewebsites.net/api`;

// Runs on page load
addEventListener('DOMContentLoaded', () => {
  titleH1 = document.querySelector('h1#title');
  episodeSpan = document.querySelector('span#episode');
  releaseDateSpan = document.querySelector('span#releaseDate');
  directorSpan = document.querySelector('span#director');
  producerSpan = document.querySelector('span#producer');
  openingCrawlSpan = document.querySelector('span#openingCrawl');
  charactersUl = document.querySelector('#characters>ul');
  planetsUl = document.querySelector('#planets>ul');
  const sp = new URLSearchParams(window.location.search);
  const id = sp.get('id');
  getFilm(id);
});

async function getFilm(id) {
  let film;
  try {
    film = await fetchFilm(id);
    film.characters = await fetchCharacters(id);
    film.planets = await fetchPlanets(id);
    console.log(film);
  }
  catch (ex) {
    console.error(`Error reading film ${id} data.`, ex.message);
  }
  renderFilm(film);

}

async function fetchFilm(id) {
  let filmUrl = `${baseUrl}/films/${id}`;
  return await fetch(filmUrl)
    .then(res => res.json())
}

async function fetchCharacters(id) {
  const url = `${baseUrl}/films/${id}/characters`;
  const characters = await fetch(url)
    .then(res => res.json())
  return characters;
}

async function fetchPlanets(id) {
  const url = `${baseUrl}/films/${id}/planets`;
  const planets = await fetch(url)
    .then(res => res.json())
  return planets;
}

const renderFilm = film => {
  document.title = `SWAPI - ${film?.title}`;  // Just to make the browser tab say their name
  titleH1.textContent = film?.title;
  episodeSpan.textContent = film?.episode_id;
  releaseDateSpan.textContent = film?.release_date;
  directorSpan.textContent = film?.director;
  producerSpan.textContent = film?.producer;
  openingCrawlSpan.textContent = film?.opening_crawl;
  const characterList = film?.characters?.map(character => `<li><a href="/character.html?id=${character.id}">${character.name}</li>`);
  charactersUl.innerHTML = characterList.join("");
  const planetList = film?.planets?.map(planet => `<li><a href="/planet.html?id=${planet.id}">${planet.name}</li>`)
  planetsUl.innerHTML = planetList.join("");
}
