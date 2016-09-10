jQuery.noConflict();
(function ($) {
  $(document).ready(function ($) {

    // Initialize the platform object:
    var platform = new H.service.Platform({
    'app_id': 'aCeuaXJdZyeWBAGkjTTY',
    'app_code': 'NS_9MlRT5hnHMHXx_qo01g'
    });

    // Obtain the default map types from the platform object
    var maptypes = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    var map = new H.Map(
    document.getElementById('mapContainer'),
    maptypes.normal.map,
    {
      zoom: 11,
      center: { lng: -87.6405556, lat: 41.8822222 }
    });
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    
    // housing layer/group
    var housingGroup = new H.map.Group();
    map.addObject(housingGroup);

    var housingObjArr = [];
    var url = 'https://data.cityofchicago.org/api/views/s6ha-ppgi/rows.xml?accessType=DOWNLOAD'
    $.get(url, {
      // wait for the callback
    }).done( function (xml) {
      //console.log(xml);
      $(xml).find('row').each(function() {
        var entry = $(this);
        var housingObj = parseHousing(entry);
        addHousingMarker(housingObj);
        housingObjArr.push(housingObj);
        
      });
      console.log(housingObjArr);
    });

    // create obj from raw housing xml
    var parseHousing = function(entry) {
      houseObj = {}
      houseObj.communityArea = entry.find('community_area').text();
      houseObj.communityAreaNumber = entry.find('community_area_number').text();
      houseObj.propertyType = entry.find('property_type').text();
      houseObj.propertyName = entry.find('property_name').text();
      houseObj.address = entry.find('address').text();
      houseObj.zipCode = entry.find('zip_code').text();
      houseObj.phoneNumber = entry.find('phone_number').text();
      houseObj.managementCompany = entry.find('management_company').text();
      houseObj.xCoord = entry.find('x_coordinate').text();
      houseObj.yCoord = entry.find('y_coordinate').text();
      houseObj.lat = entry.find('latitude').text();
      houseObj.lon = entry.find('longitude').text();
      return houseObj;
    }

    /* Drawing Functions */

    var addHousingMarker = function(obj) {
      //41.9133256466
      //-87.7103171384
      console.log(obj.lat);
      if(obj.lat != '') {
        var size = new H.math.Size(40,40);
        var markerIcon = new H.map.Icon('img/marker.png',{size:size});
        var coords = {lat: parseFloat(obj.lat), lng: parseFloat(obj.lon)},
        //var coords = {lat: 41.9133256466, lng: -87.7103171384};
        marker = new H.map.Marker(coords, {icon: markerIcon});
        // Add the marker to the map and 
        //map.addObject(marker);
        
        housingGroup.addObject(marker);
      }
    }

  }); // end document load

})(jQuery);