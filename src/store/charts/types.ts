import { faDroplet, faDumpsterFire, faPersonWalking, faSun, faTemperatureHalf, faWind, IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { AxiosResponse } from "axios"
import dayjs, { Dayjs } from "dayjs"
import { periodData } from "../../components/utils/data-helpers"


export type chartTypes = "Year to year" | "Day to day" | "Hour to hour"

export interface fieldProps {
    name: string,
    description: string,
    abbreviation: string,
    fasIcon: IconDefinition
}

export const fieldsAvailable : fieldProps[] = [
    {
        name: "DHT22_temperature", 
        description: "DHT22 temperature",
        abbreviation: "DHT22",
        fasIcon: faTemperatureHalf
    }, 
    {
        name: "DHT22_relativeHumidity",
        description: "DHT22 relative humidity",
        abbreviation: "DHT22",
        fasIcon: faDroplet
    },
    {
        name: "BH1750_lightIntensity",
        description: "BH1750 light intensity",
        abbreviation: "BH1750",
        fasIcon: faSun
    },
    {
        name: "BMP180_airPressure",
        description: "BMP180 air pressure",
        abbreviation: "BMP180",
        fasIcon: faWind
    },
    {
        name: "DS18B20_heaterTemperature",
        description: "DS18B20 heater temperature",
        abbreviation: "DS18B20",
        fasIcon: faDumpsterFire
    },
    {
        name: "DS18B20_temperature",
        description: "DS18B20 temperature",
        abbreviation: "DS18B20",
        fasIcon: faTemperatureHalf
    },
    {
        name: "MoveIndicator",
        description: "Move indicator",
        abbreviation: "MOVE",
        fasIcon: faPersonWalking
    }, 
    {
        name: "BMP180_temperature",
        description: "BMP180 temperature",
        abbreviation: "BMP180",
        fasIcon: faTemperatureHalf
    }
]

export type dataSources = "DHT22_temperature" | "DHT22_relativeHumidity" | "BH1750_lightIntensity" | "BMP180_airPressure" |
"DS18B20_heaterTemperature" | "DS18B20_temperature" | "MoveIndicator" | "BMP180_temperature"

export const AllChartTypesEmptyProps = {
    yearToYear: {    
        selectedInterval: {
            start: dayjs(),
            end: dayjs()
        },
        selectedYears: [] as string[],
        yearsData: {},
        nullResolvingMethod: "connect",
        fetchDataTriggered: false,
        dataValid: 0,
        errorMessages: [] as string[],
        realTime: false,
        fetchingData: false
    },
    dayToDay: {
        selectedInterval: {
            start: dayjs(),
            end: dayjs()
        },
        selectedDays: [],
        daysData: {},
        nullResolvingMethod: "connect",
        fetchDataTriggered: false,
        dataValid: 0,
        errorMessages: [] as string[],
        realTime: false,
        fetchingData: false
    },
    hourToHour: {
        selectedDays: [],
        selectedPeriods: [],
        hourPeriodsData: {},
        nullResolvingMethod: "connect",
        fetchDataTriggered: false,
        dataValid: 0,
        errorMessages: [] as string[],
        realTime: false,
        fetchingData: false
    }
}


export const returnFieldDescription = (fieldName : string) => {
    let fieldWithNameDescription = fieldsAvailable.filter((fieldProps) => {
        return (fieldProps.name === fieldName)
    })
    return fieldWithNameDescription.length === 1 ? fieldWithNameDescription[0].description : "NO DESCRIPTION AVAILABLE"
}

export const initialChart = {
    chartTypeSelected: "Year to year",
    chartDataSource: "DHT22_temperature",
    ...AllChartTypesEmptyProps
}

export type chartProps = {
    chartTypeSelected: chartTypes,
    chartDataSource: dataSources,
    yearToYear: yearToYearProps,
    dayToDay: dayToDayProps,
    hourToHour: hourToHourProps
}

export interface dateInterval {
    start: Dayjs,
    end: Dayjs
}

export type fieldValue = null | string

export type dataEntry = [date: number, value: number | null]

export type dataEntryNoNulls = [date: number, value: number]

export type nullResolvingMethods = "connect" | "mean" | "dominant"

export interface XSeriesDataObject {
    [key: string]: dataEntry[]
}

export interface yearToYearProps {
    selectedInterval: dateInterval,
    selectedYears: string[],
    yearsData: XSeriesDataObject,
    nullResolvingMethod: string,
    fetchDataTriggered: boolean,
    dataValid: number,
    errorMessages: string[],
    realTime: boolean,
    fetchingData: boolean
}

export interface dayToDayProps {
    selectedInterval: dateInterval,
    selectedDays: Dayjs[],
    dataValid: number,
    daysData: XSeriesDataObject,
    nullResolvingMethod: string,
    fetchDataTriggered: boolean,
    errorMessages: string[],
    realTime: boolean,
    fetchingData: boolean
}

export interface hourToHourProps {
    selectedDays: Dayjs[],
    selectedPeriods: dateInterval[],
    dataValid: number,
    hourPeriodsData: XSeriesDataObject,
    nullResolvingMethod: string,
    fetchDataTriggered: boolean,
    errorMessages: string[],
    realTime: boolean,
    fetchingData: boolean
}

export interface charts {
    [chartId : string]: chartProps
}

export interface ChartState {
    charts: charts
}

// all
export const START_REALTIME_FETCHING = "START_REALTIME_FETCHING"
export const TRIGGER_FETCH = "TRIGGER_FETCH"
export const ADD_NEW_CHART = "ADD_NEW_CHART"
export const REMOVE_EXISTING_CHART = "REMOVE_EXISTING_CHART"
export const CHANGE_CHART_TYPE = "CHANGE_CHART_TYPE"
export const CHANGE_CHART_DATA_SOURCE = "CHANGE_CHART_DATA_SOURCE"
export const CLEAR_CORRECTNESS_STATE = "CLEAR_CORRECTNESS_STATE"

// year to year
export const SET_Y2Y_CHART_INTERVAL_START = "SET_Y2Y_CHART_INTERVAL_START"
export const SET_Y2Y_CHART_INTERVAL_END = "SET_Y2Y_CHART_INTERVAL_END"
export const UPDATE_YEARS_TO_COMPARE = "UPDATE_YEARS_TO_COMPARE"
export const ADD_YEAR_DATA = "ADD_YEAR_DATA"

export const CHECK_YEAR_DATA_CORRECTNESS = "CHECK_YEAR_DATA_CORRECTNESS"
export const TOGGLE_YEAR_CHART_REAL_TIME = "TOGGLE_YEAR_CHART_REAL_TIME"
export const ADD_YEAR_SERIE = "ADD_YEAR_SERIE"

// day to day
export const CHANGE_SELECTED_DAYS = "CHANGE_SELECTED_DAYS"
export const SET_D2D_CHART_START_TIME = "SET_D2D_CHART_START_TIME"
export const SET_D2D_CHART_END_TIME = "SET_D2D_CHART_END_TIME"
export const ADD_DAY_DATA = "ADD_DAY_DATA"

export const CHECK_DAY_DATA_CORRECTNESS = "CHECK_DAY_DATA_CORRECTNESS"
export const TOGGLE_DAY_CHART_REAL_TIME = "TOGGLE_DAY_CHART_REAL_TIME"
export const ADD_DAY_SERIE = "ADD_DAY_SERIE"

// hour to hour
export const ADD_NEW_DAY_OPTION = "ADD_NEW_DAY_OPTION"
export const REMOVE_DAY_OPTION = "REMOVE_DAY_OPTION"
export const ADD_DATETIME_PERIOD = "ADD_DATETIME_PERIOD"
export const CLEAR_DATETIME_PERIODS = "CLEAR_DATETIME_PERIODS"
export const ADD_HOUR_PERIOD_DATA = "ADD_HOUR_PERIOD_DATA"

export const CHECK_HOUR_DATA_CORRECTNESS = "CHECK_HOUR_DATA_CORRETNESS"
export const TOGGLE_HOUR_CHART_REAL_TIME = "TOGGLE_HOUR_CHART_REAL_TIME"
export const ADD_HOUR_PERIOD_SERIE = "ADD_HOUR_PERIOD_SERIE"

interface TriggerFetch {
    type: typeof TRIGGER_FETCH,
    payload: {
        chartId: string
    }
}

interface StartRealtimeFetching {
    type: typeof START_REALTIME_FETCHING,
    payload: {
        chartId: string
    }
}

interface AddNewChart {
    type: typeof ADD_NEW_CHART,
    payload: {
        newId: string
    }
}

interface RemoveExistingChart {
    type: typeof REMOVE_EXISTING_CHART,
    payload: {
        chartId: string
    }
}

interface ChangeChartType {
    type: typeof CHANGE_CHART_TYPE,
    payload: {
        chartId: string,
        updatedType: chartTypes
    }
}

interface ChangeChartDataSource {
    type: typeof CHANGE_CHART_DATA_SOURCE,
    payload: {
        chartId: string,
        updatedDataSource: dataSources
    }
}

interface ClearCorrectnessState {
    type : typeof CLEAR_CORRECTNESS_STATE,
    payload: {
        chartId: string
    }
}

type chartActions = TriggerFetch | StartRealtimeFetching | AddNewChart | RemoveExistingChart | ChangeChartType 
| ChangeChartDataSource | ClearCorrectnessState

interface SetYearToYearChartIntervalStart {
    type: typeof SET_Y2Y_CHART_INTERVAL_START,
    payload: {
        chartId: string,
        intervalStart: Dayjs
    }
}

interface SetYearToYearChartIntervalEnd {
    type: typeof SET_Y2Y_CHART_INTERVAL_END,
    payload: {
        chartId: string,
        intervalEnd: Dayjs
    }
}

interface AddYearData {
    type: typeof ADD_YEAR_DATA,
    payload: {
        chartId: string,
        yearData: periodData
    }
}

interface UpdateYearsToCompare {
    type: typeof UPDATE_YEARS_TO_COMPARE,
    payload: {
        chartId: string,
        updatedYearsArray: string[]
    }
}

interface CheckYearDataCorrectness {
    type: typeof CHECK_YEAR_DATA_CORRECTNESS,
    payload: {
        chartId: string
    }
}

interface ToggleYearChartRealTime {
    type: typeof TOGGLE_YEAR_CHART_REAL_TIME,
    payload: {
        chartId: string
    }
}

interface AddYearSerie {
    type: typeof ADD_YEAR_SERIE,
    payload: {
        chartId: string,
        dataObject : periodData
    }
}

type yearToYearActions = SetYearToYearChartIntervalStart | SetYearToYearChartIntervalEnd | CheckYearDataCorrectness 
| AddYearData | UpdateYearsToCompare | ToggleYearChartRealTime | AddYearSerie

interface ChangeSelectedDaysD2D {
    type : typeof CHANGE_SELECTED_DAYS,
    payload: {
        chartId: string,
        daysArray: Dayjs[]
    }
}

interface SetDayToDayChartStartTime {
    type: typeof SET_D2D_CHART_START_TIME,
    payload: {
        chartId: string,
        startTime: Dayjs
    }
}

interface SetDayToDayChartEndTime {
    type: typeof SET_D2D_CHART_END_TIME,
    payload: {
        chartId: string,
        endTime: Dayjs
    }
}

interface AddDayData {
    type: typeof ADD_DAY_DATA,
    payload: {
        chartId: string,
        dayData: periodData
    }
}

interface CheckDayDataCorrectness {
    type: typeof CHECK_DAY_DATA_CORRECTNESS,
    payload: {
        chartId: string
    }
}

interface ToggleDayChartRealTime {
    type: typeof TOGGLE_DAY_CHART_REAL_TIME,
    payload: {
        chartId: string
    }
}

interface AddDaySerie {
    type: typeof ADD_DAY_SERIE,
    payload: {
        chartId: string,
        dataObject : periodData
    }
}

type dayToDayActions =  ChangeSelectedDaysD2D | SetDayToDayChartStartTime | SetDayToDayChartEndTime 
| AddDayData | CheckDayDataCorrectness | ToggleDayChartRealTime | AddDaySerie


interface AddNewDayOptionToChart {
    type: typeof ADD_NEW_DAY_OPTION,
    payload: {
        chartId: string,
        newDayOption: Dayjs
    }
}

interface RemomoveDayOptionFromChart {
    type: typeof REMOVE_DAY_OPTION,
    payload: {
        chartId: string,
        dayOptionToRemove: Dayjs
    }
}

interface AddDatetimePeriod {
    type : typeof ADD_DATETIME_PERIOD,
    payload: {
        chartId: string,
        datetimePeriodStart: Dayjs,
        datetimePeriodEnd: Dayjs
    }
}

interface ClearDatetimePeriods {
    type: typeof CLEAR_DATETIME_PERIODS,
    payload: {
        chartId: string
    }
}

interface AddHourPeriodData {
    type: typeof ADD_HOUR_PERIOD_DATA,
    payload: {
        chartId: string,
        hourPeriodData: periodData
    }
}

interface CheckHourDataCorrectness {
    type: typeof CHECK_HOUR_DATA_CORRECTNESS,
    payload: {
        chartId: string
    }
}

interface ToggleHourChartRealTime {
    type: typeof TOGGLE_HOUR_CHART_REAL_TIME,
    payload: {
        chartId: string
    }
}

interface AddHourPeriodSerie {
    type: typeof ADD_HOUR_PERIOD_SERIE,
    payload: {
        chartId: string,
        dataObject : periodData
    }
}

type hourToHourActions = AddNewDayOptionToChart | RemomoveDayOptionFromChart | AddDatetimePeriod 
    | ClearDatetimePeriods | AddHourPeriodData | CheckHourDataCorrectness | ToggleHourChartRealTime | AddHourPeriodSerie

export type ChartActionTypes = chartActions | hourToHourActions | dayToDayActions | yearToYearActions

export type resultsHandlerType = {
    propertyName: string;
    getLatestResults: () => Promise<AxiosResponse<any, any>>;
    getResultsBetweenDates: (startDate: string, endDate: string) => Promise<AxiosResponse<any, any>>;
    suffix: string;
    fieldNo: number;
} | null

export interface Entry {
    created_at: string,
    field1?: fieldValue,
    field2?: fieldValue,
    field3?: fieldValue,
    field4?: fieldValue,
    field5?: fieldValue,
    field6?: fieldValue,
    field7?: fieldValue,
    field8?: fieldValue,
    field9?: fieldValue
  }