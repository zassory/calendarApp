import {useEffect,useMemo,useState} from 'react';
import Modal from 'react-modal'
;
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import {  addHours, differenceInSeconds  } from 'date-fns';

import DatePicker , { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import { useUiStore , useCalendarStore } from '../../hooks';

registerLocale('es',es);

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

Modal.setAppElement('#root');

const formData = {
    title:'',
    notes:'',
    start: new Date(),
    end: addHours( new Date(),2),
}

//------------------------------------------------->
export const CalendarModal = () => {

    const { isDateModalOpen , closeDateModal } = useUiStore();
    const { activeEvent , startSavingEvent }    =   useCalendarStore();
    
    const [formSubmitted,setFormSubmitted] = useState();
    const [formValues,setFormValues] = useState(formData);

    const titleClass = useMemo(() => {
        //Si el formulario no se ha disparado
        if(!formSubmitted) return '';//O sea si es falso no hace nada

        return ( formValues.title.length > 0 )
            ? ''
            : 'is-invalid'
        
        //Este valor se va a memorizar solo si el formValues o el formSubmitted cambia
    }, [    formValues.title    ,   formSubmitted   ]);

    useEffect(() => {
      if(   activeEvent !== null){
        setFormValues({ ...activeEvent   });
      }
    }, [    activeEvent ]);
    

    const onInputchanged = ({ target }) => {
        setFormValues({
            ...formValues,//Solo sobreescribir el valor del que
            //tenga el target
            [target.name]: target.value
        })
    }

    const onDateChanged = ( event , changing  ) => {
        setFormValues({
            ...formValues,
            [changing]:event
        })
    }

    const onCloseModal = () => {
        closeDateModal();
    }

    const onSubmit = async(event) => {
        event.preventDefault();
        setFormSubmitted(   true    );

        const difference = differenceInSeconds( formValues.end, formValues.start );

        if( isNaN(  difference  ) || difference <= 0  ){
            Swal.fire('Fechas incorrectas','Revisar las fechas ingresadas','error');
            return;
        }

        if(formValues.title.length <= 0) return;        

        //TODO:
        await startSavingEvent(   formValues  );
        console.log( "El formValues es: !!!!!!!", formValues  );
        closeDateModal();
        setFormSubmitted(false);
        //Cerrar modal
        // Remover errores en pantalla
    }

  return (
    <Modal
        isOpen={ isDateModalOpen }
        onRequestClose={ onCloseModal }
        style={ customStyles }
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={ 200 }
    >
        <h1> Nuevo evento </h1>
        <hr />
        <form className="container" onSubmit={ onSubmit }>

        <div className="form-group mb-2">
            <label>Fecha y hora inicio</label>
            <DatePicker 
                selected={ formValues.start }
                onChange={ (event) => onDateChanged(event,'start') }
                className="form-control"
                dateFormat="Pp"
                showTimeSelect
                locale="es"
                timeCaption="hora"
            />
        </div>

        <div className="form-group mb-2">
            <label>Fecha y hora fin</label>
            <DatePicker
                minDate={ formValues.start }
                selected={ formValues.end }
                onChange={ (event) => onDateChanged(event,'end') }
                dateFormat="Pp"
                showTimeSelect
                locale="es"
                timeCaption="hora"
            />
        </div>

        <hr />
        <div className="form-group mb-2">
            <label>Titulo y notas</label>
            <input 
                type="text" 
                className={ `form-control ${    titleClass  }` }
                placeholder="Título del evento"
                name="title"
                autoComplete="off"
                value={ formValues.title }
                onChange={ onInputchanged }
            />
            <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
        </div>

        <div className="form-group mb-2">
            <textarea 
                type="text" 
                className="form-control"
                placeholder="Notas"
                rows="5"
                name="notes"
                value={ formValues.notes }
                onChange={ onInputchanged }
            ></textarea>
            <small id="emailHelp" className="form-text text-muted">Información adicional</small>
        </div>

        <button
            type="submit"
            className="btn btn-outline-primary btn-block"
        >
            <i className="far fa-save"></i>
            <span> Guardar</span>
        </button>

        </form>

    </Modal>
  )
}
