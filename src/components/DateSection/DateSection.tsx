// react
import React, { useState } from "react"
import { Button } from "react-bootstrap"

// subcomponents
import DateTimePicker from "../DatePicker/DateTimePicker"

// styles
import "./dateSection.css"

interface DateSectionProps {
    passDatesToParent: (startDate: Date, endDate: Date) => void
}

const DateSection : React.FC<DateSectionProps> = ({passDatesToParent}) => {

  const [startDate, setStartDate] = useState<Date>(new Date("November 23, 2022 22:00:00"))

  const [endDate, setEndDate] = useState<Date>(new Date("November 23, 2022 22:20:00"))
  
  const parseAndSetStartDate = (sDate : Date) => {
    setStartDate(sDate)
  }

  const parseAndSetEndDate = (endDate : Date) => {
    setEndDate(endDate)
  }

  return (
    <section
      className={"date-section"}
    >
      <div className="date-picker-with-header">
        <h2>Start Date:</h2>
        <DateTimePicker setDateCallback={parseAndSetStartDate}/>
      </div>
      <div className="date-picker-with-header">
        <h2>End Date:</h2>
        <DateTimePicker setDateCallback={parseAndSetEndDate}/>
      </div>
      <Button onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => passDatesToParent(startDate, endDate)} className={"apply-dates-btn"} variant="primary">Apply!</Button>
    </section>
  )
}

export default DateSection