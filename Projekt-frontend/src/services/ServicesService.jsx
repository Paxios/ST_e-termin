import axios from 'axios';
import { BACKEND_URL, STORITEV_PREFIX } from '../Constants'
//import { filterServicesByDate } from '../Utils';

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

class ServicesService {

    storitve() {
        const response = client.get(BACKEND_URL + STORITEV_PREFIX);
        return response;
    }

    storitev_by_company_id(company_id) {
        const response = client.get(BACKEND_URL + STORITEV_PREFIX + company_id);
        return response;
    }

    update_storitev(company_id,storitev) {
        return client.put(BACKEND_URL + STORITEV_PREFIX + company_id, storitev)
    }

    overview_loadStoritve(component) {
        if (isConnection) {
            this.storitve().then((response) => {
                const storitve = response.data.services;

                component.setState({
                    storitve: storitve
                })

                window.localStorage.setItem("storitve", JSON.stringify(storitve))

                return response;
            }).catch((error) => {
                console.log(error)
                return null;
            })
        }
        else {
            const storitve = JSON.parse(window.localStorage.getItem("storitve"));
            if (storitve)
                component.setState({
                    storitve: storitve
                })

        }
    }

    info_loadStoritev(component, podjetjeId) {
        if (isConnection) {
            this.storitev_by_company_id(podjetjeId).then((response) => {
                const storitev = response.data;

                component.setState({
                    storitev: storitev
                })

                window.localStorage.setItem("storitev", JSON.stringify(storitev))

                return response;
            }).catch((error) => {
                console.log(error)
                return null;
            })
        }
        else {
            const storitev = JSON.parse(window.localStorage.getItem("storitev"));
            if (storitev)
                component.setState({
                    storitev: storitev
                })

        }
    }

    getConnectionStatus = () => {
        return isConnection;
    }
}
export default new ServicesService()