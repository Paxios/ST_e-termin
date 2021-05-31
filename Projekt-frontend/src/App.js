import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import ListCustomerComponent from './components/ListCustomerComponent';
import ListCouponComponent from './components/ListCouponComponent';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import CreateCustomerComponent from './components/CreateCustomerComponent';
import CreateCouponComponent from './components/CreateCouponComponent';

function App() {
  const loggedIn = window.sessionStorage.getItem("user");
  return (
    <div>
        <Router>
              <HeaderComponent />
                <div className="container">
                { loggedIn
                    ? 
                    <Switch> 
                      <Route path = "/" exact component = {ListCustomerComponent}></Route>
                      <Route path = "/customers" component = {ListCustomerComponent}></Route>
                      <Route path = "/coupons" component = {ListCouponComponent}></Route>
                      <Route path = "/add-customer/:id" component = {CreateCustomerComponent}></Route>
                      <Route path = "/add-coupon/:id" component = {CreateCouponComponent}></Route>
                    </Switch>
                    : <div>You need to log in!</div>
                    }
                </div>
              <FooterComponent />
        </Router>
    </div>
    
  );
}

export default App;
