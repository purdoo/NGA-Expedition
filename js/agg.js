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

function displayAggregates(obj, aggObj, displayHtml) {
  
  var returnHtml = displayHtml	
  
  returnHtml += displayVariances(computePercentVariance(obj.percentHousingCrowded, aggObj.avgPercentHousingCrowded), "percentHousingCrowded")
  	
  returnHtml += displayVariances(computePercentVariance(obj.percentHouseholdsBelowPoverty, aggObj.avgPercentHouseholdsBelowPoverty), "percentHouseholdsBelowPoverty")
  
  returnHtml += displayVariances(computePercentVariance(obj.percentAged16Unemployed, aggObj.avgPercentHousingCrowded), "percentAged16Unemployed")
  
  returnHtml += displayVariances(computePercentVariance(obj.percentAged25NoDiploma, aggObj.avgPercentAged25NoDiploma), "percentAged25NoDiploma")
  
  returnHtml += displayVariances(computePercentVariance(obj.percentAgedUnder18orOver64, aggObj.avgPercentAgedUnder18orOver64), "percentAgedUnder18orOver64")
  
  returnHtml += displayVariances(computePercentVariance(obj.perCapitaIncome, aggObj.avgPerCapitaIncome), "avgPerCapitaIncome")

  return returnHtml;
  
}

function computePercentVariance(objVal, aggVal) {
	return ((objVal - aggVal ) / aggVal) * 100
}

function displayVariances(variance, metricName) {
	if(variance < 0) {

		return '<div id="'+ metricName + '" class="metricLessThan>"' + Math.abs(variance) + '</div>' 

	} else if( variance > 0){
		return '<div id="'+ metricName + '" class="metricGreaterThan>"' + variance + '</div>' 
	}

	return '<div id="'+ metricName + '" class="metricEqual>"' + variance + '</div>' 
}
