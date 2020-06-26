import axios from 'axios';

const clienteAxios = axios.create({
   baseURL : 'http://localhost:5001'
});

export default clienteAxios;
