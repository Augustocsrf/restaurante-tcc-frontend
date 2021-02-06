import axios from 'axios';

export default axios.create({
    //baseURL: "https://augustotcc.com.br/server/",
    baseURL: "https://augustotcc.com.br/tc/api/",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});