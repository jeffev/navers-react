import axios from "axios";

const API_URL = "https://navedex-api.herokuapp.com/v1/";

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "users/login?", {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(email, password) {
    return axios.post(API_URL + "users/signup", {
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user?true:false);
  }
}

export default new AuthService();
