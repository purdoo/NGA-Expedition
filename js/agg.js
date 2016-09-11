function computeAggregateCensusMetrics(obj) {
  aggCensusObj = {}
  aggCensusObj.avgPercentHousingCrowded = obj.percentHousingCrowded ;
  aggCensusObj.avgPercentHouseholdsBelowPoverty = obj.percentHouseholdsBelowPoverty ;
  aggCensusObj.avgPercentAged16Unemployed = obj.percentAged16Unemployed ;
  aggCensusObj.avgPercentAged25NoDiploma =  obj.percentAged25NoDiploma;
  aggCensusObj.avgPercentAgedUnder18orOver64 = obj.percentAgedUnder18orOver64;
  aggCensusObj.avgPerCapitaIncome = obj.perCapitaIncome ;

  return aggCensusObj;
}

function displayAggregates(obj, aggObj, displayHtml = '') {
  var returnHtml = '';
  var varPercentHousingCrowded = computePercentVariance(obj.percentHousingCrowded, aggObj.avgPercentHousingCrowded);
  returnHtml += displayVariances(varPercentHousingCrowded, 
      "percentHousingCrowded",
      "Crowded housing percentage is " + obj.percentHousingCrowded + "% (" + varPercentHousingCrowded);
  returnHtml += '<hr>';
  var varPercentHouseholdsBelowPoverty = computePercentVariance(obj.percentHouseholdsBelowPoverty, aggObj.avgPercentHouseholdsBelowPoverty);
  returnHtml += displayVariances(varPercentHouseholdsBelowPoverty, 
      "percentHouseholdsBelowPoverty",
      "Percentage of households below poverty is " + obj.percentHouseholdsBelowPoverty + "% (" + varPercentHouseholdsBelowPoverty);
  returnHtml += '<hr>';
  var varPercentAged16Unemployed = computePercentVariance(obj.percentAged16Unemployed, aggObj.avgPercentAged16Unemployed);
  returnHtml += displayVariances(varPercentAged16Unemployed, 
      "percentAged16Unemployed",
      "Percentage of unemployed people above 16 is " + obj.percentAged16Unemployed + "% (" + varPercentAged16Unemployed);
  returnHtml += '<hr>';
  var varPercentAged25NoDiploma = computePercentVariance(obj.percentAged25NoDiploma, aggObj.avgPercentAged25NoDiploma);
  returnHtml += displayVariances(varPercentAged25NoDiploma, 
      "percentAged25NoDiploma",
      "Percentage of people above 25 with no high school diploma is " + obj.percentAged25NoDiploma + "% (" + varPercentAged25NoDiploma);
  returnHtml += '<hr>';
  var varPercentAgedUnder18orOver64 = computePercentVariance(obj.percentAgedUnder18orOver64, aggObj.avgPercentAgedUnder18orOver64);
  returnHtml += displayVariances(varPercentAgedUnder18orOver64, 
      "percentAgedUnder18orOver64",
      "Percentage of people under 18 and over 64 is " + obj.percentAgedUnder18orOver64 + "% (" + varPercentAgedUnder18orOver64);
  returnHtml += '<hr>';
  var varPerCapitaIncome = computePercentVariance(obj.perCapitaIncome, aggObj.avgPerCapitaIncome);
  returnHtml += displayVariances(varPerCapitaIncome, 
      "perCapitaIncome",
      "Per Capita income is $" + obj.perCapitaIncome + " (" + varPerCapitaIncome);

  return returnHtml;
}

function tallyNScore(obj, aggObj) {
	
    //var percentage = (((objVal - aggVal ) / aggVal) * 100).toFixed(2);
    
}

function computePercentVariance(objVal, aggVal) {
	var percentage = (((objVal - aggVal ) / aggVal) * 100).toFixed(2);
    if(percentage >= 0) { return percentage + '% above average)'; }
    return percentage + '% below average)'
}

function displayVariances(variance, metricName, message) {
    console.log(variance);
    var numVar = parseFloat(variance.split('%')[0]);
	if(numVar < -7) {
		return '<div id="'+ metricName + '" class="metricLessThan">' + message + '</div>';
	} else if(numVar > 7){
		return '<div id="'+ metricName + '" class="metricGreaterThan">' + message + '</div>';
	}

	return '<div id="'+ metricName + '" class="metricEqual">' + message + '</div>'; 
}
