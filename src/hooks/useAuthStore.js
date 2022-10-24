import {  useDispatch   ,   useSelector  } from 'react-redux';
import calendarApi from '../api/calendarApi';

import {  
    onChecking ,     
    onLogin , 
    onLogout , 
    clearErrorMessage ,
        } from '../store';

export const useAuthStore = () => {


    const { status , user , errorMessage } = useSelector( state => state.auth  );
    const dispatch = useDispatch();    

    //Recibe un objeto
    const startLogin = async({ email , password }) => {        

        dispatch( onChecking() );
        try{
            
            const { data } = await calendarApi.post('/auth',{ email , password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({  name: data.name , uid: data.uid  }) );

        }catch(error){
            dispatch(  onLogout('Credentials Wrongs') );
            setTimeout(()=> {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }

    const startRegister = async({ name , email , password }) => {
        dispatch(  onChecking() );
        try{            
            const { data } = await calendarApi.post('/auth/new', { email , name , password });
            localStorage.setItem('token',data.token);
            localStorage.setItem('token-init-date', new Date().getTime() );

            dispatch(  onLogin({ name:data.name , uid:data.uid }) );
        
        }catch({ response }){            
            const { data } = response;            
            dispatch( onLogout(data?.msg || '--') );
            setTimeout(()=> {
                dispatch( clearErrorMessage() );
            },10)
        }
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if(!token) return dispatch(  onLogout()  );

        try{
            const {  data  } = await calendarApi.get('auth/renew');//Obtengo la respuesta
            localStorage.setItem('token',data.token);
            localStorage.setItem('token-init-date', new Date().getTime()  );
            dispatch(  onLogin({ name: data.name, uid: data.uid }) );
        }catch(error){
            localStorage.clear();
            dispatch(  onLogout() );
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogout()  );
    }
   
    return {
        //* Properties
        errorMessage,
        status,
        user,

        //*Métodos
        checkAuthToken,
        startLogin,
        startRegister,
        startLogout,
    }
}