// redux store
import { chartProps } from "../../../store/charts"

// components
import DayToDayIntervalSelector from "./DayToDayIntervalSelector/DayToDayIntervalSelector"
import YearToYearIntervalSelector from "./YearToYearIntervalSelector/YearToYearIntervalSelector"

interface OwnTimeIntervalSelectorProps {
    chartDetails: chartProps,
    chartId: string
}

const TimeIntervalSelector : React.FC<OwnTimeIntervalSelectorProps> = ({chartId, chartDetails}) => {
    return chartDetails.chartTypeSelected === "Year to year" ? <YearToYearIntervalSelector chartId={chartId} chartDetails={chartDetails} />
     : <DayToDayIntervalSelector chartId={chartId} chartDetails={chartDetails} />
}

export default TimeIntervalSelector