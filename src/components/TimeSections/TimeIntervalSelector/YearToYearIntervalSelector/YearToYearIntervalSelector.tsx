// react-store
import { useEffect, useState } from "react"
import { chartProps } from "../../../../store/charts/types"

// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../store"
import { SetYearToYearChartIntervalEnd, SetYearToYearChartIntervalStart } from "../../../../store/charts"

import { Dayjs } from "dayjs"

// components
import { TextField } from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { Badge, Button, OverlayTrigger, Tooltip } from "react-bootstrap"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"

// styles
import "./yearToYearIntervalSelector.css"


interface OwnYearToYearIntervalSelectorProps {
    chartDetails: chartProps,
    chartId: string
}

const mapStateToProps = (state: AppState, ownProps : OwnYearToYearIntervalSelectorProps) => ({
  chartDetails : state.chartsReducer.charts[ownProps.chartId],
  storeIntervalStart: state.chartsReducer.charts[ownProps.chartId].yearToYear.selectedInterval.start,
  storeIntervalEnd: state.chartsReducer.charts[ownProps.chartId].yearToYear.selectedInterval.end
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnYearToYearIntervalSelectorProps) => ({
  passIntervalStartToStore: (updatedIntervalStart : Dayjs) => dispatch(SetYearToYearChartIntervalStart(ownProps.chartId, updatedIntervalStart)),
  passIntervalEndToStore: (updatedIntervalEnd : Dayjs) => dispatch(SetYearToYearChartIntervalEnd(ownProps.chartId, updatedIntervalEnd))
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type YearToYearIntervalSelectorPropsFromRedux = ConnectedProps<typeof connector>

type YearToYearIntervalSelectorProps = YearToYearIntervalSelectorPropsFromRedux & OwnYearToYearIntervalSelectorProps

const YearToYearIntervalSelector : React.FC<YearToYearIntervalSelectorProps> = ({chartId, chartDetails, storeIntervalStart, storeIntervalEnd,
  passIntervalStartToStore, passIntervalEndToStore}) => {
    
    const [intervalStart, setIntervalStart] = useState<Dayjs | null>(storeIntervalStart)
    const [intervalEnd, setIntervalEnd] = useState<Dayjs | null>(storeIntervalEnd)

    const renderTooltip = (intervalStartOrEnd : Dayjs | null) => (
        <Tooltip id={"chartId-" + chartId + "-tooltip"}>
          {intervalStartOrEnd ? intervalStartOrEnd.format("DD-MM-YYYY HH:MM") : "DD-MM-YYYY HH:MM" }
        </Tooltip>
      );

    const swapValues = () => {
      let oldIntervalStart = intervalStart
      let oldIntervalEnd = intervalEnd
      setIntervalStart(oldIntervalEnd)
      setIntervalEnd(oldIntervalStart)
    }

    useEffect(() => {
      if(intervalStart) {
        passIntervalStartToStore(intervalStart)
      }
    }, [intervalStart])

    useEffect(() => {
      if(intervalEnd) {
        passIntervalEndToStore(intervalEnd)
      }
    }, [intervalEnd])
    
    return (<section
      className={"year-to-year-interval-selectors"}
    >
      <div className={"interval-selector"}>
        <h5 className="year-interval-picker-with-header">
            Year interval start 
            <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip(intervalStart)}
            >
                <Badge bg="info">Show start date</Badge>
            </OverlayTrigger>
        </h5>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
            label={"Interval start datetime"}
            renderInput={(params) => <TextField {...params} />}
            value={intervalStart}
            onChange={(newIntervalStartValue) => {
                //setIntervalStart(newIntervalStartValue)
            }}
            onAccept={(newIntervalStartValue) => {
              setIntervalStart(newIntervalStartValue)
            }}
            />
        </LocalizationProvider>
      </div>
      <div className={"interval-selector"}>
        <h5 className="year-interval-picker-with-header">
            Year interval end {/*selectedDateTimeIndicator(intervalEnd)*/}
            <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip(intervalEnd)}
            >
                <Badge bg="info">Show end date</Badge>
            </OverlayTrigger>
        </h5>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                label={"Interval end datetime"}
                renderInput={(params) => <TextField {...params} />}
                value={intervalEnd}
                onChange={(newIntervalEndValue) => {
                 //setIntervalEnd(newIntervalEndValue)
                }}
                onAccept={(newIntervalEndValue) => {
                  setIntervalEnd(newIntervalEndValue)
                }}
            />
        </LocalizationProvider>
      </div>
      <Button onClick={() => swapValues()}>SWAP</Button>
    </section>)
}

export default connector(YearToYearIntervalSelector)