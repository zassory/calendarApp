import { useSelector , useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import {  calendarApi  }  from '../api';
import { convertEventsToDateEvents } from '../helpers';
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store';

export const useCalendarStore = () => {
  
    const dispatch = useDispatch();
    const { events , activeEvent } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth  );

    const   setActiveEvent  =   (    calendarEvent   ) =>    {
        dispatch(   onSetActiveEvent(   calendarEvent   )  );
    }

    const startSavingEvent = async( calendarEvent   ) => {
        
        // TODO: Update event        
        if( calendarEvent._id){
            // Actualizando
            dispatch(  onUpdateEvent(   {...calendarEvent}   ) );
        }else{            
            
            const { data } = await calendarApi.post('/events',calendarEvent);
            console.log("La data que viene es:    ", data);
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.event.id , user }) );
        }

    }

    const startDeletingEvent = () => {

        // Todo: Llegar al backend
        dispatch(   onDeleteEvent() );
    }

    const startLoadingEvents = async() => {
        try{

            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents(  data.events );
            dispatch( onLoadEvents(  events  )  );
            console.log(events);

        }catch(error){
            console.log('Error cargando eventos');
            console.log(error);
        }
    }

    return {
        //*Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,
        //*Métodos
        startDeletingEvent,
        setActiveEvent,
        startLoadingEvents,
        startSavingEvent,
    }
}
