import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://83ad-103-108-33-110.ngrok-free.app",
  //change to your ngrok link for development after running server locally and run ngrok http 3000
});

/*
 note : 
 - localhost is not working in client side, so we need to use ngrok or any other tunneling service to expose our localhost to the internet (CORS issue)
- if you are using ngrok, make sure to use the https link, not http link
*/

export default axiosInstance;
