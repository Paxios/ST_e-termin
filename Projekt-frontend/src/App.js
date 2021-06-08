import React, { useState, useEffect } from 'react';
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
import ServiceInfoComponent from './components/ServiceInfoComponent';
import HomepageComponent from './components/HomepageComponent';
import AuthContext from "./context/AuthContext";
import UnauthorizedPage from './components/UnauthorizedPage';
import ProtectedRoute from './routes/ProtectedRoute';
import ReceiptsOverviewComponent from './components/Receipts/ReceiptsOverviewComponent';
import ReportsOverviewComponent from './components/Reports/ReportsOverviewComponent';
import ConnectionContext from "./context/ConnectionContext";
import ServicesService from "./services/ServicesService";
import ReceiptsService from "./services/ReceiptsService";
import { Grid } from '@material-ui/core';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const online = () => {
    setIsOnline(true);
    ServicesService.setIsOnline(true);
    ReceiptsService.setIsOnline(true);
  }

  const offline = () => {
    setIsOnline(false);
    ServicesService.setIsOnline(false);
    ReceiptsService.setIsOnline(false);
  }

  useEffect(() => {
    const user = JSON.parse(window.sessionStorage.getItem("user"));
    if (user) {
      setUser(user);
      setIsLoggedIn(true);
    }
    else {
      setIsLoggedIn(false);
    }

    window.addEventListener('online', online);
    window.addEventListener('offline', offline);

    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    }

  }, []);


  return (
    <div>
      <Router>
        <AuthContext.Provider value={{ isLoggedIn, user }} >
          <ConnectionContext.Provider value={{ isOnline }}>
            <HeaderComponent />
            <Grid container maxWidth="lg" style={{width: '100%'}}>
              <Switch>
                <Route path="/services">
                  <ServicesOverviewComponent user={user} />
                </Route>
                <ProtectedRoute path="/receipts">
                  <ReceiptsOverviewComponent />
                </ProtectedRoute>
                <ProtectedRoute path="/reports">
                  <ReportsOverviewComponent />
                </ProtectedRoute>
                <ProtectedRoute path="/overview">
                  <ReservationsOverviewComponent user={user} />
                </ProtectedRoute>
                <ProtectedRoute path="/timeline">
                  <TimelineComponent user={user} />
                </ProtectedRoute>
                <ProtectedRoute path="/serviceInfo">
                  <ServiceInfoComponent user={user} />
                </ProtectedRoute>
                <Route path="/unauthorized" component={UnauthorizedPage}></Route>
                {/* <Route path = "/customers" component = {ListCustomerComponent}></Route>
                      <Route path = "/coupons" component = {ListCouponComponent}></Route>
                      <Route path = "/add-customer/:id" component = {CreateCustomerComponent}></Route>
                      <Route path = "/add-coupon/:id" component = {CreateCouponComponent}></Route> */}
                <Route path="/register" component={RegisterComponent}></Route>
                <Route path="/" render={() => <HomepageComponent />}></Route>
              </Switch>
            </Grid>
            {/* <FooterComponent /> */}
          </ConnectionContext.Provider>
        </AuthContext.Provider>
      </Router>
    </div>

  );
}

export default App;
