import dayjs, { Dayjs } from "dayjs"
import { dataEntry, dateInterval, Entry } from "../../store/charts"

export const createDataPoint = (time = Date.now(), magnitude = 1000, offset = 0) => {
    let date_a = time + offset * magnitude
    let date_b = Math.round((Math.random() * 100) * 2) / 2  
    return [
      date_a,
      date_b
    ]
  }

export const createRandomData = (time : number, magnitude : number, points = 100) => {
    const data = [] as number[][]
    let i = (points * (-1)) + 1
    for (i ; i <= 0; i++) {
      data.push(createDataPoint(time, magnitude, i))
    }
    return data
}

export const dayInWords = (dayOfMonth : string) => {
  let result = ""
  let lastDigit = dayOfMonth.substring(-1)
  switch (lastDigit) {
    case '0':
      result += "th"
      break
    case '1':
      result += "st"
      break
    case '2':
      result += "nd"
      break
    case '3':
      result += "rd"
      break
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      result += "th"
      break
    default:
      break
  }
  
  return dayOfMonth + result
}

export const monthNoToName = (monthNo : string) => {
  let monthName = ""
  switch (monthNo) {
    case '00':
      monthName = "January"
      break
    case '01':
      monthName = "February"
      break
    case '02':
      monthName = "March"
      break
    case '03':
      monthName = "April"
      break
    case '04':
      monthName = "May"
      break
    case '05':
      monthName = "June"
      break 
    case '06':
      monthName = "July"
      break
    case '07':
      monthName = "August"
      break
    case '08':
      monthName = "September"
      break
    case '09':
      monthName = "October"
      break
    case '10':
      monthName = "November"
      break
    case '11':
      monthName = "December"
      break
    default:
      break
  }

  return monthName
}

const sameNumbers = (numb1 : number, numb2 : number) => numb1 === numb2

//1 means that dates are same (year, month, day, hours, minutes) - true if same, false if different 
export const compareTwoDates = (date1 : Dayjs, date2 : Dayjs) => {
  return sameNumbers(date1.year(), date2.year()) && sameNumbers(date1.month(), date2.month()) 
      && sameNumbers(date1.date(), date2.date()) && sameNumbers(date1.hour(), date2.hour()) 
      && sameNumbers(date1.minute(), date2.minute())
}

export const padTo2Digits = (num : number) => {
  return num.toString().padStart(2, "0")
}

export const dayjsDayToDateString = (day : Dayjs) => {
  return day.format("DD/MM/YYYY")
}

export const dayDateStringSeries = (days: Dayjs[]) => {
  return days.map((day) => dayjsDayToDateString(day))
}

export const dayjsDayToTimeString = (day : Dayjs) => {
  return day.format("HH:mm")
}

export const periodLabel = (period : dateInterval) => {
  let { start, end} = period
  if(start && end) {
      return dayjsDayToDateString(start) + " - " + dayjsDayToTimeString(start) + " to " + dayjsDayToTimeString(end)
  } else {
      return "D0/M0/Y0 - H0:M0 - H1:M1"
  }
}

export const hourSeriesLabels = (periods : dateInterval[]) => {
  return periods.map((period) => {
    return periodLabel(period)
  })
}

// subtract hour to get request proper params (params in utc 0 format)
export const stringParamFetchDay = (day: Dayjs, hourInterval: Dayjs) => {

  let dayWithHour = dayjs(day)
  dayWithHour = dayWithHour.set("hour", hourInterval.get("hour"))
  dayWithHour = dayWithHour.subtract(1, "hour")
  dayWithHour = dayWithHour.set("minute", hourInterval.get("minute"))
  dayWithHour = dayWithHour.set("second", 0)
  const datePart = [padTo2Digits(dayWithHour.get("year")), padTo2Digits(dayWithHour.get("month") + 1), padTo2Digits(dayWithHour.get("date"))].join("-")
  const timePart = [padTo2Digits(dayWithHour.get("hour")), padTo2Digits(dayWithHour.get("minute")), padTo2Digits(dayWithHour.get("second"))].join(":")
  return datePart + " "
    + timePart
}

export const dateFromDayAndInterval = (day: Dayjs, interval: Dayjs) => {
  let dayWithHour = dayjs(day)
  dayWithHour = dayWithHour.set("hour", interval.get("hour"))
  dayWithHour = dayWithHour.set("minute", interval.get("minute"))
  return dayWithHour
}

export const stringParamFromDayjs = (periodBound : Dayjs) => {
  const datePart = [padTo2Digits(periodBound.get("year")), padTo2Digits(periodBound.month() + 1), padTo2Digits(periodBound.date())].join("-")
  const timePart = [padTo2Digits(periodBound.hour()), padTo2Digits(periodBound.minute()), padTo2Digits(periodBound.second())].join(":")
  return datePart + " "
    + timePart
}

export const stringParamFetchYearIntervalBound = (year: string, date: Dayjs) => {
  let dateCorrected = date.subtract(1, "hour")
  const datePart = [year, padTo2Digits(dateCorrected.month() + 1), padTo2Digits(dateCorrected.date())].join("-")
  const timePart = [padTo2Digits(dateCorrected.hour()), padTo2Digits(dateCorrected.minute()), padTo2Digits(dateCorrected.second())].join(":")
  return datePart + " "
    + timePart
}

const TIME_ZONE_POLAND = 1
const BASE_YEAR = 2023

export interface periodData {
  [key: string]: dataEntry[]
}

export const convertDateFromUTC0ToLocalTimeZone = (date: Date, timeZone = TIME_ZONE_POLAND) => {
  let hours = date.getHours()
  let hoursCorrected = hours// + 1
  let dayOfMonth = date.getDate()
  let dayOfMonthCorrected = dayOfMonth
  let month = date.getMonth()
  let monthCorrected = month
  let year = date.getFullYear()
  let yearCorrected = year

  return { yearCorrected, monthCorrected, dayOfMonthCorrected, hoursCorrected }
}

export const labelWithData = (label: string, entries : Entry[], fieldNo: number) : periodData => {

  let dates = entries.map((entry: Entry) => { return entry["created_at"] })

  let entryFieldKey = ("field" + fieldNo) as keyof Entry

  let values = entries.map((entry: Entry) => {
    let entryValue = entry[entryFieldKey]
    if (entryValue) {
      return parseFloat(entryValue)
    } else {
      return null
    }
  })

  let datesParsed = [] as number[]
  if (dates.length > 0 && values.length > 0) {
    datesParsed = dates.map((dateStr, index) => {
      let date = new Date(dateStr)
      let dateDayJS = dayjs(date)
      dateDayJS = dateDayJS.set("year", BASE_YEAR)
      return dateDayJS.valueOf()
    })


    let dataToSet: dataEntry[] = datesParsed.map((dateParsed, index) => {
      return [datesParsed[index], values[index]]
    })

    return {
      [label]: dataToSet
    }
  } else {
    return {
      [label]: []
    }
  }
}

export const dataAverage = (data : number[]) => {
  return data.length ? (data.reduce((prevValue, currentValue) => {
    return prevValue + currentValue
  }, 0) / data.length) : "NO DATA"
}

export const dataMedian = (data : number[]) => {
  if (data.length === 0) {
    return "NO DATA"
  }
  
  data.sort((a, b) => a - b)
  const midpoint = Math.floor(data.length / 2)
  const median = data.length % 2 === 1 ? data[midpoint] : (data[midpoint - 1] + data[midpoint]) / 2
  
  return median
}

export const dataVariance  = (data : number[]) => {
  
  let probeCount = data.length
  
  if(!probeCount){
     return "NO DATA"
  }
  const dataAvg = dataAverage(data)
  if(dataAvg === "NO DATA") {
    return "NO DATA"
  } else {
    let variance = 0
    data.forEach(num => {
       variance += ((num - dataAvg) * (num - dataAvg))
    })
    variance /= probeCount
    return variance
  }
}

export const dataStdDev  = (data : number[]) => {
  
  let probeCount = data.length
  
  const dataAvg = dataAverage(data)
  if(dataAvg === "NO DATA") {
    return "NO DATA"
  } else {
    let variance = 0
    data.forEach(num => {
       variance += ((num - dataAvg) * (num - dataAvg))
    })
    variance /= probeCount
    return Math.sqrt(variance)
  }
}


//export const dataStdDev = (data : number[]) => dataAverage(data) === "NO DATA" ? "NO DATA" : Math.sqrt(dataVariance(data))

export const dataMinimum = (data : number[]) => data.length ? Math.min(...data) : "NO DATA"

export const dataMaximum = (data : number[]) => data.length ? Math.max(...data) : "NO DATA"

export const dataAmplitude = (data : number[]) => data.length ? (Math.max(...data) - Math.min(...data)) : "NO DATA"

