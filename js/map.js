jQuery.noConflict();
(function ($) {
  $(document).ready(function ($) {
    // globals
    var appId = 'aCeuaXJdZyeWBAGkjTTY';
    var appCode = 'NS_9MlRT5hnHMHXx_qo01g';
    
    var clickedLon = 0;
    var clickedLat = 0;
    var currLon = 0;
    var currLat = 0;

    // Initialize the platform object:
    var platform = new H.service.Platform({
    'app_id': appId,
    'app_code': appCode
    });
    // routing functionality
    var router = platform.getRoutingService();
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
    var districtGroup = new H.map.Group();
    map.addObject(districtGroup);
    var routeGroup = new H.map.Group();
    map.addObject(routeGroup);

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

    
    var censusObjDictionary = {};
    var censusUrl = 'https://data.cityofchicago.org/api/views/kn9c-c2s2/rows.xml?accessType=DOWNLOAD'
    var censusAggregates = {};
    $.get(censusUrl, {
      // wait for the callback
    }).done( function (xml) {
      //console.log(xml);
      $(xml).find('row').each(function() {
        var entry = $(this);
        var censusObj = parseCensus(entry);
        //TODO : addHousingMarker(housingObj);
        if(censusObj.communityAreaNumber != null) {
          if(Number.isInteger(parseInt(censusObj.communityAreaNumber))){
            censusObjDictionary[censusObj.communityAreaNumber] = censusObj
          } else {
            censusAggregates = computeAggregateCensusMetrics(censusObj)
          } 
        } 
      });
      console.log(censusAggregates);
    });


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
      // set hacky ass globals
      clickedLat = data.lat;
      clickedLon = data.lon;
      // sidebar html for housing info
      $('#housing-form').html('');
      //console.log(data);
      var dataHtml = '<div id="sidebar-info">';
      dataHtml += '<div id="name"><h3>' + data.propertyName + '</h3></div>';
      dataHtml += '<div id="address">Address: ' + data.address + '</div>';
      dataHtml += '<div id="area">Community Area: ' + data.communityArea + '</div>';      
      dataHtml += '<div id="type">Housing Type: ' + data.propertyType + '</div>';

      dataHtml += '';
      dataHtml += '</div>';
      $('#housing-form').html(dataHtml);
      var metricsData = displayAggregates(censusObjDictionary[data.communityAreaNumber], censusAggregates);
      //console.log(metricsData);
      $('#metrics-form').html('<h3>Neighborhood Score</h3><div class="well">' + metricsData + '</div>');
      // basically forcing a click event on housing button
      $('#housing-form').toggle(true);
      $('#routing-form').toggle(false);
      $('#metrics-form').toggle(false);
      $('#housing-button').addClass('active');
      $('#routing-button').removeClass('active');
      $('#metrics-button').removeClass('active');
      $('#mapSidebar').toggle(true);
      // clear potentially old search results
      $('#routing-form-results').html('');

      // routing logic
      if(navigator.geolocation) {  
        navigator.geolocation.getCurrentPosition(markLocation, locationError);
      }
      else { alert("Browser does not support Geolocation."); }
      //mapRoute(currLon, currLat, data.lon, data.lat);

      // shape drawing logic
      shapesUrl = 'http://reverse.geocoder.cit.api.here.com/6.2/reversegeocode.json?additionaldata=IncludeShapeLevel%2Cdistrict&gen=8&jsonattributes=1&language=en-US&maxresults=20&mode=retrieveAddresses&prox=' + data.lat + '%2C' + data.lon + '%2C100&app_id=' + appId + '&app_code='+appCode;
      $.get(shapesUrl, {}).done( function (obj) {
        var polystrip = new H.geo.Strip();
        //console.log(obj.response);
        if(typeof(obj.response.view[0].result[0].location.shape) !== 'undefined') {
          // shape data is available, clear layer
          districtGroup.removeAll();
          var rawShapeData = obj.response.view[0].result[0].location.shape.value;
          var shapeData = rawShapeData.replace('POLYGON ((', '').replace('))','');
          var shapeDataArr = shapeData.split(',');
          for(var i = 0; i < shapeDataArr.length; i++) {
            var shapeSplit = shapeDataArr[i].trim().split(' ');
            polystrip.pushLatLngAlt(parseFloat(shapeSplit[1]),parseFloat(shapeSplit[0]), 0);
          }
          //console.log('done creating shape object');
          var polygon = new H.map.Polygon(polystrip, {style: {
            strokeColor: "#f00",
            lineWidth: 5
          }});
          districtGroup.addObject(polygon);
        }
        else {
          console.log('cannot get shape information');
        }      
      });
    }

    function mapRoute(startLon,startLat,endLon,endLat,travelOptions='')
    {
      var startParams = String(startLat) + ',' + String(startLon);
      var endParams = String(endLat) + ',' + String(endLon);
      var calculateRouteParams = {
        'waypoint0' : startParams,
        'waypoint1' : endParams,
        'mode': 'fastest;car;traffic:disabled',
        'representation': 'display'
      },
      onResult = function(result) {
        //add Routing Release number if not already done
        /*
        if (releaseRoutingShown== false){
          releaseInfoTxt.innerHTML+="<br />HLP Routing: "+result.response.metaInfo.moduleVersion;
          releaseRoutingShown = true;
        }*/
        console.log(result);
        var strip = new H.geo.Strip(),
        shape = result.response.route[0].shape,
        directions = result.response.route[0].leg[0].maneuver,
        i,
        l = shape.length;

        // render the route shape
        for(i = 0; i < l; i++)
        {
          strip.pushLatLngAlt.apply(strip, shape[i].split(',').map(function(item) { return parseFloat(item); }));
        }
        var polyline = new H.map.Polyline(strip,
        {
          style:
          {
            lineWidth: 10,
            strokeColor: "rgba(0, 128, 0, 0.7)"
          }
        });
        routeGroup.removeAll();
        routeGroup.addObject(polyline);
        //map.setViewBounds(polyline.getBounds(), true);

        // parse directions data and inject into DOM
        var directionsHtml = '<h3>Directions</h3><hr>';
        for(var i = 0; i < directions.length; i++) {
          directionsHtml += '<div class="direction">' + directions[i].instruction + '<hr></div>';
        }
        //console.log(directionsHtml);
        $('#routing-form-results').html(directionsHtml);
      },
      onError = function(error) { console.log(error);}
      router.calculateRoute(calculateRouteParams, onResult, onError);
    }

    function markLocation(location) {
      //console.log(location);
      var size = new H.math.Size(40,40);
      var markerIcon = new H.map.Icon('img/marker1.png',{size:size});
      currLat = location.coords.latitude;
      currLon = location.coords.longitude;
      var coords = { lat: location.coords.latitude, lng: location.coords.longitude };
      marker = new H.map.Marker(coords, {icon: markerIcon});
      map.addObject(marker);
      // call route map function (eventually move to a button onclick event)
      //mapRoute(parseFloat(location.coords.longitude),parseFloat(location.coords.latitude),parseFloat(clickedLon),parseFloat(clickedLat));
    }

    function locationError(msg) { console.log(msg); }

    // get directions button mapping
    $('#get-directions').on('click', function(event) {
      mapRoute(currLon, currLat, clickedLon, clickedLat);
    });

    // stupid button onclick events have to be here
    $('#housing-button').on('click', function(event) {
      $('#housing-form').toggle(true);
      $('#routing-form').toggle(false);
      $('#metrics-form').toggle(false);
      $('#housing-button').addClass('active');
      $('#routing-button').removeClass('active');
      $('#metrics-button').removeClass('active');
    });
    $('#routing-button').on('click', function(event) {
      $('#housing-form').toggle(false);
      $('#routing-form').toggle(true);
      $('#metrics-form').toggle(false);
      $('#routing-button').addClass('active');
      $('#housing-button').removeClass('active');
      $('#metrics-button').removeClass('active');
    });
    $('#metrics-button').on('click', function(event) {
      $('#housing-form').toggle(false);
      $('#routing-form').toggle(false);
      $('#metrics-form').toggle(true);
      $('#routing-button').removeClass('active');
      $('#housing-button').removeClass('active');
      $('#metrics-button').addClass('active');
    });

  }); // end document load

})(jQuery);