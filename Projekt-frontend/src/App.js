import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// import ListCustomerComponent from './components/ListCustomerComponent';
// import ListCouponComponent from './components/ListCouponComponent';
import HeaderComponent from './components/HeaderComponent';
// import FooterComponent from './components/FooterComponent';
// import CreateCustomerComponent from './components/CreateCustomerComponent';
// import CreateCouponComponent from './components/CreateCouponComponent';
import RegisterComponent from './components/RegisterComponent';
import ReservationsOverviewComponent from './components/ReservationsOverviewComponent';
import TimelineComponent from './components/TimelineComponent';
import ServicesOverviewComponent from './components/ServicesOverviewComponent';

function App() {
  const loggedIn = JSON.parse(window.sessionStorage.getItem("user"));
  return (
    <div>
      <Router>
        <HeaderComponent />
        <div className="container">
          {loggedIn
            ?
            <Switch>
              <Route path="/services" render={() => <ServicesOverviewComponent user={loggedIn}/>}></Route>
              <Route path="/overview" render={() => <ReservationsOverviewComponent user={loggedIn}/>}></Route>
              <Route path="/timeline" component={TimelineComponent}></Route>
              {/* <Route path = "/customers" component = {ListCustomerComponent}></Route>
                      <Route path = "/coupons" component = {ListCouponComponent}></Route>
                      <Route path = "/add-customer/:id" component = {CreateCustomerComponent}></Route>
                      <Route path = "/add-coupon/:id" component = {CreateCouponComponent}></Route> */}
            </Switch>
            :
            <Switch>
              <Route path="/register" component={RegisterComponent}></Route>
              <div>You need to log in!</div>
            </Switch>
          }
        </div>
        {/* <FooterComponent /> */}
      </Router>
    </div>

  );
}

export default App;
