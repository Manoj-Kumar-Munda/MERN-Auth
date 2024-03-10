import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";



const jwtInterceptor = axios.create({});

jwtInterceptor.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        console.log(error?.response.status)
        if(error?.response.status === 401 ) {
            await axios.post("/api/v1/user/refresh", {
                withCredentials: true,
            })
            .catch( (refrehTokenAPIError) => {
                return Promise.reject(refrehTokenAPIError);
            });
            return axios(error.config)
        }

        return Promise.reject(error);
    }
)

export default jwtInterceptor;