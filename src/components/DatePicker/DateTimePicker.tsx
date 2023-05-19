import {setHours, setMinutes} from "date-fns"
import React from "react"

import { SetStateAction, useEffect, useState } from "react"

import DatePicker from "react-datepicker"

interface DateTimePickerProps {
    setDateCallback: (date: Date) => void
}

const DateTimePicker : React.FC<DateTimePickerProps> = ({setDateCallback}) => {
    const [date, setDate] = useState<Date | null>(
        new Date("November 23, 2022 22:00:00")
    )

    useEffect(() => {
        if(date) {
            setDateCallback(date)
        }
    }, [date])

      return (
        <DatePicker
          selected={date}
          onChange={(updatedDate : Date | null, event : SetStateAction<any> | undefined) => setDate(updatedDate)}
          showTimeSelect
          timeFormat="HH:mm"
          injectTimes={[
            setHours(setMinutes(new Date(), 1), 0),
            setHours(setMinutes(new Date(), 5), 12),
            setHours(setMinutes(new Date(), 59), 23),
          ]}
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      );
}

export default DateTimePicker