import axios from "axios"

const axiosInstance = axios.create({
    baseURL: 'https://03g78kzk-3000.asse.devtunnels.ms/'
})

/*
 note : 
 - localhost is not working in client side, so we need to use ngrok or any other tunneling service to expose our localhost to the internet (CORS issue)
- if you are using ngrok, make sure to use the https link, not http link
*/

export default axiosInstance