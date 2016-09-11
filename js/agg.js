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
