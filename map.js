jQuery.noConflict();
(function ($) {
  $(document).ready(function ($) {
      console.log('hello');
      var housingObjArr = [];
      var url = 'https://data.cityofchicago.org/api/views/s6ha-ppgi/rows.xml?accessType=DOWNLOAD'
      $.get(url, {
        // wait for the callback
      }).done( function (xml) {
        console.log(xml);
        $(xml).find('row').each(function() {
          var entry = $(this);

          housingObjArr.push(parseHousing(entry));
          
        });
        console.log(housingObjArr);
      });

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

  }); // end document load

})(jQuery);