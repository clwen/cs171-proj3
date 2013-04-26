function initGMap() {
    var boston_latlng = new google.maps.LatLng(42.37, -71.1);
    var mapProp = {
        center: boston_latlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("gmap") ,mapProp);

    var marker = new google.maps.Marker({
        position: boston_latlng,
    });
    marker.setMap(map);

    var infowindow = new google.maps.InfoWindow({
        content: "hello info",
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
}

$(document).ready(function() {
    initGMap();
});
