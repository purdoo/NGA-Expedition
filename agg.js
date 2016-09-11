function computeAggregateCensusMetrics(objDict) {
  aggCensusObj = {}
  var sumCensusObj = 0;
  var sumPercentHousingCrowded = 0;
  var sumPercentHouseholdsBelowPoverty =0;
  var sumPercentAged16Unemployed = 0;
  var sumPercentAged25NoDiploma = 0;
  var sumPercentAgedUnder18orOver64 = 0;
  var sumPerCapitaIncome = 0;
  var sumHardshipIndex =0;

  for(var key in objDict) {
    if (objDict.hasOwnProperty(key) 
          && Number.isInteger(parseInt(objDict[key].perCapitaIncome))
          && Number.isInteger(parseInt(objDict[key].hardshipIndex))) {
        sumCensusObj += 1;
        sumPercentHousingCrowded = sumPercentHousingCrowded + parseFloat(objDict[key].percentHousingCrowded);
        sumPercentHouseholdsBelowPoverty = sumPercentHouseholdsBelowPoverty + parseFloat(objDict[key].percentHouseholdsBelowPoverty);
        sumPercentAged16Unemployed = sumPercentAged16Unemployed + parseFloat(objDict[key].percentAged16Unemployed);
        sumPercentAged25NoDiploma = sumPercentAged25NoDiploma + parseFloat(objDict[key].percentAged25NoDiploma);
        sumPercentAgedUnder18orOver64 = sumPercentAgedUnder18orOver64 + parseFloat(objDict[key].percentAgedUnder18orOver64);
        sumPerCapitaIncome = sumPerCapitaIncome + parseInt(objDict[key].perCapitaIncome);
        sumHardshipIndex = sumHardshipIndex + parseInt(objDict[key].hardshipIndex,10);
    }
  }

  aggCensusObj.avgPercentHousingCrowded = sumPercentHousingCrowded / sumCensusObj ;
  aggCensusObj.avgPercentHouseholdsBelowPoverty = sumPercentHouseholdsBelowPoverty / sumCensusObj ;
  aggCensusObj.avgPercentAged16Unemployed = sumPercentAged16Unemployed / sumCensusObj ;
  aggCensusObj.avgPercentAged25NoDiploma = sumPercentAged25NoDiploma / sumCensusObj ;
  aggCensusObj.avgPercentAgedUnder18orOver64 = sumPercentAgedUnder18orOver64 / sumCensusObj ;
  aggCensusObj.avgPerCapitaIncome = sumPerCapitaIncome / sumCensusObj ;
  aggCensusObj.avgHardshipIndex = sumHardshipIndex / sumCensusObj ;

  return aggCensusObj;
  
}
