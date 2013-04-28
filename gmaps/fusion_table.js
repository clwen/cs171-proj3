var arealayer, afflayer, transitLayer, bikeLayer, map;

function initGMap() {
    var boston_latlng = new google.maps.LatLng(42.37, -71.1);
    var mapProp = {
        center: boston_latlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    map = new google.maps.Map(document.getElementById("gmap") ,mapProp);

    var affstyles = [[{
            markerOptions:{
                iconName: "small_yellow",
                animation: google.maps.Animation.DROP
            }
        },{
            where: "Affiliation = 'U'",
            markerOptions:{
                iconName: "small_red"
            }
        },{
            where: "Affiliation = 'G'",
            markerOptions:{
                iconName: "small_blue"
            }
        },{
            where: "Affiliation = 'FAC'",
            markerOptions:{
                iconName: "measle_turquoise"
            }
        },{
            where: "Affiliation = 'ADM'",
            markerOptions:{
                iconName: "small_purple"
            }
        },{
            where: "Affiliation = 'AS'",
            markerOptions:{
                iconName: "measle_grey"
            }
        },{ /// TODO: for some reason the affiliation styles for SS and AS are messed up (defaulting to yellow)
            where: "Affiliation = 'SS'",
            markerOptions:{
                iconName: "measle_brown"
            }
        }]];

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
        },{
            where: "Area = 'HAS'",
            markerOptions:{
                iconName: "small_yellow"
            }
        }]
    });

    afflayer = new google.maps.FusionTablesLayer({
        query: {
            select: "Latitude",
            from: "1eQqFnqJ2QvYRWPNgqrD-ou06vEXHNCZ7YCAD6-4",
        }, 
        styles: affstyles[0]
    });

    transitLayer = new google.maps.TransitLayer();
    bikeLayer = new google.maps.BicyclingLayer();
}

// Hide the current data overlays
function clearOverlays() {
    arealayer.setMap(null);
    afflayer.setMap(null);
    transitLayer.setMap(null);
    bikeLayer.setMap(null);
}

// Show the selected data overlays
function showOverlays() {
    clearOverlays();
    var cat = $('input[name=category]:checked').val();
    var mode = $('input[name="mode"]:checked').val();
    if(cat == "AREA"){
        arealayer.setMap(map);
    }
    else if (cat == "AFFILIATION"){
        afflayer.setMap(map);   
    }
    if(mode == "transit"){
        transitLayer.setMap(map);
    }
    else if(mode == "bike"){
        bikeLayer.setMap(map);
    }
}

$(document).ready(function() {
    initGMap();
    showOverlays();
});
