const baseUrl = `https://swapi2.azurewebsites.net/api`;
let terrainSpan;
let climateSpan;
let populationSpan;
let planetNameH1;
let filmsSection;
let charactersSection;

addEventListener("DOMContentLoaded", () => {
    terrainSpan = document.querySelector("span#terrain");
    climateSpan = document.querySelector("span#climate");
    populationSpan = document.querySelector("span#population");
    planetNameH1 = document.querySelector("h1#name");
    charactersSection = document.querySelector("section#characters");
    filmsSection = document.querySelector("section#films");

    const sp = new URLSearchParams(window.location.search);
    const id = sp.get('id');
    getPlanet(id);

});

async function getPlanet(planetId) {
    var planetObj;
    try {
        planetObj = await fetchPlanet(planetId);
        planetObj.characters = await fetchCharacters(planetObj);
        planetObj.films = await fetchFilms(planetObj);
    }
    catch (ex) {
        console.error(`Error loading planet ${planetId}`, ex.message);
    }

    renderPlanet(planetObj);
}

async function fetchPlanet(planetid) {
    let planetUrl = `${baseUrl}/planets/${planetid}`;
    return await fetch(planetUrl).then(res => res.json());
};

async function fetchCharacters(planetObj) {
    const url = `${baseUrl}/planets/${planetObj?.id}/characters`;
    const characters = await fetch(url)
        .then(res => res.json());
    return characters;
}

async function fetchFilms(planetObj) {
    const url = `${baseUrl}/planets/${planetObj?.id}/films`;
    const films = await fetch(url)
      .then(res => res.json())
    return films;
}

const renderPlanet = planetObj => {
    document.title = `SWAPI - ${planetObj?.name}`;  // Just to make the browser tab say their name

    planetNameH1.textContent = planetObj?.name;
    terrainSpan.textContent = planetObj?.terrain;
    climateSpan.textContent = planetObj?.climate;
    populationSpan.textContent = planetObj?.population;

    const characterList = planetObj?.characters?.map(char => `<li><a href="/character.html?id=${char.id}">${char.name}</li>`)
    charactersSection.innerHTML = characterList.join("");

    const filmsList = planetObj?.films?.map(film => `<li><a href="/film.html?id=${film.id}">${film.title}</li>`)
    filmsSection.innerHTML = filmsList.join("");
}