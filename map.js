var geojson;
var legend;

////////////////////////////////////////////////////////////////
//                  MAKE THE MAP                              //
////////////////////////////////////////////////////////////////

var map = L.map('map').setView([37.8, -96], 4);
////////////////////////////////////////////////////////////////
//                  GET MAPBOX TILE LAYER                     //
////////////////////////////////////////////////////////////////
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    id: 'mapbox.light'
}).addTo(map);


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Abortion Restrictiveness</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.restrictions + ' restriction(s) </b><br />' + props.policies + '<sup></sup>'
        : 'Hover over a state');
};

info.addTo(map);


// get color depending on abortion restriction value
function getColor(d) {
    return  d > 9 ? '#750412' :
            d > 8 ? '#830F57' :
            d > 7 ? '#801A90' :   
            d > 6 ? '#51289E' :
            d > 5  ? '#384BAB' :
            d > 4  ? '#4A94B9' :
            d > 3  ? '#5EC6B2' :
            d > 2   ? '#73D390' :
            d > 1   ? '#9DE18B' :
            d > 0   ? '#D9EEA4'  :
                        '#FCEDC0'
                    
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.restrictions)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    info.update(layer.feature.properties);
}


function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

////////////////////////////////////////////////////////////////
//                  CREATE THE LEGEND                         //
////////////////////////////////////////////////////////////////
legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        num = grades[i];

        labels.push(
            '<i style="background:' + getColor(num) + '"></i> ' +
            num );
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);