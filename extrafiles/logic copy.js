async function main() {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    const data = await response.json();
    console.log(data.features[10].properties.place);

    //map stuff

    const myMap = L.map("map", {
        center: [37.7749, -122.4194],
        zoom: 2
    });

  // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    L.geoJson(data, {
        style: function (feature) {
            let mag = feature.properties.mag;
            let depth = feature.geometry.coordinates[2]
            let radius = mag == 0 ? 1 : mag * 4;
            let color = depth > 90
                ?  'red'
                : depth > 70
                    ? 'orange'
                    : depth > 50
                        ? '#f5a451'
                        : depth > 30
                        ? 'yellow'
                        : depth >10
                        ? 'lightgreen'
                        : 'green'

            return {
                opacity: 1,
                fillOpacity: 1,
                fillColor: color,
                color: '#000000',
                radius: radius,
                weight: 2
            }
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng)
        },
        onEachFeature: function (feature, layer) {
            let mag = feature.properties.mag;
            let place = feature.properties.place;
           layer.bindPopup(`<h4>${place}<br>Magnitude:${mag}</h4>`) 
        }
    }).addTo(myMap);

    // // creating array to hold marker information
    // const earthquakemarkers=[]
    // let features = data.features
    // function markerSize(magnitude) {
    //     return Math.sqrt(magnitude) * 50;
    //   }
    
    // // looping through features
    // for (let i = 0; i< features.length; i++) {
    //    let featurelocation = features[i].geometry;
    //    console.log(featurelocation)
    //    let featuresinfo = features[i].properties.place;
    //    console.log(featuresinfo)
    //     // creating each marker 
    //     let earthquake= L.circle(
    //         [featurelocation.coordinates[1],featurelocation.coordinates[0]],{
    //         fillOpacity: 0.75,
    //         color: "white",
    //         fillColor: "purple",
    //         radius:markerSize(features[i].properties.mag)}).bindPopup(featuresinfo)
    //     earthquakemarkers.push(earthquake)
    // };
    

}
main()