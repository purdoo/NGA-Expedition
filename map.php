<?php
  //$xml = simplexml_load_file('data/city-homicides-last-365-days.xml');
  //var_dump($xml);
?>

<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <link rel="stylesheet" type="text/css" href="https://js.api.here.com/v3/3.0/mapsjs-ui.css" />
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="map.css"/>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    
    <script type="text/javascript" charset="UTF-8"
      src="https://js.api.here.com/v3/3.0/mapsjs-core.js"></script>
    <script type="text/javascript" charset="UTF-8"
      src="https://js.api.here.com/v3/3.0/mapsjs-service.js"></script>
    <script type="text/javascript" charset="UTF-8"
      src="https://js.api.here.com/v3/3.0/mapsjs-ui.js"></script>
    <script type="text/javascript" charset="UTF-8"
      src="https://js.api.here.com/v3/3.0/mapsjs-mapevents.js"></script>
    
    <script src="js/parse.js"></script>
    <script src="js/agg.js"></script>
    <script src="js/routing.js"></script>
    
    <!--<script src="js/touchtap.js"></script>-->
    <script src="js/map.js"></script>
  </head> 
  <body>
    <div id=bounding class="map">
      <div id="mapContainer"></div>
      <div id="mapSidebar" class="col col-md-4">
        <div id="mapButtons">
          <h2>Chicago HotSpots</h2>
            <div class="btn-group btn-group-justified" role="group" style="padding-bottom: 20px;">
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-default active" id="housing-button">Info</button>
                <button type="button" class="btn btn-default" id="routing-button">Routing</button>
                <button type="button" class="btn btn-default" id="metrics-button">Metrics</button>
              </div>
            </div>
            <hr>
        </div>
        <div id="housing-form"></div>
        <div id="routing-form">
          <div id="routing-form-nav">
            <button type="button" class="btn btn-default" id="get-directions">Get Directions</button>
            <button type="button" class="btn btn-default" id="reverse-iso">Reverse Iso</button>
          </div>
          <div id="routing-form-results">
          </div>
        </div>
        <div id="metrics-form"></div>
      </div>
      <div class="close-button"><i class="fa fa-times"></i></div>
    </div>

    <script>
    </script>
  </body>

</html>
