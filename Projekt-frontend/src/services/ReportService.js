import axios from 'axios';
import { BACKEND_URL, RESERVATIONS_SUFFIX, STORITEV_PREFIX, RESERVATION_SUFFIX, SINGLE_RESERVATION_URL, ZASEDENI_TERMINI_URL, RACUNI_PREFIX, REPORT_PREFIX, RACUNI_SUFFIX, COUNT_SUFFIX } from '../Constants'
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

class ReportService {

    get_report_count(id) {
        return client.get(BACKEND_URL + REPORT_PREFIX + id + RACUNI_SUFFIX + COUNT_SUFFIX)
    }

    get_reservations_count(id) {
        return client.get(BACKEND_URL + REPORT_PREFIX + id + RESERVATIONS_SUFFIX + COUNT_SUFFIX)
    }

    get_racuni_report_pdf(id){
        return client.get(BACKEND_URL + REPORT_PREFIX + id + RACUNI_SUFFIX + "/pdf")
    }

    getConnectionStatus = () => {
        return isConnection;
    }

}
export default new ReportService()