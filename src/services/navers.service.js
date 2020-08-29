import axios from 'axios';

class NaversService {
  constructor() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      axios.defaults.baseURL = 'https://navedex-api.herokuapp.com/v1/';
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  }

  getNavers() {
    return axios.get('navers')
  }
}

export default new NaversService();
