import axios from 'axios';
import { BACKEND_URL, RESERVATIONS_SUFFIX, STORITEV_PREFIX, RESERVATION_SUFFIX, SINGLE_RESERVATION_URL, ZASEDENI_TERMINI_URL, RACUNI_PREFIX, REPORT_PREFIX } from '../Constants'
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
    isOnline = true;

    add_new_racun(company_id, racun) {
        return client.post(BACKEND_URL + RACUNI_PREFIX + "storitev/" + company_id, racun);
    }
    get_all_receipts(company_id) {
        return new Promise((res, rej) => {
            if (this.isOnline) {
                client.get(BACKEND_URL + RACUNI_PREFIX + "storitev/" + company_id)
                    .then((result) => {
                        window.localStorage.setItem("racuni", JSON.stringify(result.data));
                        res(result);
                    })
                    .catch((err) => {
                        rej(err);
                    })
            }
            else {
                const racuni = JSON.parse(window.localStorage.getItem("racuni"));
                if (racuni){
                    res({data: racuni});
                }
                else{
                    rej("No racuni found");
                }
    
            }
        })
        
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

    get_report(id) {
        return client.get(BACKEND_URL + REPORT_PREFIX + id)
    }

    getConnectionStatus = () => {
        return isConnection;
    }

    setIsOnline = (state) => {
        console.log(state);
        this.isOnline = state;
    }

}
const instance = new ReceiptsService();
Object.seal(instance);
export default instance;