let axios;
if (process.env.NODE_ENV === 'production') {
    axios = "https://gradifyae-672af6cabc6c.herokuapp.com/api"
} else {
    axios = "http://localhost:3001/api"
}
const axiosLink = axios
export default axiosLink