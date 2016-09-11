var getRouting = function() {
  if(navigator.geolocation) {  
    navigator.geolocation.getCurrentPosition(markLocation, locationError);
  } 
  else {
    alert("Browser does not support Geolocation.");
  }
}

function markLocation(location) {
  console.log(location);
  var currentPoint = new Point(, );
  var size = new H.math.Size(40,40);
  var markerIcon = new H.map.Icon('img/marker.png',{size:size});
  var coords = { lat: location.coords.latitude, lng: location.coords.longitude };
  marker = new H.map.Marker(coords, {icon: markerIcon, data:obj});
  // return marker object
  return marker;
}

function locationError(msg) {
  console.log(msg);
}