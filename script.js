// I. Setting up the Leaflet map

// We are able to call any function on the map because we loaded the Leaflet library (as a script in the html file head). And we call functions by saying 'L.functionFromLibrary'

// First we need to initialize the map and set its view to our chosen geographical coordinates (latitude and logitude) and zoom level. Coordinates and zoom here are the settings for what the map should show when it first loads. In this case we use "0, 0" for the coordinates and "1" for the zoom level, which means there is no zoom.
const map = L.map('map').setView([0, 0], 2)

// Second we need create a tile layer. For that we should specify the tiles - the images of the map itself. This is how all this type of maps work, they take any part of the map that you want to show and load a bunch of tiles simultaniously, tile them together and show that map as you're zooming in out and moving around. Leaflet allows to use any tiles providers, such as Mapbox, Stamen, Thunderforest, OpenStreetMap. The OpenStreetMap does not require a token or key, therefor we use it in this example.
// 1. Here we use tiles from Open Street Map. We are required (by the OpenStreetMap's copyright notice) to use the attribution
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// 2. Now we can create tiles variable, which actually is the tile layer. The variable requires tileUrl and the attribution (we use curly brackets arround the attribution because it's expecting it in the form of an object).
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tiles = L.tileLayer(tileUrl, {attribution})
// 3. Now we can add the tiles to the map
tiles.addTo(map)

// II. 