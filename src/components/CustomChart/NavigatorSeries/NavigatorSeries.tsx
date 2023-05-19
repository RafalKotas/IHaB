import React from "react"
import { chartProps } from "../../../store/charts"

import {
   Navigator
} from "react-jsx-highstock"

interface NavigatorSeriesProps {
    chartDetails : chartProps
}

const NavigatorSeries : React.FC<NavigatorSeriesProps> = ({chartDetails}) => {

    let chartType = chartDetails.chartTypeSelected

    const returnProperSeriesLabels = () => {
        switch(chartType) {
            case "Year to year":
                console.log(chartDetails.yearToYear.selectedYears)
                return chartDetails.yearToYear.selectedYears
            case "Day to day":
                return chartDetails.dayToDay.selectedDays
            case "Hour to hour":
                return chartDetails.hourToHour.selectedPeriods
        }
    }

    return (<Navigator maskFill={"red"}>
        {
            returnProperSeriesLabels().map((year, index) => {
                return <Navigator.Series seriesId={year.toString()} />
            })
        }
    </Navigator>)
}

export default NavigatorSeries