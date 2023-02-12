"use strict";

//`https://restcountries.com/v3.1/name/${country}`

///////////////////////////////////////////////////////////////////
//--------------------DOM ELEMENT SELECTORS---------------------

const input = document.querySelector(".search__input");
const countryContainer = document.querySelector(".country__container");
const searchBtn = document.querySelector(".search__btn");

///////////////////////////////////////////////////////////////////
//--------------------CALC POPULATION FUNCTION---------------------

const calcPopulation = (population) => {
  const populationTotal = population.toString();

  if (populationTotal.length > 9)
    return `${(population / 1000000000).toFixed(1)} billion people`;
  if (populationTotal.length < 10 && populationTotal.length > 6)
    return `${(population / 1000000).toFixed(1)} million people`;
  if (populationTotal.length < 7)
    return `${(population / 1000).toFixed(1)} thousand people`;
};

///////////////////////////////////////////////////////////////////
/*---------------------RENDER ERROR FUNCTION----------------*/

const renderError = (msg, element) => {
  const html = `
  <div id="error">
    <p class="error__msg">${msg}</p>
  </div>
  `;
  element.insertAdjacentHTML("beforeend", html);
  element.style.opacity = 1;
};

///////////////////////////////////////////////////////////////////
/*-----------------------RENDER COUNTRY FUNCTION----------------*/

const renderCountry = (country, element) => {
  const countrySecure = Object.freeze(country);
  const gini = countrySecure.gini ? Object.values(countrySecure.gini) : "n/a";
  const population = calcPopulation(countrySecure.population);

  const html = `
<article class="country__box" id="country__box">
  <div class="country__flagbox">
    <img src=${
      countrySecure.flags.png
    } alt="The national flag" class="country__flag" />
  </div>
  <div class="country__infobox">
    <h3>${countrySecure.name.common}</h3>
    <p><span>Continent:</span>${countrySecure.continents[0]}</p>
    <p><span>Capital:</span>${countrySecure.capital[0]}</p>
    <p><span>Population:</span>${population}</p>
    <p><span>Languages:</span>${Object.values(countrySecure.languages).join(
      ", "
    )}</p>
    <p><span>Currency:</span>${Object.values(
      Object.values(countrySecure.currencies)[0]
    )}</p>
    <p><span>Timezones:</span>${Object.values(countrySecure.timezones).join(
      ", "
    )}</p>
    <p><span>Gini index:</span>${gini}</p>
  </div>
</article>
`;
  element.insertAdjacentHTML("beforeend", html);
  element.style.opacity = 1;
};

///////////////////////////////////////////////////////////////////
//--------------------GET COUNTRY DATA FUNCTION---------------------

const getCountryData = async (country, element) => {
  try {
    const errorMsg = document.getElementById("error");
    if (errorMsg) errorMsg.remove();

    const countryBox = document.getElementById("country__box");
    if (countryBox) countryBox.remove();

    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);

    if (!res.ok) {
      throw new Error("Problem getting country data. Try again.");
    }

    const data = await res.json();
    renderCountry(data[0], element);
  } catch (err) {
    renderError(err, element);
  }
};

///////////////////////////////////////////////////////////////////
/*---------------------ENTER SEARCH EVENT HANDLER----------------*/

document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  if (e.key === "Enter") {
    e.preventDefault();
    const country = input.value.toLowerCase();
    getCountryData(country, countryContainer);
  }
});
