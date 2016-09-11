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

 // create obj from crime data (json)
var parseCrime = function(obj) {
  console.log(obj);
  crimeObj = {};

  return crimeObj;
}