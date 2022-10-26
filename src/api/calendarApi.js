import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { VITE_API_URL_DESARROLLO } = getEnvVariables()

const calendarApi = axios.create({
    baseURL: VITE_API_URL_DESARROLLO
    //baseURL: VITE_API_URL_PRODUCCION
});

// Todo: configurar interceptores
//Interceptar lo que viene en la request
calendarApi.interceptors.request.use(   config  =>  {
    
    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')
    }

    return config;
})

export default calendarApi;
