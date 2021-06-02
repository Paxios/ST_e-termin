import axios from 'axios';
import { BACKEND_URL, RESERVATIONS_SUFFIX, STORITEV_PREFIX, RESERVATION_SUFFIX, SINGLE_RESERVATION_URL, ZASEDENI_TERMINI_URL } from '../Constants'

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

    add_new_rezervacija(company_id, rezervacija) {
        return client.post(BACKEND_URL + STORITEV_PREFIX + company_id + RESERVATION_SUFFIX, rezervacija)
    }

    delete_rezervacija(rezervacija_id) {
        return client.delete(SINGLE_RESERVATION_URL + rezervacija_id)
    }

    update_rezervacija(company_id, rezervacija_id, rezervacija) {
        return client.put(BACKEND_URL + STORITEV_PREFIX + company_id + RESERVATION_SUFFIX + "/" + rezervacija_id, rezervacija)
    }

    occupied_rezervacije(company_id){
        return client.get(BACKEND_URL+STORITEV_PREFIX + company_id + ZASEDENI_TERMINI_URL)
    }

}
export default new ReservationService()