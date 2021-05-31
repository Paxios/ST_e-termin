import axios from 'axios';
import addOAuthInterceptor from "axios-oauth-1.0a";

const CUSTOMER_API_BASE_URL = "http://studentdocker.informatika.uni-mb.si:20285/wp-json/wc/v3/customers";

const client = axios.create();

addOAuthInterceptor(client, {
 key: "ck_972561c1c9fc45e1a03c9ee8751a0acae3d61cd8",
 secret: "cs_63446b19dc6f05d9e843980df6d2dc16f8ce7843",
algorithm: "HMAC-SHA1",
});

class CustomerService {

    getCustomers(){
        return client.get(CUSTOMER_API_BASE_URL);
    }

    createCustomer(customer){
        return client.post(CUSTOMER_API_BASE_URL, customer);
    }

    getCustomerById(customerId){
        return client.get(CUSTOMER_API_BASE_URL + '/' + customerId);
    }

    updateCustomer(customer, customerId){
        return client.put(CUSTOMER_API_BASE_URL + '/' + customerId, customer);
    }

    deleteCustomer(customerId){
        return client.delete(CUSTOMER_API_BASE_URL + '/' + customerId,{ params: {
            force:true
          }});
    }
}

export default new CustomerService()