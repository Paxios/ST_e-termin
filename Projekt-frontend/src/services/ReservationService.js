import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { BACKEND_URL, RESERVATIONS_SUFFIX, STORITEV_PREFIX, RESERVATION_SUFFIX, SINGLE_RESERVATION_URL, ZASEDENI_TERMINI_URL } from '../Constants'
import { filterReservationsByDate } from '../Utils';

const user = JSON.parse(window.sessionStorage.getItem("user"));
if (user != null) {
    const token = user.jwt;
    axios.defaults.headers.common["Authorization"] = token;
}


const client = axios.create();
var isConnection = navigator.onLine;


//TODO: this should be global call and not only on reservation.
client.interceptors.request.use((config) => {
    const decodedToken = jwtDecode(config.headers.common.Authorization)
    const expiration = new Date(decodedToken.exp * 1000)
    const now = new Date()
    if (now > expiration) {
        window.location = "/";
        window.sessionStorage.removeItem("user");
        //TODO: could show a toast that session expired
    }
    return config;
}, function (error) {
    return Promise.reject(error);
})

const povezava = () => {
    isConnection = true;
}

const niPovezave = () => {
    isConnection = false;
}


window.addEventListener("online", povezava, false);
window.addEventListener("offline", niPovezave, false);

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

    occupied_rezervacije(company_id) {
        return client.get(BACKEND_URL + STORITEV_PREFIX + company_id + ZASEDENI_TERMINI_URL)
    }


    overview_loadRezervacije(component) {
        if (isConnection) {
            this.rezervacije_by_company_id(component.props.user.company_id).then((response) => {
                const rezervacije = response.data.sort(function (a, b) {
                    return new Date(a.datum) - new Date(b.datum);
                });

                component.setState({
                    rezervacije: rezervacije
                })

                window.localStorage.setItem("rezervacije", JSON.stringify(rezervacije))

                return response;
            }).catch((error) => {
                console.log(error)
                return null;
            })
        }
        else {
            const rezervacije = JSON.parse(window.localStorage.getItem("rezervacije"));
            if (rezervacije)
                component.setState({
                    rezervacije: rezervacije.sort(function (a, b) { return new Date(a.datum) - new Date(b.datum); })
                })

        }
    }


    timeline_loadRezervacije(component, date) {
        if (isConnection) {
            this.occupied_rezervacije(component.state.user.company_id).then((response) => {
                window.localStorage.setItem("occupied_rezervacije", JSON.stringify(response.data.occupied))
                component.setState({ reservations: filterReservationsByDate(response.data.occupied, date) })
            }).catch((error) => {
                console.log(error)
            });
        }
        else {
            component.setState({ reservations: filterReservationsByDate(JSON.parse(window.localStorage.getItem("occupied_rezervacije")), date) })
        }
    }


    getConnectionStatus = () => {
        return isConnection;
    }
}
export default new ReservationService()