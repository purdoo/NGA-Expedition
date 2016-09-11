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

    var isolineTime = 10;
    // global scores
    var nScore = 300;
    var cScore = 0;
    var eScore = 0;


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

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    
    // housing layer/group
    var housingGroup = new H.map.Group();
    map.addObject(housingGroup);
    var districtGroup = new H.map.Group();
    map.addObject(districtGroup);
    var routeGroup = new H.map.Group();
    map.addObject(routeGroup);
    var shapegroup = new H.map.Group(); // for reverse isoline
    map.addObject(shapegroup);
    var crimeGroup = new H.map.Group(); // for localized crimes
    map.addObject(crimeGroup);

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
        if(censusObj.communityAreaNumber != null) {
          if(Number.isInteger(parseInt(censusObj.communityAreaNumber))){
            censusObjDictionary[censusObj.communityAreaNumber] = censusObj
          } else {
            censusAggregates = computeAggregateCensusMetrics(censusObj)
          } 
        } 
      });
      //console.log(censusAggregates);
    });

    /*
    var crimeArr = [];
    var crimeUrl = 'https://data.cityofchicago.org/resource/vwwp-7yr9.json';
    $.get(crimeUrl, {}).done( function (obj) {
      crimeArr = obj;
      for(var i = 0; i < obj.length; i++) {
        //console.log(obj[i]);
      }
    });
    */

    // add marker for housing object, embed geojson data into the map
    var addHousingMarker = function(obj) {
      //console.log(obj.lat);
      if(obj.lat != '') {
        var size = new H.math.Size(40,40);
        var markerIcon = new H.map.Icon('img/marker.png',{size:size});
        var coords = {lat: parseFloat(obj.lat), lng: parseFloat(obj.lon)},
        marker = new H.map.Marker(coords, {icon: markerIcon, data:obj});
        marker.addEventListener('tap', housingMarkerOnClick); // onclick handler for markers
        // Add the marker to the map
        housingGroup.addObject(marker);
      }
    }

    // add marker for crime object
    var addCrimeMarker = function(lon,lat) {
      var size = new H.math.Size(30,30);
      var markerIcon = new H.map.Icon('img/marker-red.png',{size:size});
      var coords = {lat: lat, lng: lon},
      marker = new H.map.Marker(coords, {icon: markerIcon});
      // Add the marker to the map
      crimeGroup.addObject(marker);
    }

    var housingMarkerOnClick = function(event) {
      var data = event.target.getData();
      // clear isoline layer
      shapegroup.removeAll();

      // set hacky ass globals
      clickedLat = data.lat;
      clickedLon = data.lon;
      // sidebar html for housing info
      $('#housing-form-info').html('');
      console.log(data);
      //var dataHtml = '<div id="sidebar-info">';
      dataHtml = '<div id="name"><h3>' + data.propertyName + '</h3></div>';
      dataHtml += '<div id="address"><h4>Address: ' + data.address + '</h4></div>';
      dataHtml += '<div id="area"><h4>Community Area: ' + data.communityArea + '</h4></div>';      
      dataHtml += '<div id="type"><h4>Housing Type: ' + data.propertyType + '</h4></div>';
      dataHtml += '<div id="management"><h4>Management Company: ' + data.managementCompany + '</h4></div>';
      dataHtml += '<div id="phone"><h4>Phone Number: ' + data.phoneNumber + '</h4></div>';
      dataHtml += '<a id="zoom"><b>Zoom To</b></a>';
      //dataHtml += '</div>';
      $('#housing-form-info').html(dataHtml);

      //Crime Score
      console.log("calculating crime");
      calculateCrimeScoreInRange(data.lat, data.lon);

      var metricsData = displayAggregates(censusObjDictionary[data.communityAreaNumber], censusAggregates);
      var nDev = tallyNScore(censusObjDictionary[data.communityAreaNumber], censusAggregates);
      nScore = 300 + nDev;

      // 'loading' score header
      var scoreHtml = '<div id="agg-score-header"><h3>Aggregate Score: Calculating...</h3></div>';
      $('#score-summary').html(scoreHtml);      
     
      // metrics page, placeholders for our slowpokes
      var metricsHtml = '<h3>Area Score: ' + nScore.toFixed(2) + ' (Baseline: 300)</h3><div class="well">' + metricsData + '</div>';
      metricsHtml += '<div id="cScoreWell"><h3>Crime Score: Calculating...</h3><div class="well">' + '</div></div>';
      metricsHtml += '<div id="eScoreWell"><h3>Misc. Score: Calculating...</h3><div class="well">' + '</div></div>';
      $('#metrics-form').html(metricsHtml);



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

      // reverse isometric flow
     // geocode(String(clickedLat) + ',' + String(clickedLon));
      //isolineTime = 4;
      //geocode(String(clickedLat) + ',' + String(clickedLon));
      //isolineTime = 10;

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
            lineWidth: 6,
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
      mapRoute(parseFloat(location.coords.longitude),parseFloat(location.coords.latitude),parseFloat(clickedLon),parseFloat(clickedLat));
    }

    function locationError(msg) { console.log(msg); }

    reverseFlowCallback = function(result)
    {
      if(!result.response){
        alert("Error: " + result.Details);
        return;
      }
    
      //shapegroup.removeAll(); // move to onclick call
      var shape = result.response.isoline[0].component[0].shape,
      strip = new H.geo.Strip();

      for (var i = 0; i < shape.length; i++)
      {
        var split = shape[i].trim().split(",");
        if(split.length === 2){
          var lat = parseFloat(split[0]);
          var lon = parseFloat(split[1]);
          strip.pushLatLngAlt( lat, lon, 0);
        }
      }

      var shp = new H.map.Polygon(strip,
        {
          style: { lineWidth: 5, strokeColor: "rgba(34, 204, 34, 0.5)"}
        }
      );

      shapegroup.addObject(shp);
      map.addObject(shapegroup);

      //map.setViewBounds(shapegroup.getBounds());
    }

    // do a Geocode
    geocode = function(term)
    {
      //add Geocoder Release information if not already done

      geoUrl = [
        "http", 
        //secure ? "s" : "", 
        "://geocoder.cit.api.here.com/6.2/search.json?",
        "searchtext=",
        term,
        "&maxresults=1",
        "&app_id=",
        appId,
        "&app_code=",
        appCode,
        "&jsoncallback=",
        "geocallback"
        ].join("");

        script = document.createElement("script");
        script.src = geoUrl;
        document.body.appendChild(script);
    }

    geocallback = function(result)
    {
      if(result.Response.View[0].Result[0].Location != null)
      {
        pos = result.Response.View[0].Result[0].Location.DisplayPosition;
      }
      else
      {
        pos = result.Response.View[0].Result[0].Place.Locations[0].DisplayPosition;
      }

      destination = new H.geo.Point(pos.Latitude, pos.Longitude);
      //addMarkerToPosition(destination);
      //calculateReverseFlow(document.getElementById("rangevalue").value);
      calculateReverseFlow(isolineTime);
    }

    var calculateReverseFlow = function(rangeValue)
    {
      var rangeType = 'time';

      routeUrl = [
        "https://isoline.route.cit.api.here.com/",
        "routing/",
        "7.2/",
        "calculateisoline.json?",
        "destination=",
        clickedLat,
        ",",
        clickedLon,
        "&",
        "mode=fastest;car;traffic:" +  "disabled",
        "&rangetype=" + rangeType,
        "&",
        "range=",
        rangeValue * (rangeType == "time" ? 60 : 1000),
        "&",
        "linkattributes=sh&",
        "app_code=",
        appCode,
        "&",
        "app_id=",
        appId,
        "&jsoncallback=reverseFlowCallback"].join("");

        script = document.createElement("script");
        script.src = routeUrl;
        document.body.appendChild(script);
    }

    var calculateCrimeScoreInRange = function(lat, lon)
    {
      // clear crime layer
      crimeGroup.removeAll();
      // build query string for url
      var localCrimeUrl = 'https://data.cityofchicago.org/resource/vwwp-7yr9.json';
      var crimeQueryPrefixClause = '?$where=within_circle(location,%20';
      var crimeQueryLatSuffix =   ',%20' ;
      var crimeQueryLonSuffix = ',%201500)&$limit=400';
      var finalCrimeQueryUrl = localCrimeUrl + crimeQueryPrefixClause + lat + crimeQueryLatSuffix + lon + crimeQueryLonSuffix

      //console.log(finalCrimeQueryUrl);
      $.get(finalCrimeQueryUrl, {}).done( function (obj) {
        localCrimeArr = obj;
        var crimeScore = 500;
        console.log(obj.length);
        var homMod = 0, theftMod = 0, robMod = 0, damageMod = 0, otherMod = 0;
      
        for(var i = 0; i < obj.length; i++) {
          addCrimeMarker(obj[i].location.longitude, obj[i].location.latitude);
          if(obj[i].primary_type == "HOMICIDE"){
            crimeScore -= 0.95;
            homMod += 0.95;
          } else if(obj[i].primary_type == "THEFT"){
            crimeScore -= 0.45;
            theftMod += 0.45;
          } else if(obj[i].primary_type == "ROBBERY"){
            crimeScore -= 0.65;
            robMod += 0.65;
          } else if(obj[i].primary_type == "CRIMINAL DAMAGE"){
            crimeScore -= 0.42;
            damageMod += 0.42
          } else {
            crimeScore -= 0.215;
            otherMod += 0.215;
          }
        }
        crimeScore -= homMod;
        crimeScore -= theftMod;
        crimeScore -= robMod;
        crimeScore -= damageMod;
        crimeScore -= otherMod;
        
        // inject our scores, calculate
        var cScore = crimeScore;
        var aggScore = (nScore + cScore + eScore);
        // aggregate score header
        var scoreHtml = '';
        scoreHtml += '<div id="agg-score-header"><h3>Aggregate Score: ' + aggScore.toFixed(2) + '</h3></div>';
        // detailed score body
        scoreHtml += '<div id="agg-score-body"><h4>Neighborhood Score: ' + nScore.toFixed(2) + '</h4><h4>Crime Score: ' + cScore.toFixed(2) + '</h4><h4>Misc. Score: ' + eScore.toFixed(2) + '</h4></h3></div>';
        $('#score-summary').html(scoreHtml);
      
        // inject metrics into the metric page
        $('#cScoreWell').html('<h3>Crime Score: ' + cScore.toFixed(2) + ' </h3><div class="well">' + '</div>');
        $('#eScoreWell').html('<h3>Misc. Score: ' + eScore.toFixed(2) + '</h3><div class="well">' + '</div>');
        //$('#metrics-form').html(metricsHtml);

      });

    
     
      
    }

    /* DOM On Click Events */

    // get directions button mapping
    $('#get-directions').on('click', function(event) {
      mapRoute(currLon, currLat, clickedLon, clickedLat);
    });

    // reverse isoline call
    $('#reverse-iso').on('click', function(event) {
       geocode(String(clickedLat) + ',' + String(clickedLon));
    });

    // clear crime layer
    $('#clear-crimes').on('click', function(event) {
       crimeGroup.removeAll();
    });

    // Aggregate Score Expand
    $(document).on('click','#agg-score-header',function() {
      $('#agg-score-body').toggle('fast');
    });
    // Zoom
    $(document).on('click','#zoom',function() {
      //$('#agg-score-body').toggle('fast');
      map.setZoom(14);
      var coords = {lat: clickedLat, lng: clickedLon};
      map.setCenter(coords);
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