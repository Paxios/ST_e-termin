import axios from 'axios';
import { BACKEND_URL, STORITEV_PREFIX, DELOVNICAS_PREFIX, ZAPOSLENI_SUFFIX, PONUDBA_SUFFIX, ZAPOSLENI_PREFIX, PONUDBA_PREFIX } from '../Constants'

const user = JSON.parse(window.sessionStorage.getItem("user"));
if (user != null) {
    const token = user.jwt;
    axios.defaults.headers.common["Authorization"] = token;
}

const client = axios.create();

class ServicesService {
    isOnline = true;

    storitve() {
        const response = client.get(BACKEND_URL + STORITEV_PREFIX);
        return response;
    }

    storitev_by_company_id(company_id) {
        const response = client.get(BACKEND_URL + STORITEV_PREFIX + company_id);
        return response;
    }

    update_storitev(company_id, storitev) {
        return client.put(BACKEND_URL + STORITEV_PREFIX + company_id, storitev)
    }

    update_delovni_cas(company_id, delovni_cas) {
        return client.put(BACKEND_URL + STORITEV_PREFIX + company_id + DELOVNICAS_PREFIX, delovni_cas)
    }

    overview_loadStoritve(component) {
        if (this.isOnline) {
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
            console.log("no internet using storage");
            const storitve = JSON.parse(window.localStorage.getItem("storitve"));
            if (storitve)
                component.setState({
                    storitve: storitve
                })

        }
    }

    info_loadStoritev(component, podjetjeId) {
        if (this.isOnline) {
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

    addEmployee(company_id, newData) {
        client.post(BACKEND_URL + STORITEV_PREFIX + company_id + ZAPOSLENI_SUFFIX, newData)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            })
    }

    updateEmployee(company_id, newData) {
        console.log(newData)
        client.put(BACKEND_URL + STORITEV_PREFIX + company_id + ZAPOSLENI_PREFIX + newData._id, newData)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            })
    }

    removeEmployee(company_id, employeeId) {
        client.delete(BACKEND_URL + STORITEV_PREFIX + company_id + ZAPOSLENI_PREFIX + employeeId)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            })
    }

    addOffer(company_id, newData) {
        client.post(BACKEND_URL + STORITEV_PREFIX + company_id + PONUDBA_SUFFIX, newData)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            })
    }

    updateOffer(company_id, newData) {
        console.log(newData)
        client.put(BACKEND_URL + STORITEV_PREFIX + company_id + PONUDBA_PREFIX + newData._id, newData)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            })
    }

    removeOffer(company_id, offerId) {
        client.delete(BACKEND_URL + STORITEV_PREFIX + company_id + PONUDBA_PREFIX + offerId)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            })
    }

    setIsOnline = (state) => {
        console.log(state);
        this.isOnline = state;
    }
}
const instance = new ServicesService();
Object.seal(instance);
export default instance;