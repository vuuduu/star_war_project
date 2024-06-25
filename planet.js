const baseUrl = `https://swapi2.azurewebsites.net/api`;
let terrainSpan;
let climateSpan;
let populationSpan;
let planetNameH1;

addEventListener("DOMContentLoaded", () => {
    terrainSpan = document.querySelector("span#terrain");
    climateSpan = document.querySelector("span#climate");
    populationSpan = document.querySelector("span#population");
    planetNameH1 = document.querySelector("h1#name");

    const sp = new URLSearchParams(window.location.search);
    const id = sp.get('id');
    getPlanet(id);

});

async function getPlanet(planetId) {
    var planetObj;
    try {
        planetObj = await fetchPlanet(planetId);
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

const renderPlanet = planetObj => {
    document.title = `SWAPI - ${planetObj?.name}`;  // Just to make the browser tab say their name

    planetNameH1.textContent = planetObj?.name;
    terrainSpan.textContent = planetObj?.terrain;
    climateSpan.textContent = planetObj?.climate;
    populationSpan.textContent = planetObj?.population;
}