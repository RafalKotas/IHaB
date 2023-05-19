// components
import { Box, Chip, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { Dayjs } from "dayjs"

// react
import { useState } from "react"

// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../store"


import "./daySelector.css"
import { AddNewDayOptionToChart, RemoveDayOptionFromChart } from "../../../store/charts"
import { compareTwoDates, padTo2Digits } from "../../utils/data-helpers"

interface OwnDaySelectorProps {
  chartId: string
}

const mapStateToProps = (state: AppState, ownProps : OwnDaySelectorProps) => ({
  chartDetails : state.chartsReducer.charts[ownProps.chartId]
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnDaySelectorProps) => ({
  addNewDayOption: (newDayOption : Dayjs) => dispatch(AddNewDayOptionToChart(ownProps.chartId, newDayOption)),
  removeDayOption: (dayOptionToRemove : Dayjs) => dispatch(RemoveDayOptionFromChart(ownProps.chartId, dayOptionToRemove))
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type DaySelectorPropsFromRedux = ConnectedProps<typeof connector>

type DaySelectorProps = DaySelectorPropsFromRedux & OwnDaySelectorProps

const DaySelector : React.FC<DaySelectorProps> = ({chartId, chartDetails, addNewDayOption, removeDayOption}) => {

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

  const [selectedDates, setSelectedDates] = useState<Dayjs[]>(chartDetails.hourToHour.selectedDays)//([])
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)

    const handleDaySelect = (dateSelected : Dayjs) => {
      if(selectedDates) {
        let dateExists = selectedDates.reduce((prevValue, curValue, ) => {
          return prevValue || compareTwoDates(curValue, dateSelected)
        }, false)
        if(selectedDates.length < 5 && !dateExists) {
          console.log("date to add: ")
          console.log(dateSelected)
          setSelectedDates([...selectedDates, dateSelected])
          addNewDayOption(dateSelected)
        }
      } else {
        setSelectedDates([dateSelected])
      }
    }

    const dayJSToDayDescriptionStr = (dayjs : Dayjs) => {
      return padTo2Digits(dayjs.date()) + "/" + padTo2Digits(dayjs.month() + 1) + "/" + dayjs.year()
    }

    const mapDayjsToDescriptions = () => {
      return selectedDates.map((dayjsDate) => {
        return dayJSToDayDescriptionStr(dayjsDate)
      })
    }

    return (
      <section
        className={"day-selector-section"}
      >
        <div className="date-picker-with-header">
            <h5>Select days (MAX 5):</h5>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Day selector picker"
                inputFormat={`DD/MM/YYYY`}
                value={selectedDate}
                onChange={(updatedDate) => {
                  if(updatedDate) {
                    handleDaySelect(updatedDate)
                  }
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
        </div>
        <Select
            style={{
              alignSelf: "stretch",
              opacity: 1.0,
              background: "white"
            }}
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={mapDayjsToDescriptions()}
            onChange={(event: SelectChangeEvent<string[]>) => {
              let daysDescriptionsUpdated = event.target.value
              
              let updatedDatesDayJs = selectedDates.filter((dateDayjs) => {
                return daysDescriptionsUpdated.includes(dayJSToDayDescriptionStr(dateDayjs))
              })

              let removedDays = selectedDates.filter((dateDayjs) => {
                return !daysDescriptionsUpdated.includes(dayJSToDayDescriptionStr(dateDayjs))
              })

              if(removedDays && removedDays[0]) {
                let removedDay = removedDays[0]
                console.log("remove day!!! DS")
                removeDayOption(removedDay)
              }

              setSelectedDates(updatedDatesDayJs)
            }}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected ? selected.map((value, index) => (
                  <Chip key={value} label={value} />
                )) : <Chip key={"abc"} label={"abc"} />}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {selectedDates ? selectedDates.map((dateValue, index) => (
              <MenuItem
                key={dayJSToDayDescriptionStr(dateValue) + "-menuItem"}
                value={dayJSToDayDescriptionStr(dateValue)}
              >
                {dayJSToDayDescriptionStr(dateValue)}
              </MenuItem>)) 
                :   
              <MenuItem
                key={"item"}
                value={"item"}
              >
                {"item"}
              </MenuItem> }
        </Select>
      </section>
    )
}

export default connector(DaySelector)