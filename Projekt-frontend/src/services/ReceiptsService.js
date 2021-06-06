import axios from 'axios';
import { BACKEND_URL, RESERVATIONS_SUFFIX, STORITEV_PREFIX, RESERVATION_SUFFIX, SINGLE_RESERVATION_URL, ZASEDENI_TERMINI_URL, RACUNI_PREFIX } from '../Constants'
import { filterReservationsByDate } from '../Utils';

const user = JSON.parse(window.sessionStorage.getItem("user"));
if (user != null) {
    const token = user.jwt;
    axios.defaults.headers.common["Authorization"] = token;
}

const client = axios.create();
var isConnection = navigator.onLine;

const povezava = () => {
    isConnection = true;
}

const niPovezave = () => {
    isConnection = false;
}


window.addEventListener("online", povezava, false);
window.addEventListener("offline", niPovezave, false);

class ReceiptsService {

    add_new_racun(company_id, racun) {
        return client.post(BACKEND_URL + RACUNI_PREFIX + "storitev/" + company_id, racun);
    }
    get_all_receipts(company_id) {
        return client.get(BACKEND_URL + RACUNI_PREFIX + "storitev/" + company_id);
    }
    get_receipt_by_id(id) {
        return client.get(BACKEND_URL + RACUNI_PREFIX + id);
    }
    get_receipt_pdf(id) {
        return client.get(BACKEND_URL + RACUNI_PREFIX + id + "/pdf");
    }
    get_receipt_full(id) {
        return client.get(BACKEND_URL + RACUNI_PREFIX + id + "/full");
    }

    delete_receipt_by_id(id) {
        return client.delete(BACKEND_URL + RACUNI_PREFIX + id);
    }

    getConnectionStatus = () => {
        return isConnection;
    }
}
export default new ReceiptsService()