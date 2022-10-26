import { useEffect, useState } from 'react';

import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

//import { addHours } from 'date-fns';

import { 
    FabAddNew,
    FabDelete,
    CalendarEvent,
    CalendarModal,
    Navbar
  } from "../";

import { localizer , getMessagesES } from '../../helpers';
import { useUiStore , useCalendarStore, useAuthStore } from '../../hooks';


//------------------------------------------------->
export const CalendarPage = () => {

  const { user } = useAuthStore();

  const { openDateModal , closeDateModal } = useUiStore();
  const { events  , setActiveEvent , startLoadingEvents  } = useCalendarStore();
  const [ lastView  , setLastView ] = useState(localStorage.getItem('lastView')||'week');

  const eventStyleGetter = ( event , start , end , isSelected ) => {

      const isMyEvent = ( user.uid === event.user._id  ) || ( user.uid === event.user.uid );
      
      const style = {
        backgroundColor: isMyEvent ? '#347CF7' : '#465660',
        borderRadius: '0px',
        opacity: 0.8,
        color: 'white'
      }

      return {
        style
      }
  }

  const onDoubleClick = ( event ) => {    
    openDateModal();
  }

  //onSelect === click
  const onSelect = ( event ) => {
    setActiveEvent( event );
  }

  const onViewChanged = ( event ) => {
    localStorage.setItem('lastView',  event );
    setLastView(  event );
  }

  useEffect(() => {
    
    startLoadingEvents();

  }, []) //Arreglo vacio se dispara solo una vez
  


  return (
    <>
      <Navbar />

      <Calendar
        culture='es'
        localizer={localizer}
        events={events}
        defaultView={ lastView }
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc( 100vh - 80px )' }}
        messages={ getMessagesES() }
        eventPropGetter={ eventStyleGetter }
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={  onDoubleClick }
        onSelectEvent={ onSelect  } //Veamos este evento
        onView={  onViewChanged } //Este evento es distinto
      />

      <CalendarModal />
      <FabAddNew />
      <FabDelete />
    </>
  )
}
