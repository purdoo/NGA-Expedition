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
}

function locationError(msg) {
  console.log(msg);
}