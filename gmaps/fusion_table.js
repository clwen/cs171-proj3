var arealayer, afflayer, commutelayer, transitLayer, bikeLayer, map;
var areaicons = {
    U:{
        name:'Undergraduate Students',
        icon: 'http://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0'
    },
    G:{
        name:'Graduate Students',
        icon: 'http://storage.googleapis.com/support-kms-prod/SNP_2752068_en_v0'
    },
    F:{
        name:'Faculty',
        icon: 'http://storage.googleapis.com/support-kms-prod/SNP_2752129_en_v0'
    },
    A:{
        name:'Administration',
        icon: 'http://storage.googleapis.com/support-kms-prod/SNP_2752264_en_v0'
    },
    S:{
        name:'Staff',
        icon: 'http://storage.googleapis.com/support-kms-prod/SNP_2752063_en_v0'
    }
}

function initGMap() {
    var boston_latlng = new google.maps.LatLng(42.37, -71.1);
    var mapProp = {
        center: boston_latlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    map = new google.maps.Map(document.getElementById("gmap") ,mapProp);

    var styles = [[{
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
                iconName: "small_green"
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

    // Define the data layers
    // AREA
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
    // COMMUTE TYPE
    commutelayer = new google.maps.FusionTablesLayer({
        query: {
            select: "Latitude",
            from: "1KaFa7-nBJaPpN-65H63ru2L1pWLfzwOu4XeuqbM",
        }, 
        styles:[{
            markerOptions:{
                iconName: "small_blue",
                animation: google.maps.Animation.DROP
            }
        },{
            where: "Mode = 'T'",
            markerOptions:{
                iconName: "small_red"
            }
        }]
    });

    // AFFILIATION
    afflayer = new google.maps.FusionTablesLayer({
        query: {
            select: "Latitude",
            from: "1eQqFnqJ2QvYRWPNgqrD-ou06vEXHNCZ7YCAD6-4",
        }, 
        styles: styles[0]
    });

    transitLayer = new google.maps.TransitLayer();
    bikeLayer = new google.maps.BicyclingLayer();
}

// Hide the current data overlays
function clearOverlays() {
    hideLegend();
    arealayer.setMap(null);
    afflayer.setMap(null);
    commutelayer.setMap(null);
    transitLayer.setMap(null);
    bikeLayer.setMap(null);
}

// Add a legend
function renderLegend(icons){ // TODO: make legend flexible for area, affiliation and commute type color encodings
    var legend = document.getElementById('legend');
    legend.innerHTML = '';
    for (var key in icons) {
      var type = icons[key];
      var name = type.name;
      var icon = type.icon;
      var div = document.createElement('div');
      div.innerHTML = '<img src="' + icon + '"> ' + name;
      legend.appendChild(div);
    }
    legend.className = "visible";
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend); // TODO: weirdness of the position when it re-renders, maybe use absolute positioning
}

function hideLegend(){
    document.getElementById('legend').className="invisible";
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
        renderLegend(areaicons);
    }
    else if(cat == "COMMUTE"){
        commutelayer.setMap(map);
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
