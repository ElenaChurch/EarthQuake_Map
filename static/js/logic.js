async function main() {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    const data = await response.json();
    console.log(data);

    // creating array to hold marker information
    const earthquakemarkers=[]
    let features = data.features
    
    // looping through features
    for (let i = 0; i< features.length; i++) {
       let featurelocation = features[i].geometry;
       console.log(featurelocation)
       let featuresinfo = features[i].properties.place;
       
       // creating variable to customize circle marker
       let mag = features[i].properties.mag;
       
        let depth = featurelocation.coordinates[2]
        
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
       
       // creating each marker 
        let earthquake= L.circleMarker([featurelocation.coordinates[1],featurelocation.coordinates[0]],{radius: radius, fillColor: color}).bindPopup(featuresinfo)
        earthquakemarkers.push(earthquake)
    };

  

       
    //layer group made of earthquakmarkers
    const earthquakes= L.layerGroup(earthquakemarkers);

    //tile layer
    const worldmap= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    // baseMaps object
    const baseMaps = {
       "World Map": worldmap
    };
   
    // overlay map object with earthquakes
    const overlayMaps = {
        "Earthquakes": earthquakes
    };
    
    // map object 
    const map = L.map("map", {
        center: [40.73, -74.0059],
        zoom: 2,
        layers: [worldmap,earthquakes]
    });

    //layer control 
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map); 
  
  
    // creating color key 
    //https://gis.stackexchange.com/questions/133630/adding-leaflet-legend
  function getColor(d) {
    return d === '90'  ? 'red':
           d === '70-90'  ? 'orange' :
           d === '50-70' ? '#f5a451' :
           d === '30-50' ? 'yellow' :
           d== '10-30'?'lightgreen':
           d== '-10-10' ? 'green':
           'black';
 
    }

    //https://www.youtube.com/watch?v=WXSIU05It4g&list=PLNCPalajQvg55_lI2bkO2mvESqxrTwyJJ&index=5

    var legend = L.control({position: 'bottomright'})
        legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');    
    var labels = ['90+','70-90','50-70','30-50','10-30','-10-10'];
    var grades = [91,71,51,31,41,1];
    div.innerHTML='<div><b>Legend</b></div';
    for(var i = 0; i<grades.length; i++) {
        div.innerHTML+='<i style="background:'
        + getColor(grades[i]) + '>&nbsp;&nbsp;</i>&nbsp;&nbsp;' +labels[i]+'<br/>';
    }
    return div;

}
legend.addTo(map)
}
main()