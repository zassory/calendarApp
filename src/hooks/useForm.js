import { useEffect, useMemo, useState } from 'react';


//Condicion , debe inicializarse afuera
export const useForm = ( initialForm = {} , formValidations = {} ) => {

    const [formState, setFormState] = useState( initialForm );
    const [formValidation,setFormValidation] = useState({});

    //Cada vez que el formState cambia llamo al createValidators
    useEffect(() => {
        createValidators();
    }, [formState]);

    useEffect(() => {
      setFormState( initialForm );//Si el formulario inicial Cambia se vuelve a llamar esto
    }, [initialForm]);
    

    const isFormValid = useMemo( () => {

        for (const formValue of Object.keys( formValidation )) {
            if( formValidation[formValue] !== null ) return false;
            //Si es distinto a null se termina y el formulario
            //ya no es null
        }

        return true;
    }, [formValidation]);
    

    const onInputChange = ({ target }) => {
        const { name , value } = target;
        setFormState({
            ...formState,
            //A todos los name ponle el value, pa no tener que 
            //hacer el uno a uno
            [ name ]: value
        });
    }

    const onResetForm = () => {
        setFormState( initialForm );
    }

    //Este es llamado por mi useEffect
    const createValidators = () => {
        const formCheckedValues = {};
        
        for (const formField of Object.keys( formValidations )) {            
            const [ fn, errorMessage ] = formValidations[formField];
            
            //computada significa que lo hace de forma dinamica 
            formCheckedValues[`${ formField }Valid`] = fn( formState[formField] ) ? null : errorMessage;
        }
        
        setFormValidation( formCheckedValues );        
    }

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,

        ...formValidation,
        isFormValid,
    }

}
