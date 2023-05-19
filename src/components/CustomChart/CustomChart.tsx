/***
 * PÓKI CO :
 * - można ustawiać daty ( od A - do B )
 * - daty zawierają rok/miesiąc/dzień + godzina : minuta
 * CO DOROBIĆ:
 * - gdy data startowa jest większa od końcowej jest błąd pobierania, naprawić(opcje):
 *    a) zrobić alert, że złe dane
 *    b) ustawić ograniczenie na daty w pickerze (wtedy jest mniejsza swoboda w doborze dat)
 * - zrobić jakiegoś selectboxa(lub coś podobnego) do wyboru lat do porównania w danym okresie
 * - opracować logikę do dodawania kolejnych lat (najlepiej jakiś obiekt w state(redux) z mapowaniem: "rok" : <dane_dla_roku>)
 * - ewentualnie jakieś opcje do manipulowania wartości null (czy pomijane, czy uśredniane itd)
 */

//react
import React, { useEffect } from "react"

// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../store"
import { returnFieldDescription } from "../../store/charts/types"

//highcharts and highstock
import Highcharts from "highcharts/highstock"
import {
  Chart, withHighcharts, XAxis, YAxis, Title, Subtitle, Legend, HighchartsChart, Tooltip
} from "react-jsx-highstock"

//date
import { lastDayOfMonth } from "date-fns/esm"

//functions
import { getNumberAndFetchFunctions } from "../../functions/parseFunctions"
import { dayInWords, monthNoToName, padTo2Digits } from "../utils/data-helpers"

//styles
import "./customChart.css"
import "react-datepicker/dist/react-datepicker.css"

//import { format } from "date-fns"

//components
import ChartTypeSelector from "./ChartTypeSelector/ChartTypeSelector"
import ChartDataSelectPanel from "./ChartDataSelectPanel/ChartDataSelectPanel"
import DaySelector from "../TimeSections/DaySelector/DaySelector"
import TimeIntervalSelector from "../TimeSections/TimeIntervalSelector/TimeIntervalSelector"
import UnitsToCompareSelector from "./UnitsToCompareSelector/UnitsToCompareSelector"
import RemoveChartButton from "./RemoveChartButton/RemoveChartButton"
import NavigatorSeries from "./NavigatorSeries/NavigatorSeries"
import XLineSeries from "./XLineSeries/XLineSeries"

const TIME_ZONE_POLAND = 1

interface OwnCustomChartProps {
  chartId: string,
  filterFunction: (arr: any[], mod: number) => any[]
}

const mapStateToProps = (state: AppState, ownProps: OwnCustomChartProps) => ({
  chartDetails: state.chartsReducer.charts[ownProps.chartId],
  chartDataSource: state.chartsReducer.charts[ownProps.chartId].chartDataSource
})

const mapDispatchToProps = (dispatch: Dispatch) => ({

})

const connector = connect(mapStateToProps, mapDispatchToProps)

type CustomChartPropsFromRedux = ConnectedProps<typeof connector>

type CustomChartProps = CustomChartPropsFromRedux & OwnCustomChartProps

const CustomChart: React.FC<CustomChartProps> = ({ chartId, chartDetails, chartDataSource }) => {

  const resultsHandler = getNumberAndFetchFunctions(chartDataSource)

  useEffect(() => {

  }, [chartDataSource])

  const dateToRequestDate = (date: Date, correctDateToUTC0: boolean) => {
    // change day if: (hours - TIME_ZONE_POLAND) < 0
    // change month if day == 0
    // change year if month == 0
    let year = date.getFullYear()
    let month = date.getMonth()
    let dayOfMonth = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()

    if (correctDateToUTC0) {
      let { yearCorrected, monthCorrected, dayOfMonthCorrected, hoursCorrected } = convertDateToLocalTimeZone(date, TIME_ZONE_POLAND)
      let dateReqParamUTC0 = yearCorrected + "-" + twoCharsStringFromInt(monthCorrected + 1) + "-" + twoCharsStringFromInt(dayOfMonthCorrected) + " " +
        twoCharsStringFromInt(hoursCorrected) + ":" + twoCharsStringFromInt(minutes) + ":" + twoCharsStringFromInt(seconds)

      return dateReqParamUTC0
    } else {
      let dateReqParam = year + "-" + twoCharsStringFromInt(month) + "-" + twoCharsStringFromInt(dayOfMonth) + " " +
        twoCharsStringFromInt(hours) + ":" + twoCharsStringFromInt(minutes) + ":" + twoCharsStringFromInt(seconds)

      return dateReqParam
    }
  }

  const convertDateToLocalTimeZone = (date: Date, timeZone = TIME_ZONE_POLAND) => {
    let hours = date.getHours()
    let hoursCorrected = hours
    let dayOfMonth = date.getDate()
    let dayOfMonthCorrected = dayOfMonth
    let month = date.getMonth()
    let monthCorrected = month
    let year = date.getFullYear()
    let yearCorrected = year

    if (hours - timeZone < 0) {
      hoursCorrected = 23
      dayOfMonthCorrected = dayOfMonth - 1
      if (dayOfMonthCorrected === 0) {
        monthCorrected = month - 1
        if (monthCorrected === -1) {
          yearCorrected = year - 1
          monthCorrected = 11
        }
        dayOfMonthCorrected = lastDayOfMonth(new Date("2022-" + monthCorrected + "-24")).getDate()
      }
    } else {
      hoursCorrected = hours - timeZone
    }

    return { yearCorrected, monthCorrected, dayOfMonthCorrected, hoursCorrected }
  }

  const twoCharsStringFromInt = (timeUnit: number) => {
    let timeUnitStr = timeUnit.toString();
    if (timeUnitStr.length === 1) {
      timeUnitStr = "0" + timeUnitStr
    }
    return timeUnitStr.length === 1 ? "0" + timeUnitStr : timeUnitStr
  }

  const requestDateToDateDescription = (requestDate: string) => {
    let year = requestDate.substring(0, 4)
    let monthNo = requestDate.substring(5, 7)
    let dayOfMonth = requestDate.substring(8, 10)
    let hour = requestDate.substring(11, 13)
    let minute = requestDate.substring(14, 16)
    let dayPart = dayInWords(dayOfMonth)
    console.log(monthNo)
    let monthPart = monthNoToName(monthNo)
    let timePart = hour + ":" + minute
    return dayPart + " of " + monthPart + " " + year + " " + timePart
  }



  const dateToDateDescription = (date: Date) => {
    return requestDateToDateDescription(dateToRequestDate(date, false))
  }

  const titlePartFromChartType = () => {
    return chartDetails.chartTypeSelected === "Hour to hour" ? "hours periods" : chartDetails.chartTypeSelected
  }

  const subtitleFromChartType = () => {
    switch(chartDetails.chartTypeSelected) {
      case "Year to year":
        return yearToYearSubtitle()
      case "Day to day":
        return dayToDaySubtitle()
      case "Hour to hour":
        return hourToHourSubtitle()
    }
  }

  const yearToYearSubtitle = () => {
    let startDate = chartDetails.yearToYear.selectedInterval.start ? dateToDateDescription(chartDetails.yearToYear.selectedInterval.start.toDate()) : ""
    let endDate = chartDetails.yearToYear.selectedInterval.end ? dateToDateDescription(chartDetails.yearToYear.selectedInterval.end.toDate()) : ""
    return startDate + " - " + endDate
  }

  const dayToDaySubtitle = () => {
    let {start, end} = chartDetails.dayToDay.selectedInterval
    let startTime = start ? ( padTo2Digits(start.hour()) + ":" + padTo2Digits(start.minute()) ) : ""
    let endTime = end ? ( padTo2Digits(end.hour()) + ":" + padTo2Digits(end.minute()) ) : ""
    let subtitle = "Time included: " + startTime + " - " + endTime
    return subtitle
  }

  const hourToHourSubtitle = () => {
    return "Check chart legend to see compared periods"
  }

  return (
    <div className="custom-chart">
      <div>
        <ChartTypeSelector chartId={chartId} key={"chartTypeSelector-" + chartId} />
        <div className="chart-data-section">
          <ChartDataSelectPanel chartId={chartId} />
          <HighchartsChart styledMode plotOptions={{
            series: {
              showInNavigator: true
            }
          }}>
            <Chart type="spline" width={750} />

            <Title>{returnFieldDescription(chartDetails.chartDataSource).concat(" " + titlePartFromChartType() + " comparison ")} </Title>

            <Subtitle>{subtitleFromChartType()}</Subtitle>

            <Legend />

            <Tooltip valueSuffix={resultsHandler ? resultsHandler?.suffix : ""} />

            <XAxis type="datetime">
              <XAxis.Title>Time</XAxis.Title>
              <XLineSeries chartId={chartId}/>
            </XAxis>

            <YAxis minorGridLineWidth={0} gridLineWidth={0}>
              <YAxis.Title>{resultsHandler ? resultsHandler?.propertyName + resultsHandler?.suffix : ""}</YAxis.Title>
            </YAxis>

            <NavigatorSeries chartDetails={chartDetails}/>
          </HighchartsChart>
        </div>
        <div style={{ display: "flex", flexDirection: "row", position: "relative" }}>
          {
            ["Day to day", "Year to year"].includes(chartDetails.chartTypeSelected) ?
              <TimeIntervalSelector chartId={chartId} chartDetails={chartDetails} />
              : <DaySelector chartId={chartId} />
          }
          <RemoveChartButton chartId={chartId} />
        </div>
      </div>

      <div className={"units-to-compare-selector"}>
        <UnitsToCompareSelector chartId={chartId} chartDetails={chartDetails} selectedChartType={chartDetails.chartTypeSelected} />
      </div>
    </div>
  )
}

export default withHighcharts(connector(CustomChart), Highcharts)