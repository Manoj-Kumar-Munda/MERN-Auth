import axios from "axios";

export const jwtInterceptor = axios.create({});

jwtInterceptor.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log(error)
        if(error.status === 500){
            await axios.post("http://localhost:4000/refresh", {
                withCredentials:true
            })
            .catch( (err) => {
                return Promise.reject(err);
            });
            return axios(error.config)
        }
        return Promise.reject(error);
    }
)