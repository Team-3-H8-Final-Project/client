import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://bd9b-110-138-88-81.ngrok-free.app",
  //change to your ngrok link for development after running server locally and run ngrok http 3000
});

/*
 note : 
 - localhost is not working in client side, so we need to use ngrok or any other tunneling service to expose our localhost to the internet (CORS issue)
- if you are using ngrok, make sure to use the https link, not http link
*/

export default axiosInstance;
