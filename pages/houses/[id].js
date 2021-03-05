import React, { useState } from "react"
import fetch from "isomorphic-unfetch"
import axios from "axios"
import Head from "next/head"
import { useStoreActions, useStoreState } from "easy-peasy"
import Layout from "../../components/Layout"
import DateRangePicker from "../../components/DateRangePicker"

const calculateNumberOfNightsBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  let dayCount = 0

  while (end > start) {
    dayCount++
    start.setDate(start.getDate() + 1)
  }

  console.log("Day count", dayCount)

  return dayCount
}

const getBookedDates = async (houseId) => {
  try {
    const response = await axios.post("http://localhost:3000/api/houses/booked", { houseId })

    if (response.data.status === "error") {
      alert(response.data.message)
      return
    }

    return response.data.dates
  } catch (error) {
    console.log(error)
    return
  }
}

const House = (props) => {
  const [dateChosen, setDateChosen] = useState(false)
  const [numberOfNightsBetweenDates, setNumberOfNightsBetweenDates] = useState(0)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const setShowLoginModal = useStoreActions((actions) => actions.modals.setShowLoginModal)
  const user = useStoreState((state) => state.user.user)

  return (
    <Layout
      content={
        <div className='container'>
          <Head>
            <title>{props.house.title}</title>
          </Head>
          <article>
            <img src={props.house.picture} width='100%' alt='House picture' />
            <p>
              {props.house.type} - {props.house.town}
            </p>
            <p>{props.house.title}</p>
            {props.house.reviewsCount ? (
              <div className='reviews'>
                <h3>{props.house.reviewsCount} Reviews</h3>

                {props.house.reviews.map((review, index) => {
                  return (
                    <div key={index}>
                      <p>{new Date(review.createdAt).toDateString()}</p>
                      <p>{review.comment}</p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <></>
            )}
            {dateChosen && (
              <div>
                <h2>Price per night</h2>
                <p>${props.house.price}</p>
                <h2>Total price for booking</h2>
                <p>${(numberOfNightsBetweenDates * props.house.price).toFixed(2)}</p>
                {user ? (
                  <button
                    className='reserve'
                    onClick={async () => {
                      try {
                        const response = await axios.post("/api/houses/reserve", {
                          houseId: props.house.id,
                          startDate,
                          endDate,
                        })

                        if (response.data.status === "error") {
                          alert(response.data.message)
                          return
                        }

                        console.log(response.data)
                      } catch (err) {
                        console.log(err)
                        return
                      }
                    }}>
                    Reserve
                  </button>
                ) : (
                  <button
                    className='reserve'
                    onClick={() => {
                      setShowLoginModal()
                    }}>
                    Log in to Reserve
                  </button>
                )}
              </div>
            )}
          </article>
          <aside>
            <h2>Add dates for prices</h2>
            <DateRangePicker
              datesChanged={(startDate) => {
                return (endDate) => {
                  setNumberOfNightsBetweenDates(
                    calculateNumberOfNightsBetweenDates(startDate, endDate)
                  )
                  setDateChosen(true)
                  setStartDate(startDate)
                  setEndDate(endDate)
                  return
                }
              }}
              bookedDates={props.bookedDates}
            />
          </aside>

          <style jsx>
            {`
              .container {
                display: grid;
                grid-template-columns: 60% 40%;
                grid-gap: 30px;
              }

              aside {
                border: 1px solid #ccc;
                padding: 20px;
              }

              button {
                background-color: rgb(255, 90, 95);
                color: white;
                font-size: 13px;
                width: 100%;
                border: none;
                height: 40px;
                border-radius: 4px;
                cursor: pointer;
              }
            `}
          </style>
        </div>
      }
    />
  )
}

House.getInitialProps = async ({ query }) => {
  const { id } = query

  const res = await fetch(`http://localhost:3000/api/houses/${id}`)
  const house = await res.json()

  const bookedDates = getBookedDates(id)

  return {
    house,
    bookedDates,
  }
}

export default House
