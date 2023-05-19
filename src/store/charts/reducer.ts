import { ChartState,
    ADD_NEW_CHART,
    CHANGE_CHART_TYPE,
    ChartActionTypes,
    CHANGE_CHART_DATA_SOURCE,
    AllChartTypesEmptyProps,
    ADD_NEW_DAY_OPTION,
    REMOVE_DAY_OPTION,
    ADD_DATETIME_PERIOD,
    dateInterval,
    CHANGE_SELECTED_DAYS,
    REMOVE_EXISTING_CHART,
    SET_Y2Y_CHART_INTERVAL_START,
    SET_Y2Y_CHART_INTERVAL_END,
    UPDATE_YEARS_TO_COMPARE,
    SET_D2D_CHART_START_TIME,
    SET_D2D_CHART_END_TIME,
    CLEAR_DATETIME_PERIODS,
    CHECK_DAY_DATA_CORRECTNESS,
    CHECK_HOUR_DATA_CORRECTNESS,
    CLEAR_CORRECTNESS_STATE,
    CHECK_YEAR_DATA_CORRECTNESS,
    TOGGLE_YEAR_CHART_REAL_TIME,
    TOGGLE_DAY_CHART_REAL_TIME,
    TOGGLE_HOUR_CHART_REAL_TIME,
    TRIGGER_FETCH,
    ADD_YEAR_SERIE,
    ADD_DAY_SERIE,
    ADD_HOUR_PERIOD_SERIE,
    START_REALTIME_FETCHING,
    ADD_DAY_DATA,
    ADD_YEAR_DATA,
    ADD_HOUR_PERIOD_DATA} from "./types"
import { Reducer } from "redux"
import { dayDataErrorMessages, hourDataErrorMessages, yearDataErrorMessages } from "./selectors"

export const initialChartState: ChartState = {
    charts : {
        "0": {
            chartTypeSelected: "Day to day",
            chartDataSource: "DHT22_temperature",
            ...AllChartTypesEmptyProps
        },
        "1": {
            chartTypeSelected: "Year to year",
            chartDataSource: "DHT22_relativeHumidity",
            ...AllChartTypesEmptyProps
        }
    }
}


export const chartsReducer: Reducer<ChartState, ChartActionTypes> = (state = initialChartState, action : ChartActionTypes) => {
    switch (action.type) {
        case TRIGGER_FETCH:
            switch(state.charts[action.payload.chartId].chartTypeSelected) {
                case("Year to year"):
                    return {
                        ...state,
                        charts : {
                            ...state.charts,
                            [action.payload.chartId] : {
                                ...state.charts[action.payload.chartId],
                                yearToYear: {
                                    ...state.charts[action.payload.chartId].yearToYear,
                                    fetchDataTriggered: true
                                }
                            }
                        }
                    }
                case("Day to day"):
                    return {
                        ...state,
                        charts : {
                            ...state.charts,
                            [action.payload.chartId] : {
                                ...state.charts[action.payload.chartId],
                                dayToDay: {
                                    ...state.charts[action.payload.chartId].dayToDay,
                                    fetchDataTriggered: true
                                }
                            }
                        }
                    }
                case("Hour to hour"):
                    return {
                        ...state,
                        charts : {
                            ...state.charts,
                            [action.payload.chartId] : {
                                ...state.charts[action.payload.chartId],
                                hourToHour: {
                                    ...state.charts[action.payload.chartId].hourToHour,
                                    fetchDataTriggered: true
                                }
                            }
                        }
                    }
                default:
                    return {
                        ...state
                    }
            }
        case START_REALTIME_FETCHING:
            switch (state.charts[action.payload.chartId].chartTypeSelected) {
                case ("Year to year"):
                    return {
                        ...state,
                        charts: {
                            ...state.charts,
                            [action.payload.chartId]: {
                                ...state.charts[action.payload.chartId],
                                yearToYear: {
                                    ...state.charts[action.payload.chartId].yearToYear,
                                    realTime: true
                                }
                            }
                        }
                    }
                case ("Day to day"):
                    return {
                        ...state,
                        charts: {
                            ...state.charts,
                            [action.payload.chartId]: {
                                ...state.charts[action.payload.chartId],
                                dayToDay: {
                                    ...state.charts[action.payload.chartId].dayToDay,
                                    realTime: true
                                }
                            }
                        }
                    }
                case ("Hour to hour"):
                    return {
                        ...state,
                        charts: {
                            ...state.charts,
                            [action.payload.chartId]: {
                                ...state.charts[action.payload.chartId],
                                hourToHour: {
                                    ...state.charts[action.payload.chartId].hourToHour,
                                    realTime: true
                                }
                            }
                        }
                    }
                default:
                    return {
                        ...state
                    }
            }
        case ADD_NEW_CHART:
            return {
                ...state,
                charts : {
                    ...state.charts,
                    [action.payload.newId] : {
                        chartTypeSelected: "Year to year",
                        chartDataSource: "DHT22_temperature",
                        ...AllChartTypesEmptyProps
                    }
                }
            }
        case REMOVE_EXISTING_CHART:
            let chartsAfterRemovedOne = Object.fromEntries(Object.entries(state.charts).filter(([key]) => key !== action.payload.chartId));
            return {
                ...state,
                charts : chartsAfterRemovedOne
            }
        case CHANGE_CHART_TYPE:
            let { chartId, updatedType } = action.payload
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [chartId]: {
                        ...state.charts[chartId],
                        chartTypeSelected: updatedType
                    }

                }
            }
        case CHANGE_CHART_DATA_SOURCE:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        chartDataSource: action.payload.updatedDataSource,
                        yearToYear: {
                            ...state.charts[action.payload.chartId].yearToYear,
                            fetchingData: false,
                            dataValid: 0,
                            fetchDataTriggered: false,
                            realTime: false,
                            selectedYears: [],
                            yearsData: {}
                        },
                        dayToDay: {
                            ...state.charts[action.payload.chartId].dayToDay,
                            fetchingData: false,
                            dataValid: 0,
                            fetchDataTriggered: false,
                            realTime: false,
                            selectedDays: [],
                            daysData: {}
                        },
                        hourToHour: {
                            ...state.charts[action.payload.chartId].hourToHour,
                            fetchingData: false,
                            dataValid: 0,
                            fetchDataTriggered: false,
                            realTime: false,
                            selectedPeriods: [],
                            hourPeriodsData: {}
                        },
                    }
                }
            }
        case CLEAR_CORRECTNESS_STATE:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        yearToYear: {
                            ...state.charts[action.payload.chartId].yearToYear,
                            dataValid: 0
                        },
                        dayToDay: {
                            ...state.charts[action.payload.chartId].dayToDay,
                            dataValid: 0
                        },
                        hourToHour: {
                            ...state.charts[action.payload.chartId].hourToHour,
                            dataValid: 0
                        }
                    }
                }
            }
        case ADD_YEAR_SERIE:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        yearToYear: {
                            ...state.charts[action.payload.chartId].yearToYear,
                            yearsData:  Object.assign({}, state.charts[action.payload.chartId].yearToYear.yearsData, action.payload.dataObject)
                        }
                    }
                }
            }
        case SET_Y2Y_CHART_INTERVAL_START:
            console.log("redux interval start y2y")
            console.log(action.payload.intervalStart)
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        yearToYear: {
                            ...state.charts[action.payload.chartId].yearToYear,
                            selectedInterval: {
                                ...state.charts[action.payload.chartId].yearToYear.selectedInterval,
                                start: action.payload.intervalStart
                            },
                            fetchDataTriggered: false,
                            dataValid: 0
                        }
                    }
                }
            }
        case SET_Y2Y_CHART_INTERVAL_END:
            console.log("redux interval end y2y")
            console.log(action.payload.intervalEnd)
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        yearToYear: {
                            ...state.charts[action.payload.chartId].yearToYear,
                            selectedInterval: {
                                ...state.charts[action.payload.chartId].yearToYear.selectedInterval,
                                end: action.payload.intervalEnd
                            },
                            fetchDataTriggered: false,
                            dataValid: 0
                        }
                    }
                }
            }
        case ADD_YEAR_DATA:
            let yearKey = Object.keys(action.payload.yearData)[0]
            let yearData = Object.values(action.payload.yearData)[0]
            console.log(yearKey)
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        yearToYear: {
                            ...state.charts[action.payload.chartId].yearToYear,
                            yearsData: {
                                ...state.charts[action.payload.chartId].yearToYear.yearsData, 
                                [yearKey]: [...state.charts[action.payload.chartId].yearToYear.yearsData[yearKey], yearData[0]]
                            }
                        }
                    }
                }
            }
        case UPDATE_YEARS_TO_COMPARE:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        yearToYear: {
                            ...state.charts[action.payload.chartId].yearToYear,
                            selectedYears: action.payload.updatedYearsArray,
                            fetchDataTriggered: false,
                            dataValid: 0
                        }
                    }
                }
            }
        case CHECK_YEAR_DATA_CORRECTNESS:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        yearToYear: {
                            ...state.charts[action.payload.chartId].yearToYear,
                            dataValid: yearDataErrorMessages(state, action.payload.chartId).length === 0 ? 1 : -1,
                            errorMessages: yearDataErrorMessages(state, action.payload.chartId)
                        }
                    }
                }
            }
        case TOGGLE_YEAR_CHART_REAL_TIME:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        yearToYear: {
                            ...state.charts[action.payload.chartId].yearToYear,
                            realTime: !state.charts[action.payload.chartId].yearToYear.realTime
                        }
                    }
                }
            }
        case CHANGE_SELECTED_DAYS:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        dayToDay: {
                            ...state.charts[action.payload.chartId].dayToDay,
                            dataValid: 0,
                            fetchDataTriggered: false,
                            selectedDays: action.payload.daysArray,
                        }
                    }
                }
            }
        case ADD_DAY_SERIE:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        dayToDay: {
                            ...state.charts[action.payload.chartId].dayToDay,
                            daysData: {
                                ...state.charts[action.payload.chartId].dayToDay.daysData,
                                ...action.payload.dataObject
                            }
                        }
                    }
                }
            }
        case SET_D2D_CHART_START_TIME:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        dayToDay: {
                            ...state.charts[action.payload.chartId].dayToDay,
                            dataValid: 0,
                            selectedInterval: {
                                ...state.charts[action.payload.chartId].dayToDay.selectedInterval,
                                start: action.payload.startTime
                            }
                        }
                    }
                }
            }
        case SET_D2D_CHART_END_TIME:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        dayToDay: {
                            ...state.charts[action.payload.chartId].dayToDay,
                            dataValid: 0,
                            fetchDataTriggered: false,
                            selectedInterval: {
                                ...state.charts[action.payload.chartId].dayToDay.selectedInterval,
                                end: action.payload.endTime
                            }
                        }
                    }
                }
            }
        case ADD_DAY_DATA:
            let dayKey = Object.keys(action.payload.dayData)[0]
            let dayData = Object.values(action.payload.dayData)[0]
            console.log(dayKey)
            if(!dayKey || !dayData) {
                return {
                    ...state
                }
            } else {
                return {
                    ...state,
                    charts: {
                        ...state.charts,
                        [action.payload.chartId]: {
                            ...state.charts[action.payload.chartId],
                            dayToDay: {
                                ...state.charts[action.payload.chartId].dayToDay,
                                daysData: {
                                    ...state.charts[action.payload.chartId].dayToDay.daysData, 
                                    [dayKey]: [...state.charts[action.payload.chartId].dayToDay.daysData[dayKey], dayData[0]]
                                }
                            }
                        }
                    }
                }
            }
        case CHECK_DAY_DATA_CORRECTNESS:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        dayToDay: {
                            ...state.charts[action.payload.chartId].dayToDay,
                            dataValid: dayDataErrorMessages(state, action.payload.chartId).length === 0 ? 1 : -1,
                            errorMessages: dayDataErrorMessages(state, action.payload.chartId)
                        }
                    }
                }
            }
        case TOGGLE_DAY_CHART_REAL_TIME:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        dayToDay: {
                            ...state.charts[action.payload.chartId].dayToDay,
                            realTime: !state.charts[action.payload.chartId].dayToDay.realTime
                        }
                    }
                }
            }
        case ADD_HOUR_PERIOD_SERIE:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        hourToHour: {
                            ...state.charts[action.payload.chartId].hourToHour,
                            hourPeriodsData: {
                                ...state.charts[action.payload.chartId].hourToHour.hourPeriodsData,
                                ...action.payload.dataObject
                            }
                        }
                    }
                }
            }
        case ADD_HOUR_PERIOD_DATA:
            let hourPeriodKey = Object.keys(action.payload.hourPeriodData)[0]
            let hourPeriodData = Object.values(action.payload.hourPeriodData)[0]
            console.log(hourPeriodKey)
            if(!hourPeriodKey || !hourPeriodData) {
                return {
                    ...state
                }
            } else {
                return {
                    ...state,
                    charts: {
                        ...state.charts,
                        [action.payload.chartId]: {
                            ...state.charts[action.payload.chartId],
                            hourToHour: {
                                ...state.charts[action.payload.chartId].hourToHour,
                                hourPeriodsData: {
                                    ...state.charts[action.payload.chartId].hourToHour.hourPeriodsData, 
                                    [hourPeriodKey]: [...state.charts[action.payload.chartId].hourToHour.hourPeriodsData[hourPeriodKey], hourPeriodData[0]]
                                }
                            }
                        }
                    }
                }
            }
        case ADD_NEW_DAY_OPTION:
            return {
                ...state,
                charts : {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        hourToHour: {
                            ...state.charts[action.payload.chartId].hourToHour,
                            selectedDays: [...state.charts[action.payload.chartId].hourToHour.selectedDays, 
                                action.payload.newDayOption],
                            dataValid: 0
                        }
                    }
                }
            }
        case REMOVE_DAY_OPTION:
            let updatedDaysAfterRemove = state.charts[action.payload.chartId].hourToHour.selectedDays.filter((dayAsDate) => {
                return dayAsDate.day() !== action.payload.dayOptionToRemove.day() || dayAsDate.month() !== action.payload.dayOptionToRemove.month() || dayAsDate.year() !== action.payload.dayOptionToRemove.year()
            })
            return {
                ...state,
                charts : {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        hourToHour: {
                            ...state.charts[action.payload.chartId].hourToHour,
                            selectedDays : updatedDaysAfterRemove,
                            dataValid: 0
                        }
                    }
                }
            }
        case ADD_DATETIME_PERIOD:
            let dateIntervalToAdd = {
                start: action.payload.datetimePeriodStart,
                end: action.payload.datetimePeriodEnd
            } as dateInterval
            return {
                ...state,
                charts : {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        hourToHour: {
                            ...state.charts[action.payload.chartId].hourToHour,
                            selectedPeriods: [...state.charts[action.payload.chartId].hourToHour.selectedPeriods, dateIntervalToAdd],
                            dataValid: 0,
                            fetchDataTriggered: false,
                        }
                    }
                }
            }
        case CLEAR_DATETIME_PERIODS:
            return {
                ...state,
                charts : {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        hourToHour: {
                            ...state.charts[action.payload.chartId].hourToHour,
                            selectedPeriods: [],
                            dataValid: 0,
                            fetchDataTriggered: false,
                        }
                    }
                }
            }
        case CHECK_HOUR_DATA_CORRECTNESS:
                return {
                    ...state,
                    charts: {
                        ...state.charts,
                        [action.payload.chartId]: {
                            ...state.charts[action.payload.chartId],
                            hourToHour: {
                                ...state.charts[action.payload.chartId].hourToHour,
                                dataValid: hourDataErrorMessages(state, action.payload.chartId).length === 0 ? 1 : -1,
                                errorMessages: hourDataErrorMessages(state, action.payload.chartId)
                            }
                        }
                    }
                }
        case TOGGLE_HOUR_CHART_REAL_TIME:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.payload.chartId]: {
                        ...state.charts[action.payload.chartId],
                        hourToHour: {
                            ...state.charts[action.payload.chartId].hourToHour,
                            realTime: !state.charts[action.payload.chartId].hourToHour.realTime
                        }
                    }
                }
            }
        default:
            return state
      }
}