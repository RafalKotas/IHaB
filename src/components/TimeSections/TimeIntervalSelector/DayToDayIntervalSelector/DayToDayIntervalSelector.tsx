// redux-store
import { chartProps } from "../../../../store/charts/types"
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../store"
import { SetDayToDayChartEndTime, SetDayToDayChartStartTime} from "../../../../store/charts"

import { Dayjs } from "dayjs"

// components
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { TextField } from "@mui/material"

// styles
import "./dayToDayIntervalSelector.css"
import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { padTo2Digits } from "../../../utils/data-helpers"

interface OwnDayToDayIntervalSelectorProps {
    chartDetails: chartProps,
    chartId: string
}

const mapStateToProps = (state: AppState, ownProps : OwnDayToDayIntervalSelectorProps) => ({
  chartDetails : state.chartsReducer.charts[ownProps.chartId],
  selectedIntervalStart: state.chartsReducer.charts[ownProps.chartId].dayToDay.selectedInterval.start,
  selectedIntervalEnd: state.chartsReducer.charts[ownProps.chartId].dayToDay.selectedInterval.end
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnDayToDayIntervalSelectorProps) => ({
  passStartTimeToStore: (updatedStartTime : Dayjs) => dispatch(SetDayToDayChartStartTime(ownProps.chartId, updatedStartTime)),
  passEndTimeToStore: (updatedEndTime : Dayjs) => dispatch(SetDayToDayChartEndTime(ownProps.chartId, updatedEndTime))
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type DayToDayIntervalSelectorPropsFromRedux = ConnectedProps<typeof connector>

type DayToDayIntervalSelectorProps = DayToDayIntervalSelectorPropsFromRedux & OwnDayToDayIntervalSelectorProps

const DayToDayIntervalSelector : React.FC<DayToDayIntervalSelectorProps> = ({selectedIntervalStart, selectedIntervalEnd,
   passStartTimeToStore, passEndTimeToStore}) => {

    const [intervalStart, setIntervalStart] = useState<Dayjs | null>(selectedIntervalStart)
    const [intervalEnd, setIntervalEnd] = useState<Dayjs | null>(selectedIntervalEnd)
  
    const selectedTimeIndicator = (intervalStartOrEnd : Dayjs | null) => {
      return (<span>{intervalStartOrEnd ? (padTo2Digits(intervalStartOrEnd.hour()) + ":" + padTo2Digits(intervalStartOrEnd.minute())) : "HH-MM"}</span>)
    }

    const swapValues = () => {
      let oldIntervalStart = intervalStart
      let oldIntervalEnd = intervalEnd
      setIntervalStart(oldIntervalEnd)
      setIntervalEnd(oldIntervalStart)
    }

    useEffect(() => {
      if(intervalStart) {
        passStartTimeToStore(intervalStart)
      }
    }, [intervalStart])

    useEffect(() => {
      if(intervalEnd) {
        passEndTimeToStore(intervalEnd)
      }
    }, [intervalEnd])

    return (<section
      className={"day-to-day-interval-selector"}
    >
      <div className="date-picker-with-header">
        <h5>Time interval start - {selectedTimeIndicator(intervalStart)} </h5>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label={"Interval start time"}
              value={intervalStart}
              onChange={(newIntervalStartValue) => {
                //setIntervalStart(newIntervalStartValue);
              }}
              onAccept={(newIntervalStartValue) => {
                setIntervalStart(newIntervalStartValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
      </div>
      <div className="date-picker-with-header">
        <h5>Time interval end - {selectedTimeIndicator(intervalEnd)} </h5>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label={"Interval end time"}
              value={intervalEnd}
              onChange={(newIntervalEndValue) => {
                //setIntervalEnd(newIntervalEndValue);
              }}
              onAccept={(newIntervalEndValue) => {
                setIntervalEnd(newIntervalEndValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
      </div>
      <Button onClick={() => swapValues()}>SWAP</Button>
    </section>)
}

export default connector(DayToDayIntervalSelector)