import axios from "axios";
const credentials = require('./google-search.json');
const instance = axios.create({
    baseURL:`https://serpapi.com/`,
})

export default instance;