// react
import React, { useEffect, useState } from "react"

// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../store"
import { AddDatetimePeriod, ClearDatetimePeriods, hourToHourProps } from "../../../../store/charts"

// mui 
import { Box, Button, Chip, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"



// dayjs
import dayjs, { Dayjs } from "dayjs"

// styles
import "./hourPeriodsToCompareSelector.css"
import { padTo2Digits } from "../../../utils/data-helpers"
import { dateIntervalExists } from "../../../../store/charts/selectors"

interface OwnHourPeriodsToCompareSelector {
    hourToHourProps : hourToHourProps,
    chartId: string
}
  
const mapStateToProps = (state: AppState, ownProps : OwnHourPeriodsToCompareSelector) => ({
    intervalAlreadyExists: (intervalStart : Dayjs, intervalEnd : Dayjs) => dateIntervalExists(state.chartsReducer, ownProps.chartId,
        intervalStart, intervalEnd),
    selectedIntervals: state.chartsReducer.charts[ownProps.chartId].hourToHour.selectedPeriods
})
  
const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnHourPeriodsToCompareSelector) => ({
    addDatetimePeriod: (datetimePeriodStart : Dayjs, datetimePeriodEnd : Dayjs) => 
        dispatch(AddDatetimePeriod(ownProps.chartId,  datetimePeriodStart, datetimePeriodEnd)),
    clearDatetimePeriods: () => dispatch(ClearDatetimePeriods(ownProps.chartId))
})
  
const connector = connect(mapStateToProps, mapDispatchToProps)
  
type HourPeriodsToCompareSelectorPropsFromRedux = ConnectedProps<typeof connector>
  
type HourPeriodsToCompareSelectorProps = HourPeriodsToCompareSelectorPropsFromRedux & OwnHourPeriodsToCompareSelector

const HourPeriodsToCompareSelector : React.FC<HourPeriodsToCompareSelectorProps> = ({chartId, hourToHourProps, selectedIntervals,
    intervalAlreadyExists, addDatetimePeriod, clearDatetimePeriods}) => {

    let { selectedDays } = hourToHourProps

    const possiblePeriodDurations = [1, 2, 3, 4, 6, 8, 12]
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

    const [intervalError, setIntervalError] = useState<boolean>(false)

    const [periodDurationInHours , setPeriodDurationInHours] = useState<number>(6)

    useEffect(() => {
        let periodBasicEndTime = padTo2Digits(periodDurationInHours) + ":00" 
        if(startTime !== "00:00") {
            setStartTime("00:00")
            clearDatetimePeriods()
        } else if(endTime !== periodBasicEndTime) {
            setEndTime(periodBasicEndTime)
            clearDatetimePeriods()
        }
    }, [periodDurationInHours])

    const [startTime, setStartTime] = useState<string>("00:00")
    const [endTime, setEndTime] = useState<string>("06:00")

    const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null)

    useEffect(() => {
        console.log(selectedDay)
    }, [selectedDay])

    const handleIntervalDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPeriodDurationInHours( parseInt( (event.target as HTMLInputElement).value) )
    }
    

    useEffect(() => {
        console.log(hourToHourProps)
    }, [hourToHourProps])

    useEffect(() => {
        console.log("startTime: " + startTime + " , endTime: " + endTime)
        setIntervalError(errorConditions())
        //eslint-disable-next-line
    }, [startTime, endTime])

    useEffect(() => {
        console.log("change endTime!")
        let startTimeInMinutes = timeInMinutes(startTime)
        let updatedEndTimeInMinutes = (startTimeInMinutes + periodDurationInHours * 60) % 1440
        
 
        let updatedEndTimeHours = Math.floor(updatedEndTimeInMinutes / 60)
        let updatedEndTimeMinutes = updatedEndTimeInMinutes - updatedEndTimeHours * 60
            
        let updatedEndTime = convertHoursAndMinutesToTime( updatedEndTimeHours, updatedEndTimeMinutes )
            
        setEndTime(updatedEndTime)
        
        //eslint-disable-next-line
    }, [startTime])

    useEffect(() => {
        let endTimeInMinutes = timeInMinutes(endTime)
        let updatedStartTimeInMinutes = endTimeInMinutes - periodDurationInHours * 60

        if(updatedStartTimeInMinutes < 0) {
            updatedStartTimeInMinutes = 24 * 60 + updatedStartTimeInMinutes
        }
        
        let updatedStartTimeHours = Math.floor(updatedStartTimeInMinutes / 60)
        let updatedStartTimeMinutes = updatedStartTimeInMinutes - updatedStartTimeHours * 60
            
        let updatedStartTime = convertHoursAndMinutesToTime( updatedStartTimeHours, updatedStartTimeMinutes )
            
        setStartTime(updatedStartTime)

        //eslint-disable-next-line
    }, [endTime])

    const hoursAndMinutesToNumbers = (hourAsStr : string) => {
        let hours = parseInt(hourAsStr.substring(0, 2))
        let minutes = parseInt(hourAsStr.substring(3, 5))
        console.log("hours: " + hours + " minutes: " + minutes)
        return {hours, minutes}
    }

    // time (HH:MM) in minutes
    const timeInMinutes = (hourAsStr : string) => {

        let {hours, minutes} = hoursAndMinutesToNumbers(hourAsStr)
    
        return (hours * 60 + minutes)
    }

    const convertHoursAndMinutesToTime = (hoursAsNumber : number, minutesAsNumber : number) => {
        let hourPart = convertNumberToTimePart(hoursAsNumber)
        let minutesPart = convertNumberToTimePart(minutesAsNumber)
        return  hourPart + ":" + minutesPart
    }

    const convertNumberToTimePart = (numberToConvert : number) => {
        return numberToConvert > 9 ? numberToConvert.toString() : ("0" + numberToConvert) 
    }

    const changeStartTime = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let updatedStartTime = event.target.value
        setStartTime(updatedStartTime)
    }

    const changeEndTime = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let updatedEndTime = event.target.value
        setEndTime(updatedEndTime)
    }

    const errorConditions = () => {
        let startTimeTooLate = timeInMinutes(startTime) + periodDurationInHours * 60 > 24 * 60
        let endTimeTooEarly = timeInMinutes(endTime) - periodDurationInHours * 60 < 0 && timeInMinutes(endTime) !== 0
        return startTimeTooLate || endTimeTooEarly
    }

    const dayJSToDayDescriptionStr = (dayjs : Dayjs | null) => {
        //console.log(selectedDay)
        if(dayjs) {
            let dayOfMonth = dayjs.date()
            let month = dayjs.month()
            let year = dayjs.year()
            return padTo2Digits(dayOfMonth) + "/" + padTo2Digits(month + 1) + "/" + year   
        } else {
           return ""
        }
    }

    const formatDate = (date : Date) => {
        return [
          padTo2Digits(date.getDate()),
          padTo2Digits(date.getMonth() + 1),
          date.getFullYear(),
        ].join("/")
    }

    const intervalPartParseToString = (date : Dayjs | null) => {
        if(date) {
            let hours = padTo2Digits(date.hour())
            let minutes = padTo2Digits(date.minute())
    
            return hours + ":" + minutes
        } else {
            return "HH:MM"
        }
    }

    const intervalParseToString = (intervalStart : Dayjs | null, intervalEnd : Dayjs | null) => {
        return intervalPartParseToString(intervalStart) + " - " + intervalPartParseToString(intervalEnd)
    }

    const intervalGetDay = (intervalPart: Dayjs | null) => {
        if(intervalPart) {
            return intervalPart.format("DD/MM/YYYY")
        } else {
            return "DD/MM/YYYY"
        }
    }

    return (
        <section className={"hours-compare-selector-section"}>
            <h5>HOURS TO HOURS SELECTOR</h5>
            <div className={"day-including-interval-selector"}>
                <h6>Select day:</h6>
                <Select
                    style={{
                        opacity: 1.0,
                        background: "white",
                        alignSelf: "stretch"
                    }}
                    labelId="demo-multiple-chip-label"
                    id={"hour-to-hour-" + chartId}
                    value={dayJSToDayDescriptionStr(selectedDay)}
                    onChange={(event: SelectChangeEvent<string>) => {
                        let updatedSelectedDay = event.target.value
                        console.log(updatedSelectedDay)
                        setSelectedDay(dayjs(updatedSelectedDay, "DD/MM/YYYY"))
                    }}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={() => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            <Chip key={"abc"} label={dayJSToDayDescriptionStr(selectedDay)} />
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {selectedDays ? selectedDays.map((dayValue, index) => (
                        <MenuItem
                            key={dayJSToDayDescriptionStr(dayValue) + "-menuItem"}
                            value={dayJSToDayDescriptionStr(dayValue)}
                            onChange={(event: React.FormEvent<HTMLLIElement>) => {
                                console.log(event.target)
                            }}
                        >
                            {dayJSToDayDescriptionStr(dayValue)}
                        </MenuItem>))
                        :
                        <MenuItem
                            key={"item"}
                            value={"item"}
                        >
                            {"item"}
                        </MenuItem>}
                </Select>
            </div>
            <div>
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Select period duration in H:</FormLabel>
                    <RadioGroup
                        row
                        sx={{
                            display: "flex",
                            justifyContent: "center"
                        }}
                        value={periodDurationInHours}
                        onChange={handleIntervalDurationChange}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        className={"hour-periods-radios"}
                    >
                        {
                            possiblePeriodDurations.map((duration) => {
                               return <FormControlLabel
                                    className="hour-radio-btn"
                                    value={duration} 
                                    control={<Radio />} 
                                    label={duration.toString()} 
                                />        
                            })
                        }
                    </RadioGroup>
                </FormControl>
                <div className={"hour-selector-area"}>
                    <TextField
                        style={{
                            opacity: 1.0,
                            background: "white"
                        }}
                        label="Start Hour"
                        type="time"
                        defaultValue={startTime}
                        value={startTime}
                        error={intervalError}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                            changeStartTime(event)
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    <TextField
                        style={{
                            opacity: 1.0,
                            background: "white"
                        }}
                        label="End Hour"
                        type="time"
                        defaultValue={endTime}
                        value={endTime}
                        error={intervalError}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                            changeEndTime(event)
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    <Button onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                        let dateToAdd = selectedDay
                        if(dateToAdd) {
                            let periodStartTime = dateToAdd.clone()
                            let {hours : startHours, minutes : startMinutes} = hoursAndMinutesToNumbers(startTime)
                            periodStartTime = periodStartTime.hour(startHours)
                            periodStartTime = periodStartTime.minute(startMinutes)
                            
                            let periodEndTime = dateToAdd.clone()
                            let {hours : endHours, minutes : endMinutes} = hoursAndMinutesToNumbers(endTime)
                            periodEndTime = periodEndTime.hour(endHours)
                            periodEndTime = periodEndTime.minute(endMinutes)

                            if(!intervalAlreadyExists(periodStartTime, periodEndTime) && selectedIntervals.length < 5) {
                                addDatetimePeriod(periodStartTime, periodEndTime)
                            }
                        }
                    }} disabled={intervalError || !selectedDay} color={intervalError ? "error" : "success"} variant="contained">
                        ADD
                    </Button>
                </div>
            </div>
            {/*<div className="selected-time-intervals-viewer">
                <h3>Selected Intervals:</h3>
                <List
                    sx={{
                        overflowY: "scroll",
                        maxHeight: 80,
                        width: "80%",
                        maxWidth: 360,
                        bgcolor: "background.paper",
                    }}
                >
                    {
                        selectedIntervals.map((selectedInterval, index) => {
                            return <React.Fragment>
                                <ListItem sx={{
                                    maxHeight: 50
                                }}>
                                    <ListItemText primary={intervalParseToString(selectedInterval.start, selectedInterval.end)} secondary={intervalGetDay(selectedInterval.start)} />
                                </ListItem>
                                <Divider component="li" />
                                <li>
                                    <Typography
                                    sx={{ mt: 0.5, ml: 2 }}
                                    color="text.secondary"
                                    display="block"
                                    variant="caption"
                                    >
                                        {index + 1}
                                    </Typography>
                                </li>
                            </React.Fragment>
                        })
                    }
                </List>
            </div>*/}
        </section>
    )
}

export default connector(HourPeriodsToCompareSelector)