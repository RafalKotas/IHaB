import dayjs, { Dayjs } from "dayjs"
import { compareTwoDates, padTo2Digits } from "../../components/utils/data-helpers"
import { ChartState, dataEntry, dataEntryNoNulls, dateInterval, nullResolvingMethods } from "./types"

export const selectChart = (state : ChartState, chartId : number) => state.charts[chartId]

export const generateNewId = (state : ChartState) => Math.max(...Object.keys(state.charts).map((keyStr) => parseInt(keyStr))) + 1

export const dateIntervalExists = (state: ChartState, 
    chartId : string, 
    intervalToFindStartTime : Dayjs, 
    intervalToFindEndTime : Dayjs) => {
    let intervalOrNull = state.charts[chartId].hourToHour.selectedPeriods.filter((interval) => {
        let {start, end} = interval
        return start && end && compareTwoDates(start, intervalToFindStartTime) && compareTwoDates(end, intervalToFindEndTime)
    })

    if(intervalOrNull.length > 0) {
        return true
    } else {
        return false
    }
}

export const dayDataErrorMessages = (state: ChartState, chartId: string) => {
    let dayErrorMessages = []
    // time interval part
    let {end, start} = state.charts[chartId].dayToDay.selectedInterval
    if(!start) {
        dayErrorMessages.push("Interval start can't be null")
    }
    if(!end) {
        dayErrorMessages.push("Interval end can't be null")
    }
    if(start && end) {
        if(end.isBefore(start)) {
            dayErrorMessages.push("Interval start time have to be earlier than interval end time")
        }
    }
    // selected days part
    if(state.charts[chartId].dayToDay.selectedDays.length === 0) {
        dayErrorMessages.push("At least one day should be choosen!")
    }
    return dayErrorMessages
}

export const hourDataErrorMessages = (state: ChartState, chartId: string) => {
    let hourErrorMessages = []
    // time interval part
    let selectedDays = state.charts[chartId].hourToHour.selectedDays
    let selectedPeriods = state.charts[chartId].hourToHour.selectedPeriods
    if(selectedDays.length === 0) {
        hourErrorMessages.push("At least one day should be choosen!")
    } else if(selectedPeriods.length === 0) {
        hourErrorMessages.push("At least one period should be choosen!")
    }

    return hourErrorMessages
}

export const yearDataErrorMessages = (state: ChartState, chartId: string) => {
    let yearErrorMessages = []
    // time interval part
    let selectedYears = state.charts[chartId].yearToYear.selectedYears
    let { start, end } = state.charts[chartId].yearToYear.selectedInterval
    if(!start) {
        yearErrorMessages.push("Interval start can't be null.")
    }
    if(!end) {
        yearErrorMessages.push("Interval end can't be null.")
    }
    if(start && end) {
        if(end.isBefore(start)) {
            yearErrorMessages.push("Interval start time have to be earlier than interval end time.")
        }
    }
    if(selectedYears.length === 0) {
        yearErrorMessages.push("At least one year should be choosen!")
    }

    return yearErrorMessages
}

export const yearSelectedIntervalInFuture = (state: ChartState, chartId: string) => {
    let selectedYears = state.charts[chartId].yearToYear.selectedYears.map((year) => parseInt(year))
    let todayDate = dayjs()
    let todayYear = todayDate.get("year")

    if(selectedYears.includes(todayYear)) {
        let timeIntervalEnd = state.charts[chartId].yearToYear.selectedInterval.end
        return todayDate.isBefore(timeIntervalEnd)

    } else {
        return false
    }
}

export const isYearIntervalTimeInFuture = (year: string, intervalEnd : Dayjs) => {
    let todayDate = dayjs()
    let todayYear = todayDate.get("year")

    if(todayYear === parseInt(year)) {
        return todayDate.isBefore(intervalEnd)
    } else {
        return false
    }
}

export const daysSelectedIntervalInFuture = (state: ChartState, chartId: string) => {
    let selectedDays = state.charts[chartId].dayToDay.selectedDays
    
    let daysWithHoursInFutureCount = selectedDays.reduce((prevValue, currentDay) => {
        let intervalEnd = state.charts[chartId].dayToDay.selectedInterval.end
        return prevValue + isDayIntervalTimeInFuture(currentDay, intervalEnd) 
    }, 0)

    return daysWithHoursInFutureCount > 0 ? true : false
}

export const isDayIntervalTimeInFuture = (currentDay : Dayjs, intervalEnd : Dayjs | null) => {
    let todayDate = dayjs()
    let currentDayWithHour = currentDay
    if(intervalEnd) {
        let hour = intervalEnd ? intervalEnd.get("hour") : 0
        let minute = intervalEnd ? intervalEnd.get("minute") : 0
        currentDayWithHour = currentDayWithHour.set("hour", hour)
        currentDayWithHour = currentDayWithHour.set("minute", minute)

        return todayDate.isBefore(currentDayWithHour) ? 1 : 0
    } else {
        return 0
    }
}

export const daySelectedIntervalInFuture = (todayDate : dayjs.Dayjs, selectedDay : dayjs.Dayjs, intervalEnd: dayjs.Dayjs) => {
    let currentDayWithHour = selectedDay
    if(intervalEnd) {
        let hour = intervalEnd ? intervalEnd.get("hour") : 0
        let minute = intervalEnd ? intervalEnd.get("minute") : 0
        currentDayWithHour = currentDayWithHour.set("hour", hour)
        currentDayWithHour = currentDayWithHour.set("minute", minute)

        return todayDate.isBefore(currentDayWithHour) ? true : false
    } else {
        return false
    }
}

export const hourSelectedIntervalInFuture = (state: ChartState, chartId: string) => {
    let todayDate = dayjs()

    let selectedHoursPeriodsEnds = state.charts[chartId].hourToHour.selectedPeriods
        .map((period) => {return period.end})

    let periodsAfterCurrentMoment = selectedHoursPeriodsEnds.reduce((prevVal, currVal) => {
        return prevVal + (todayDate.isBefore(currVal) ? 1 : 0) 
    }, 0)

    if(periodsAfterCurrentMoment > 0) {
        return true
    } else {
        return false
    }
}

export const isHourPeriodInFuture = (hourPeriod : dateInterval) => {
    let todayDate = dayjs()
    
    let {end} = hourPeriod

    return todayDate.isBefore(end) ? 1 : 0
}

export const earliestDayFromSelected = (state: ChartState, chartId: string) => {
    //unifies day to show all days on chart
    return state.charts[chartId].dayToDay.selectedDays.reduce((prevValue, currentValue) => {
        return currentValue.isBefore(prevValue) ? currentValue : prevValue
    }, dayjs())
}

export const dayWithEarliestHourPeriodStartFromSelected = (state: ChartState, chartId: string) => {
    let dayWith23Hour = dayjs().set("hour", 23)
    //unifies hour to show all periods data on chart
    return state.charts[chartId].hourToHour.selectedPeriods.reduce((prevValue, currentValue) => {
        return currentValue.start && currentValue.start.get("hour") < prevValue.get("hour") ? currentValue.start : prevValue
    }, dayWith23Hour)
}

export const yearDataToValuesOnly = (state: ChartState, chartId : string, year : string) => {
    let {/*nullResolvingMethod,*/ yearsData} = state.charts[chartId].yearToYear
    let dataForYear = yearsData[year]
    
    let dataEntriesWithoutNull = replaceNullsWithGivenMethod(dataForYear, "connect") as dataEntryNoNulls[]

    return extractDataFromEntries(dataEntriesWithoutNull)
}

// 4
export const replaceNullsWithGivenMethod = (dataEntries : dataEntry[], nullResolvingMethod : nullResolvingMethods) => {
    
    return dataEntries.filter((dataEntry) => {
        return dataEntry[1]
      })
}

// 5
export const extractDataFromEntries = (dataNoNulls : dataEntryNoNulls[]) => {
    return dataNoNulls.map(([_, value]) => {
        return value
    })
}

export const getYearNullProbeCount = (state: ChartState, chartId : string, year : string) => {
    let yearData = state.charts[chartId].yearToYear.yearsData[year]
    let yearDataWithoutNulls = replaceNullsWithGivenMethod(yearData, "connect")
    return yearData.length - yearDataWithoutNulls.length
}

export const getYearFirstProbe = (state: ChartState, chartId : string, year : string) => {
    let yearData = state.charts[chartId].yearToYear.yearsData[year]
    if(yearData.length > 0) {
        let notNullProbes = yearData.filter((data) => {
            return data[1]
        })

        if(notNullProbes.length > 0) {
            let firstProbeTimeInMillis = notNullProbes[0][0] // earliest not null entry
            let hourMillis = 60 * 60 * 1000
            console.log(firstProbeTimeInMillis)
            return probeInYearDescripion(firstProbeTimeInMillis - hourMillis)
        } else {
            return "NO NULL DATA"
        }
    } else {
        return "NO DATA"
    }
}

export const getYearLastProbe = (state: ChartState, chartId : string, year : string) => {
    let yearData = state.charts[chartId].yearToYear.yearsData[year]
    if(yearData.length > 0) {
        let notNullProbes = yearData.filter((data) => {
            return data[1]
        })

        if(notNullProbes.length > 0) {
            let lastProbeTimeInMillis = notNullProbes[notNullProbes.length - 1][0] // latest not null entry
            let hourMillis = 60 * 60 * 1000
            return probeInYearDescripion(lastProbeTimeInMillis - hourMillis)
        } else {
            return "NO NULL DATA"
        }
    } else {
        return "NO DATA"
    }
}

const probeInYearDescripion = (timeInMillis: number) => {
    let probeDate = dayjs(timeInMillis)
    let datePart = padTo2Digits(probeDate.get("date")) + "/" + padTo2Digits(probeDate.get("month") + 1)
    let hourPart = [padTo2Digits(probeDate.get("hour")), padTo2Digits(probeDate.get("minute")), padTo2Digits(probeDate.get("second"))].join(":")
    let dateDescription = datePart + " " + hourPart
    return dateDescription
}

export const getDayNullProbeCount = (state: ChartState, chartId : string, day : string) => {
    let dayData = state.charts[chartId].dayToDay.daysData[day]
    let dayDataWithoutNulls = replaceNullsWithGivenMethod(dayData, "connect")
    return dayData.length - dayDataWithoutNulls.length
}

export const getDayFirstProbe = (state: ChartState, chartId : string, day : string) => {
    let dayData = state.charts[chartId].dayToDay.daysData[day]
    if(dayData.length > 0) {
        let notNullProbes = dayData.filter((data) => {
            return data[1]
        })

        if(notNullProbes.length > 0) {
            let firstProbeTimeInMillis = notNullProbes[0][0] // earliest not null entry
            //let hourMillis = 60 * 60 * 1000
            return probeInYearDescripion(firstProbeTimeInMillis)
        } else {
            return "NO NULL DATA"
        }
    } else {
        return "NO DATA"
    }
}

export const getDayLastProbe = (state: ChartState, chartId : string, day : string) => {
    let dayData = state.charts[chartId].dayToDay.daysData[day]
    if(dayData.length > 0) {
        let notNullProbes = dayData.filter((data) => {
            return data[1]
        })

        if(notNullProbes.length > 0) {
            let lastProbeTimeInMillis = notNullProbes[notNullProbes.length - 1][0] // latest not null entry
            return probeInYearDescripion(lastProbeTimeInMillis)
        } else {
            return "NO NULL DATA"
        }
    } else {
        return "NO DATA"
    }
}

export const dayDataToValuesOnly = (state: ChartState, chartId : string, day : string) => {
    let {/*nullResolvingMethod,*/ daysData} = state.charts[chartId].dayToDay
    let dataForDay = daysData[day]
    
    let dataEntriesWithoutNull = replaceNullsWithGivenMethod(dataForDay, "connect") as dataEntryNoNulls[]

    return extractDataFromEntries(dataEntriesWithoutNull)
}

export const getHourPeriodNullProbeCount = (state: ChartState, chartId : string, hourPeriod : string) => {
    let hourData = state.charts[chartId].hourToHour.hourPeriodsData[hourPeriod]
    let hourDataWithoutNulls = replaceNullsWithGivenMethod(hourData, "connect")
    return hourData.length - hourDataWithoutNulls.length
}

const hourPeriodProbeTimeDescription = (timeInMillis: number) => {
    let probeDate = dayjs(timeInMillis)
    let hour = probeDate.get("hour")
    let minutes = probeDate.get("minute")
    let seconds = probeDate.get("second")

    return [padTo2Digits(hour), padTo2Digits(minutes), padTo2Digits(seconds) ].join(":")
}

export const getHourPeriodFirstProbe = (state: ChartState, chartId : string, hourPeriod : string) => {
    let hourData = state.charts[chartId].hourToHour.hourPeriodsData[hourPeriod]
    if(hourData.length > 0) {
        let notNullProbes = hourData.filter((data) => {
            return data[1]
        })

        if(notNullProbes.length > 0) {
            let firstProbeTimeInMillis = notNullProbes[0][0] // earliest not null entry
            let hourMillis = 60 * 60 * 1000
            return hourPeriodProbeTimeDescription(firstProbeTimeInMillis - hourMillis)
        } else {
            return "NO NULL DATA"
        }
    } else {
        return "NO DATA"
    }
}

export const getHourPeriodLastProbe = (state: ChartState, chartId : string, hourPeriod : string) => {
    let hourData = state.charts[chartId].hourToHour.hourPeriodsData[hourPeriod]
    if(hourData.length > 0) {
        let notNullProbes = hourData.filter((data) => {
            return data[1]
        })

        if(notNullProbes.length > 0) {
            let lastProbeTimeInMillis = notNullProbes[notNullProbes.length - 1][0] // latest not null entry
            let hourMillis = 60 * 60 * 1000
            return hourPeriodProbeTimeDescription(lastProbeTimeInMillis - hourMillis)
        } else {
            return "NO NULL DATA"
        }
    } else {
        return "NO DATA"
    }
}

export const hourPeriodDataToValuesOnly = (state: ChartState, chartId : string, hourPeriod : string) => {
    let {/*nullResolvingMethod,*/ hourPeriodsData} = state.charts[chartId].hourToHour
    let dataForHourPEriod = hourPeriodsData[hourPeriod]
    
    let dataEntriesWithoutNull = replaceNullsWithGivenMethod(dataForHourPEriod, "connect") as dataEntryNoNulls[]

    return extractDataFromEntries(dataEntriesWithoutNull)
}