import React, { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import dateFnsFormat from "date-fns/format"
import dateFnsParse from "date-fns/parse"

const parseDate = (str, format, locale) => {
  const parsed = dateFnsParse(str, format, new Date(), { locale })

  return DateUtils.isDate(parsed) ? parsed : null
}

const formatDate = (date, format, locale) => {
  dateFnsFormat(date, format, { locale })
}

const format = "dd MM yyyy"

let onDateChanges

const DateRangePicker = ({ datesChanged, bookedDates }) => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  onDateChanges = datesChanged(startDate)

  const bookedDates = bookedDates.map((date) => {
    return new Date(date)
  })
  return (
    <div className='date-range-picker-container'>
      <div>
        <label>From: </label>
        <DatePicker
          formatDate={formatDate}
          format={format}
          parseDate={parseDate}
          placeholderText={`${dateFnsFormat(startDate, format)}`}
          minDate={new Date()}
          onChange={(value) => {
            setStartDate(value)
            onDateChanges = datesChanged(value)
          }}
        />
      </div>
      <div>
        <label>To: </label>
        <DatePicker
          ormatDate={formatDate}
          format={format}
          parseDate={parseDate}
          placeholderText={`${dateFnsFormat(endDate, format)}`}
          minDate={new Date(startDate).setDate(new Date(startDate).getDate() + 1)}
          onChange={(value) => {
            setEndDate(value)
            onDateChanges(value)
          }}
        />
      </div>

      <style jsx>
        {`
          .date-range-picker-container div {
            display: grid;
            border: 1px solid #ddd;
            grid-template-columns: 30% 70%;
            padding: 10px;
          }

          label {
            padding-top: 10px;
          }
        `}
      </style>
      <style jsx global>
        {`
          .DatePicker input {
            width: 120px;
            padding: 10px;
            font-size: 16px;
          }
        `}
      </style>
    </div>
  )
}

export default DateRangePicker
