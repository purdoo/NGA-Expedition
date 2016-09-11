<?php
  echo "Hello World!";
?>

<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <link rel="stylesheet" type="text/css"
      href="https://js.api.here.com/v3/3.0/mapsjs-ui.css" />
      <link rel="stylesheet" type="text/css"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
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
    <script src="js/routing.js"></script>
    <script src="js/parse.js"></script>
    <script src="js/agg.js"></script>
    <script src="js/map.js"></script>
  </head> 
  <body>
    <div id=bounding class="map">
      <div id="mapContainer"></div>
      <div id="mapSidebar" class="col col-md-4">
        <h3>Header</h3>
      </div>
      <div class="close-button"><i class="fa fa-times"></i></div>
    </div>
  </body>
</html>
