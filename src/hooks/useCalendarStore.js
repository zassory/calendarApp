import { useSelector , useDispatch } from 'react-redux';
import  calendarApi  from '../api/calendarApi';
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from '../store';

export const useCalendarStore = () => {
  
    const dispatch = useDispatch();
    const { events , activeEvent } = useSelector( state => state.calendar );

    const   setActiveEvent  =   (    calendarEvent   ) =>    {
        dispatch(   onSetActiveEvent(   calendarEvent   )  );
    }

    const startSavingEvent = async( calendarEvent   ) => {
        // TODO: Update event        
        if( calendarEvent._id){
            // Actualizando
            dispatch(  onUpdateEvent(   {...calendarEvent}   ) );
        }else{
            
            const { data } = await calendarApi.post('/events', calendarEvent    );
            console.log(  {  data   }  );
            dispatch( onAddNewEvent({ ...calendarEvent, _id: new Date().getTime() }) );
        }

    }

    const startDeletingEvent = () => {

        // Todo: Llegar al backend
        dispatch(   onDeleteEvent() );
    }

    return {
        //*Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,
        //*Métodos
        startDeletingEvent,
        setActiveEvent,
        startSavingEvent,
    }
}
