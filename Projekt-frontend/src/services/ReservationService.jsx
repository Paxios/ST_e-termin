import axios from 'axios';
import { BACKEND_URL, RESERVATIONS_SUFFIX, STORITEV_PREFIX, RESERVATION_SUFFIX } from '../Constants'

const user = JSON.parse(window.sessionStorage.getItem("user"));
if (user != null) {
    const token = user.jwt;
    axios.defaults.headers.common["Authorization"] = token;
}

const client = axios.create();


class ReservationService {

    rezervacije_by_company_id(company_id) {
        const response = client.get(BACKEND_URL + STORITEV_PREFIX + company_id + RESERVATIONS_SUFFIX);
        return response;
    }

    add_new_rezervacija(company_id, rezervacija){
        return client.post(BACKEND_URL+STORITEV_PREFIX + company_id +RESERVATION_SUFFIX, rezervacija)
    }

}
export default new ReservationService()