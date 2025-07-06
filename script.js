const topContainer = document.querySelector(".parent-container");
const locateMeBtn = document.querySelector(".locate-me-initial");
const countrySelectionInput = document.getElementById("country-select");
let countryDiv = document.querySelector(".country");
const btnDiv = document.querySelector(".button");
const orElement = document.querySelector(".or");

function prepareHTML(data) {
  const preparedHtml = ` <div class="country">
        <img src="${data.flag}" />
        <div class="country-info">
          <h1 class="country-name">${data.name}</h1>
          <p class="continent">${data.region}</p>
          <p class="capital"><span class="emoji-span">🏛️</span> ${
            data.capital
          }</p>
          <p class="population-text">
            <span class="emoji-span">👫</span> ${(
              Number(data.population) / 1000000
            ).toFixed(2)} M People
          </p>
          <p class="language"><span class="emoji-span">🗣️</span> ${
            data.languages[0].name
          }</p>
          <p class="currency"><span class="emoji-span">💰</span>${
            data.currencies[0].name
          }</p>
        </div>`;
  return preparedHtml;
}

let lat, lng;
const locationFetched = true;

locateMeBtn.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position.coords);
      lat = position.coords.latitude;
      lng = position.coords.longitude;
    },
    function () {
      alert(`Please allow location access for proper functionality.`);
    }
  );
  //   orElement.textContent = "|";
  countryDiv = document.querySelector(".country");
  console.log(countryDiv);
  countrySelectionInput.value = "";
  if (!locationFetched) return;
  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.countryName);
      return fetch(
        `https://restcountries.com/v2/name/${data.countryName}?fullText=true`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const [dataReceived] = data;
      console.log(dataReceived);
      if (countryDiv) countryDiv.remove();
      topContainer.insertAdjacentHTML("afterbegin", prepareHTML(dataReceived));
    })
    .catch((err) => console.error(err));

  //   locateMeBtn.style.display = "none";
  locateMeBtn.classList.remove("locate-me-initial");
  locateMeBtn.classList.add("locate-me");
});

countrySelectionInput.addEventListener("focus", () => {
  countrySelectionInput.style.backgroundColor = "black";
  countrySelectionInput.size = 8;
  countrySelectionInput.padding = 0.5;
});

countrySelectionInput.addEventListener("blur", () => {
  countrySelectionInput.size = 1;
  countrySelectionInput.style.backgroundColor = "rgb(10, 133, 1)";
});

countrySelectionInput.addEventListener("change", () => {
  countrySelectionInput.size = 1;
  countrySelectionInput.blur();
  console.log(countrySelectionInput.value);
  const countryName = countrySelectionInput.value;
  fetch(`https://restcountries.com/v2/name/${countryName}?fullText=true`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(typeof data);
      const [dataReceived] = data;
      console.log(dataReceived);
      countryDiv = document.querySelector(".country");
      if (countryDiv) countryDiv.remove();
      topContainer.insertAdjacentHTML("afterbegin", prepareHTML(dataReceived));
    });
});
