
var tableBody = document.getElementById('repo-table');
var fetchButton = document.getElementById('fetch-button')
var cityNameEl = document.getElementById("city-name")
var breweryAddressEl = document.getElementById("brewery-address")
var breweryCardContainer = document.querySelector(".brewery-deck")

function getCityName(event) {
  event.preventDefault();
  var cityName = cityNameEl.value
  cityName = cityName.replace(" ", "_").toLowerCase()
  console.log(cityName)
  getApi(cityName)
}

function getApi(city) {

  var requestUrl = "https://api.openbrewerydb.org/breweries?by_city=" + city;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      var filterData = data.filter(function(brewery){
        return brewery.latitude && brewery.longitude
      })
      placePins(filterData)
      breweryCardContainer.textContent = ""
      for (var i = 0; i < data.length; i++) {

        var createBreweryCardEl = document.createElement("div");
        createBreweryCardEl.classList.add("brewery-card");
        var breweryData = document.createElement("p");
        var text = document.createElement("h4");
        text.textContent = data[i].name;
        createBreweryCardEl.appendChild(text);
        createBreweryCardEl.appendChild(breweryData);
        var breweryData = document.createElement("p");
        var text = document.createElement("p");
        text.textContent = data[i].street;
        createBreweryCardEl.appendChild(text);
        createBreweryCardEl.appendChild(breweryData);
        var breweryData = document.createElement("p");
        var text = document.createElement("p");
        text.textContent = data[i].city;
        createBreweryCardEl.appendChild(text);
        createBreweryCardEl.appendChild(breweryData);
        var breweryData = document.createElement("p");
        var text = document.createElement("p");
        text.textContent = data[i].website_url;
        createBreweryCardEl.appendChild(text);
        createBreweryCardEl.appendChild(breweryData);
        // add button
        var addButton = document.createElement("button");
        addButton.innerHTML = '<i class="fa fa-plus-square" aria-hidden="true"></i>';
        addButton.classList.add("add-button");
        createBreweryCardEl.appendChild(addButton);
        breweryCardContainer.appendChild(createBreweryCardEl)






        let save = data[i];
        // console.log(save);
        function saveBrewery() {
          var saved = JSON.parse(localStorage.getItem("savedBrews")) || [];

          var haveBrewery = false 
          for (var i = 0; i<saved.length; i++){
            if (saved[i].name === save.name) {
              haveBrewery = true
            }
          }
          if (!haveBrewery) {
            saved.push(save);
            localStorage.setItem("savedBrews", JSON.stringify(saved));
          }
          loadLocalStorage ()

        };
        
        addButton.addEventListener("click", function () { saveBrewery(save) });

      }
    })
};
function loadLocalStorage () {
  var saved = JSON.parse(localStorage.getItem("savedBrews")) || [];
  var beers = document.getElementById("beer");

  var brewNames = [];
  for (var i = 0; i<saved.length; i++){
    brewNames.push(saved[i].name)
  }
  beers.textContent = brewNames.join(", ");
}
loadLocalStorage()
fetchButton.addEventListener("click", getCityName);



// create saveBrewery
function saveBrewery(event){
  event.preventDefault();
  console.log("clicked");
};
// save brewery when click add button FOR EVERY BUTTON
var addButtons = document.querySelectorAll("add-button");
addButtons = document.addEventListener("click", saveBrewery);

function placePins(data){
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    var el = document.createElement('div');
    el.className = 'marker';
    new mapboxgl.Marker(el)
  .setLngLat([element.longitude,element.latitude])
  .addTo(map);
  }
}

