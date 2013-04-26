function initGMap() {
    var boston_latlng = new google.maps.LatLng(42.37, -71.1);
    var mapProp = {
        center: boston_latlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    var map = new google.maps.Map(document.getElementById("gmap") ,mapProp);

    var layer = new google.maps.FusionTablesLayer({
        query: {
            select: "Latitude",
            from: "1zy3N82N7aj07_hRhlm3JlDPe8nSnzrQeMg-_vEA",
        }
    });
    layer.setMap(map);
}

$(document).ready(function() {
    initGMap();
});
