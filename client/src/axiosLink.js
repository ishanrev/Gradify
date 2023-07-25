let axios;
if (process.env.NODE_ENV === 'production') {
    axios = "https://gradifyae.herokuapp.com/api"
} else {
    axios = "http://localhost:3001/api"
}
const axiosLink = axios
export default axiosLink