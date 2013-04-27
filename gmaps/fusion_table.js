var arealayer, afflayer, transitLayer, map;

function initGMap() {
    var boston_latlng = new google.maps.LatLng(42.37, -71.1);
    var mapProp = {
        center: boston_latlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    map = new google.maps.Map(document.getElementById("gmap") ,mapProp);

    arealayer = new google.maps.FusionTablesLayer({
        query: {
            select: "Latitude",
            from: "1Qo9SLRIPdSb0EQ3hZkmhZ3zwFliDZFJBlq-Lr7I",
        }, 
        styles:[{
            markerOptions:{
                iconName: "small_green",
                animation: google.maps.Animation.DROP
            }
        }]
    });

    afflayer = new google.maps.FusionTablesLayer({
        query: {
            select: "Latitude",
            from: "1eQqFnqJ2QvYRWPNgqrD-ou06vEXHNCZ7YCAD6-4",
        }, 
        styles:[{
            markerOptions:{
                iconName: "small_red",
                animation: google.maps.Animation.DROP
            }
        }]
    });

    transitLayer = new google.maps.TransitLayer();
}

// Hide the current data overlays
function clearOverlays() {
    // TODO: clear the form selections
    arealayer.setMap(null);
    afflayer.setMap(null);
    transitLayer.setMap(null);
}

// Show the selected data overlays
function showOverlays() {
    clearOverlays();
    var cat = $('input[name=category]:checked').val();
    var transit = $('input[name="transit"]:checked').val();
    if(cat == "AREA"){
        arealayer.setMap(map);
    }
    else if (cat == "AFFILIATION"){
        afflayer.setMap(map);   
    }
    if(transit == "on"){
        transitLayer.setMap(map);
    }
}

$(document).ready(function() {
    initGMap();
    showOverlays();
});
