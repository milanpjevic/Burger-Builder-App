import axios from "axios";

const instance = axios.create({
    baseURL: "https://react-burgerbuilderapp-6195d.firebaseio.com/"
})

export default instance