// mui 
import { Box, Chip, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

import dayjs, { Dayjs } from "dayjs"

// react
import { useEffect, useState } from "react"

// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../store"

// store
import { ChangeSelectedDaysD2D, dayToDayProps } from "../../../../store/charts"
import { compareTwoDates } from "../../../utils/data-helpers"

import "./daysToCompareSelector.css"

interface OwnDaysToCompareSelectorProps {
    dayToDayProps : dayToDayProps,
    chartId : string
}
  
const mapStateToProps = (state: AppState, ownProps : OwnDaysToCompareSelectorProps) => ({
    chartDetails : state.chartsReducer.charts[ownProps.chartId],
    selectedDaysStore : state.chartsReducer.charts[ownProps.chartId].dayToDay.selectedDays
})
  
const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnDaysToCompareSelectorProps) => ({
    changeSelectedDays: (arrayOfDays : Dayjs[]) => dispatch(ChangeSelectedDaysD2D(ownProps.chartId, arrayOfDays))
})
  
const connector = connect(mapStateToProps, mapDispatchToProps)
  
type DaysToCompareSelectorPropsFromRedux = ConnectedProps<typeof connector>

type DaysToCompareSelectorProps = DaysToCompareSelectorPropsFromRedux & OwnDaysToCompareSelectorProps

const DaysToCompareSelector : React.FC<DaysToCompareSelectorProps> = ({dayToDayProps, selectedDaysStore, 
    changeSelectedDays}) => {

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

    const [pickedDay, setPickedDay] = useState<Dayjs | null>(null)
    const [selectedDays, setSelectedDays] = useState<Dayjs[]>(selectedDaysStore)
    
    const handleDaySelect = (dateSelected : Dayjs) => {

        if(selectedDays) {
            let dayExists = selectedDays.reduce((prevValue, curValue) => {
                return prevValue || compareTwoDates(curValue, dateSelected)
            }, false)
          if(selectedDays.length < 5 && !dayExists) {
            let dateWithAddedHour = dateSelected.add(1, "hour")
            setSelectedDays([...selectedDays, dateWithAddedHour])
          }
        } else {
          let dateWithAddedHour = dateSelected.add(1, "hour")
          setSelectedDays([dateWithAddedHour])
        }

        setPickedDay(dateSelected)
    }

    useEffect(() => {
        changeSelectedDays(selectedDays)
    }, [selectedDays])

    const dayJSToDayDescriptionStr = (dayjs : Dayjs) => {
        return dayjs.date() + "/" + (dayjs.month() + 1) + "/" + dayjs.year()
    }

    const mapDayjsToDescriptions = () => {
        return selectedDays.map((dayjsDate) => {
          return dayJSToDayDescriptionStr(dayjsDate)
        })
    }
     

    return (
        <section className={"days-compare-selector-section"}>
            <h4>DAY TO DAY SELECTOR</h4>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    views={['day']}
                    label="Pick a day"
                    value={pickedDay}
                    onChange={(updatedDate) => {
                        if(updatedDate) {
                          handleDaySelect(updatedDate)
                        }
                    }}
                    disabled={selectedDaysStore && selectedDaysStore.length === 5}
                    renderInput={(params) => <TextField
                        style={{
                            opacity: 1.0,
                            background: "white"
                        }}
                        {...params}
                        helperText={null}

                    />}
                />
            </LocalizationProvider>
            <h4>Days to compare selected</h4>
            <Select
                style={{
                    opacity: 1.0,
                    width: "75%",
                    alignSelf: "center",
                    background: "white"
                }}
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={mapDayjsToDescriptions()}
                onChange={(event: SelectChangeEvent<string[]>) => {
                    let daysDescriptionsUpdated = event.target.value
                    console.log("selected Days: ")
                    console.log(selectedDays)
                    let updatedDatesDayJs = selectedDays.filter((dateDayjs) => {
                        return daysDescriptionsUpdated.includes(dayJSToDayDescriptionStr(dateDayjs))
                    })
                    console.log("updated Days: ")
                    console.log(updatedDatesDayJs)

                    setSelectedDays(updatedDatesDayJs)
                }
                }
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
                {selectedDays ? selectedDays.map((dayJS, index) => (
                <MenuItem
                    key={dayJSToDayDescriptionStr(dayJS) + "-menuItem"}
                    value={dayJSToDayDescriptionStr(dayJS)}
                    onChange={(event: React.FormEvent<HTMLLIElement>) => {
                    console.log(event.target)
                    }}
                >
                    {dayJSToDayDescriptionStr(dayJS)}
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

export default connector(DaysToCompareSelector)