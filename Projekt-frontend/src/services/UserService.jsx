import axios from 'axios';
import {LOGIN_URL, REGISTER_URL} from '../Constants'
import jwt from 'jwt-decode'

const client = axios.create();

class UserService {

    login(username,password){
        const body = {}
        body["uporabnisko_ime"] = username;
        body["geslo"] = password;
        const response = client.post(LOGIN_URL, body);
        return response;
    }

    register(username,password, company_id){
        const body = {}
        body["uporabnisko_ime"] = username + "";
        body["geslo"] = password + "";
        body["id_podjetje"] = company_id + "";
        const response = client.post(REGISTER_URL, body);
        console.log(response)
        return response;
    }

    decodeJWT(token){
        return jwt(token);
    }

}
export default new UserService()