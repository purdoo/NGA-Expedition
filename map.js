jQuery.noConflict();
(function ($) {
  $(document).ready(function ($) {
    // globals
    var appId = 'aCeuaXJdZyeWBAGkjTTY';
    var appCode = 'NS_9MlRT5hnHMHXx_qo01g';

    // Initialize the platform object:
    var platform = new H.service.Platform({
    'app_id': appId,
    'app_code': appCode
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

    /* Map Event Handlers */
    /*
    map.addEventListener('tap', function(evt) {
      console.log(evt);
      console.log(evt.type, evt.currentPointer.type);

    });
    */    

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
      //console.log(housingObjArr);
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

    var censusObjDictionary = {};
    var censusUrl = 'https://data.cityofchicago.org/api/views/kn9c-c2s2/rows.xml?accessType=DOWNLOAD'
    $.get(censusUrl, {
      // wait for the callback
    }).done( function (xml) {
      //console.log(xml);
      $(xml).find('row').each(function() {
        var entry = $(this);
        var censusObj = parseCensus(entry);
        //TODO : addHousingMarker(housingObj);
        censusObjDictionary[censusObj.communityAreaNumber] = censusObj
        
      });
      //console.log(censusObjDictionary);
    });

    // create obj from raw census data xml
    var parseCensus = function(entry) {
      censusObj = {}
      censusObj.communityArea = entry.find('community_area_name').text();
      censusObj.communityAreaNumber = entry.find('ca').text();
      censusObj.percentHousingCrowded = entry.find('percent_of_housing_crowded').text();
      censusObj.percentHouseholdsBelowPoverty = entry.find('percent_households_below_poverty').text();
      censusObj.percentAged16Unemployed = entry.find('percent_aged_16_unemployed').text();
      censusObj.percentAged25NoDiploma = entry.find('percent_aged_25_without_high_school_diploma').text();
      censusObj.percentAgedUnder18orOver64 = entry.find('percent_aged_under_18_or_over_64').text();
      censusObj.perCapitaIncome = entry.find('per_capita_income_').text();
      censusObj.hardshipIndex = entry.find('hardship_index').text();
      
      return censusObj;
    }

    /* Drawing Functions */

    var addHousingMarker = function(obj) {
      //console.log(obj.lat);
      if(obj.lat != '') {
        var size = new H.math.Size(40,40);
        var markerIcon = new H.map.Icon('img/marker.png',{size:size});
        var coords = {lat: parseFloat(obj.lat), lng: parseFloat(obj.lon)},
        //var coords = {lat: 41.9133256466, lng: -87.7103171384};
        marker = new H.map.Marker(coords, {icon: markerIcon, data:obj});
        marker.addEventListener('tap', housingMarkerOnClick); // onclick handler for markers
        // Add the marker to the map
        housingGroup.addObject(marker);
      }
    }

    var housingMarkerOnClick = function(event) {
      var data = event.target.getData();
      $('#mapSidebar').html('');
      console.log(data);
      var dataHtml = '<div id="sidebar-info">';
      dataHtml += '<div id="name"><h3>' + data.propertyName + '</h3></div>';
      dataHtml += '<div id="address">Address: ' + data.address + '</div>';
      dataHtml += '<div id="area">Community Area: ' + data.communityArea + '</div>';      
      dataHtml += '<div id="type">Housing Type: ' + data.propertyType + '</div>';

      dataHtml += '';
      dataHtml += '</div>';

      $('#mapSidebar').html(dataHtml);
      $('#mapSidebar').toggle(true);
      shapesUrl = 'http://reverse.geocoder.cit.api.here.com/6.2/reversegeocode.json?additionaldata=IncludeShapeLevel%2Cdistrict&gen=8&jsonattributes=1&language=en-US&maxresults=20&mode=retrieveAddresses&prox=41.89023%2C-87.64104%2C100&app_id=aCeuaXJdZyeWBAGkjTTY&app_code=NS_9MlRT5hnHMHXx_qo01g';
      $.get(shapesUrl, {}).done( function (obj) {
        console.log(obj);
        var rawShapeData = obj.response.view[0].result[0].location.shape.value;
        console.log(shape);
        var polystrip = new H.geo.Strip();
        
        //polystrip.pushPoint();        
                
        //map.addObject(shape);
      });
      //console.log(event.getData());
      

    }

  }); // end document load

})(jQuery);