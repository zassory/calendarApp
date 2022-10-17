import React from 'react'

export const CalendarEvent = React.memo(({ event }) => {

    const { title , user } = event;    

  return (
    <>
        <strong>{ title }</strong>
        <span> - { user.name }</span>
    </>
  )
})


