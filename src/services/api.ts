import axios from "axios";

const instance = axios.create({
    baseURL:"https://parallelum.com.br/fipe/api/v1",
})

export default instance;