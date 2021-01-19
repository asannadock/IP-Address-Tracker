// I. Declairing variables
// To store output data
const outputIpAddress = document.querySelector('.output-ip-address-value')
const outputLocation = document.querySelector('.output-location-value')
const outputTimezone = document.querySelector('.output-timezone-value')
const outputIsp = document.querySelector('.output-isp-value')
// To store search input data
const searchInput = document.getElementById('search-input')
const searchSubmit = document.getElementById('search-submit')
const errorMessage = document.getElementById('error')
// Global variable for storing IP address
let ip = ''

// II. Displaying Leaflet map
// We are able to call any function on the map because we loaded the Leaflet library (as a script in the html file head). And we call functions by saying 'L.functionFromLibrary'. So, any function or method called in this script, which has a 'L.' before refer to the Leaflet library.

// First we need to initialize the map and set its view to our chosen geographical coordinates (latitude and logitude) and zoom level. Coordinates and zoom here are the settings for what the map should show when it first loads. In this case we use "0, 0" for the coordinates and "2" for the zoom level.
const map = L.map('map').setView([0, 0], 2)

// Second we need to create a tile layer. For that we should specify the tiles - the images of the map itself. This is how all this type of maps work, they take any part of the map that you want to show and load a bunch of tiles simultaniously, tile them together and show that map as you're zooming in out and moving around. Leaflet allows to use any tiles providers, such as Mapbox, Stamen, Thunderforest, OpenStreetMap. The OpenStreetMap does not require a token or key, therefor we use it in this example.
// 1. Here we use tiles from Open Street Map. We are required (by the OpenStreetMap's copyright notice) to use the attribution
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// 2. Now we can create tiles variable, which actually is the tile layer (const tiles). The variable requires tileUrl and the attribution (we use curly brackets arround the attribution because it's expecting it in the form of an object). In the tileUrl: s - for style, x and y - for latitude and longitude, z - for zoom.
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tiles = L.tileLayer(tileUrl, {attribution})
// 3. Now we can add the tiles to the map
tiles.addTo(map)

// III. Setting up a marker with custom icon
// Creating a custom icon for the marker
const myIcon = L.icon({
    iconUrl: 'images/icon-location.svg',
    iconSize: [40, 50]
});
// Setting up the marker, first in the [0, 0] coordinates.
//Later we'll change the marker position to point out the actual coordinates when we get them from IPify API 
const marker = L.marker([0,0], {icon: myIcon}).addTo(map)


// IV. Function to getting IP Geolocation data using IPify
async function getOutputData() {
    const api_url = `https://geo.ipify.org/api/v1?apiKey=at_8ks8dZy4pvWdDB9Gm2syN3zUJNnw7&ipAddress=${ip}`
    const response = await fetch(api_url)
    const outputData = await response.json()
    return outputData
}

// V. Function to displaying IP Geolocation data
function displayOutputData(outputData) {
    outputIpAddress.textContent = outputData.ip
    outputLocation.textContent = `${outputData.location.city}, ${outputData.location.region} ${outputData.location.postalCode}`
    outputTimezone.textContent = `UTC${outputData.location.timezone}`
    outputIsp.textContent = outputData.isp
    // Changing marker position to point out the actual coordinates (latitude and longitude)
    const latitude = `${outputData.location.lat}`
    const longintude = `${outputData.location.lng}`
    marker.setLatLng([latitude, longintude])
    // Changing the map view so that to have the marker oriented in the center of the screen and with a bit more zoom
    map.setView([latitude, longintude], 5)
}

// VI. Function to clearing IP Geolocation data
function clearOutputData() {
    outputIpAddress.textContent = ''
    outputLocation.textContent = ''
    outputTimezone.textContent = ''
    outputIsp.textContent = ''
    marker.remove(map)
}

// Chaining functions for showing IP Geolocation data on the page on the first load
getOutputData()
    .then( outputData => displayOutputData(outputData) )
    .catch( err => console.error )

// Getting submitted IP address Geolocation data and displaying it on the page
function searchIpAddress(event) {
    event.preventDefault()
    ip = searchInput.value
    getOutputData(ip)
        .then( outputData => {
            if (outputData.ip == undefined) {
                clearOutputData()
                errorMessage.style.visibility = 'visible'
            } else {
                errorMessage.style.visibility = 'hidden'
                displayOutputData(outputData)
                marker.addTo(map)
                searchInput.value = ''
            }
        })
        .catch( err => console.error )
}
// Submitting IP Address on click event
searchSubmit.addEventListener('click', event => {
    searchIpAddress(event)
})
// Submitting IP Address on 'Enter' key press
searchSubmit.addEventListener('keyup', event => {
    if(keyCode === 13) {
        searchIpAddress(event)
    }
})