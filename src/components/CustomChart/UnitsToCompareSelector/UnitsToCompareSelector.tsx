// components
import { chartProps } from "../../../store/charts"
import DayPanel from "../SupervisorPanels/DayPanel/DayPanel"
import HourPanel from "../SupervisorPanels/HourPanel/HourPanel"
import YearPanel from "../SupervisorPanels/YearPanel/YearPanel"
import YearsToCompareSelector from "./YearsToCompareSelector/YearsToCompareSelector"

interface OwnUnitsToCompareSelectorProps {
    chartId : string,
    chartDetails : chartProps
    selectedChartType : string
}

const UnitsToCompareSelector : React.FC<OwnUnitsToCompareSelectorProps> = ({chartId, chartDetails, selectedChartType}) => {

    let { yearToYear, dayToDay, hourToHour } = chartDetails

    return selectedChartType === "Year to year" ?
        <YearPanel chartId={chartId} yearToYear={yearToYear}/>
        : ( selectedChartType === "Day to day" ? <DayPanel chartId={chartId} dayToDay={dayToDay}/>
            : <HourPanel chartId={chartId} hourToHour={hourToHour} />)
}

export default UnitsToCompareSelector