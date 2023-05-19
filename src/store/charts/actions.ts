import { Dayjs } from "dayjs"
import { periodData } from "../../components/utils/data-helpers"
import * as chartTypes from "./types"

export const TriggerFetch = (chartId: string) => {
    return {
        type: chartTypes.TRIGGER_FETCH,
        payload: {
            chartId
        }
    }
}

export const StartRealtimeFetching = (chartId: string) => {
    return {
        type: chartTypes.START_REALTIME_FETCHING,
        payload: {
            chartId
        }
    }
}


export const AddYearSerie = (chartId : string, dataObject : periodData) => {
    return {
        type: chartTypes.ADD_YEAR_SERIE,
        payload: {
            chartId,
            dataObject
        }
    }
}

export const AddDaySerie = (chartId : string, dataObject : periodData) => {
    return {
        type: chartTypes.ADD_DAY_SERIE,
        payload: {
            chartId,
            dataObject
        }
    }
}

export const AddHourPeriodSerie = (chartId: string, dataObject : periodData) => {
    return {
        type: chartTypes.ADD_HOUR_PERIOD_SERIE,
        payload: {
            chartId,
            dataObject
        }
    }
}

export const AddNewChart = (newId : string) => {
    return {
        type: chartTypes.ADD_NEW_CHART,
        payload: {
            newId
        }
    }
}

export const RemoveExistingChart = (chartId : string) => {
    return {
        type: chartTypes.REMOVE_EXISTING_CHART,
        payload: {
            chartId
        }
    }
}

export const ChangeChartType = (chartId : string, updatedType : chartTypes.chartTypes) => {
    return {
        type: chartTypes.CHANGE_CHART_TYPE,
        payload: {
            chartId,
            updatedType
        }
    }
}

export const ChangeChartDataSource = (chartId : string, updatedDataSource : chartTypes.dataSources) => {
    return {
        type: chartTypes.CHANGE_CHART_DATA_SOURCE,
        payload: {
            chartId,
            updatedDataSource
        }
    }
}

export const ClearCorrectnessState = (chartId : string) => {
    return {
        type: chartTypes.CLEAR_CORRECTNESS_STATE,
        payload: {
            chartId
        }
    }
}

export const SetYearToYearChartIntervalStart = (chartId : string, intervalStart : Dayjs) => {
    return {
        type: chartTypes.SET_Y2Y_CHART_INTERVAL_START,
        payload: {
            chartId,
            intervalStart
        }
    }
}

export const SetYearToYearChartIntervalEnd = (chartId : string, intervalEnd : Dayjs) => {
    return {
        type: chartTypes.SET_Y2Y_CHART_INTERVAL_END,
        payload: {
            chartId,
            intervalEnd
        }
    }
}

//Y2Y
export const AddYearData = (chartId: string, yearData : periodData) => {
    return {
        type: chartTypes.ADD_YEAR_DATA,
        payload: {
            chartId,
            yearData
        }
    }
}

//Y2Y
export const UpdateYearsToCompare = (chartId : string, updatedYearsArray : string[]) => {
    return {
        type: chartTypes.UPDATE_YEARS_TO_COMPARE,
        payload: {
            chartId,
            updatedYearsArray
        }
    }
}

//Y2Y
export const CheckYearDataCorrectness = (chartId: string) => {
    return {
        type : chartTypes.CHECK_YEAR_DATA_CORRECTNESS,
        payload: {
            chartId
        }
    }
}

//Y2Y
export const ToggleYearChartRealTime = (chartId : string) => {
    return {
        type: chartTypes.TOGGLE_YEAR_CHART_REAL_TIME,
        payload: {
            chartId
        }
    }
}

//D2D
export const ChangeSelectedDaysD2D = (chartId: string, daysArray : Dayjs[]) => {
    return {
        type : chartTypes.CHANGE_SELECTED_DAYS,
        payload: {
            chartId,
            daysArray
        }
    }
}

//D2D
export const SetDayToDayChartStartTime = (chartId : string, startTime : Dayjs) => {
    return {
        type: chartTypes.SET_D2D_CHART_START_TIME,
        payload: {
            chartId,
            startTime
        }
    }
}

//D2D
export const SetDayToDayChartEndTime = (chartId : string, endTime : Dayjs) => {
    return {
        type: chartTypes.SET_D2D_CHART_END_TIME,
        payload: {
            chartId,
            endTime
        }
    }
}

//D2D
export const AddDayData = (chartId : string, dayData : periodData) => {
    return {
        type: chartTypes.ADD_DAY_DATA,
        payload: {
            chartId,
            dayData
        }
    }
}

//D2D
export const CheckDayDataCorrectness = (chartId: string) => {
    return {
        type : chartTypes.CHECK_DAY_DATA_CORRECTNESS,
        payload: {
            chartId
        }
    }
}

//D2D
export const ToggleDayChartRealTime = (chartId: string) => {
    return {
        type : chartTypes.TOGGLE_DAY_CHART_REAL_TIME,
        payload: {
            chartId
        } 
    }
}

//H2H
export const AddNewDayOptionToChart  = (chartId : string, newDayOption : Dayjs) => {
    return {
        type: chartTypes.ADD_NEW_DAY_OPTION,
        payload: {
            chartId,
            newDayOption
        }
    }
}

//H2H
export const RemoveDayOptionFromChart  = (chartId : string, dayOptionToRemove : Dayjs) => {
    return {
        type: chartTypes.REMOVE_DAY_OPTION,
        payload: {
            chartId,
            dayOptionToRemove
        }
    }
}

//H2H
export const AddDatetimePeriod = (chartId: string, datetimePeriodStart : Dayjs, datetimePeriodEnd : Dayjs) => {
    return {
        type : chartTypes.ADD_DATETIME_PERIOD,
        payload: {
            chartId,
            datetimePeriodStart,
            datetimePeriodEnd
        }
    }
}

//H2H
export const ClearDatetimePeriods = (chartId : string) =>{
    return {
        type : chartTypes.CLEAR_DATETIME_PERIODS,
        payload : {
            chartId
        }
    }
}

//H2H
export const CheckHourDataCorrectness = (chartId: string) => {
    return {
        type : chartTypes.CHECK_HOUR_DATA_CORRECTNESS,
        payload: {
            chartId
        }
    }
}

//H2H
export const AddHourPeriodData = (chartId : string, hourPeriodData : periodData) => {
    return {
        type: chartTypes.ADD_HOUR_PERIOD_DATA,
        payload: {
            chartId,
            hourPeriodData
        }
    }
}

//H2H
export const ToggleHourChartRealTime = (chartId: string) => {
    return {
        type : chartTypes.TOGGLE_HOUR_CHART_REAL_TIME,
        payload: {
            chartId
        }
    }
}