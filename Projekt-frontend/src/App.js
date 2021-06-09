import React, { useState, useEffect } from 'react';
import './App.css';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import HeaderComponent from './components/General/HeaderComponent';
import FooterComponent from './components/General/FooterComponent';
import RegisterComponent from './components/UserManagement/RegisterComponent';
import ReservationsOverviewComponent from './components/Reservations/ReservationsOverviewComponent';
import TimelineComponent from './components/Timeline/TimelineComponent';
import ServicesOverviewComponent from './components/Services/ServicesOverviewComponent';
import ServiceInfoComponent from './components/Services/ServiceInfoComponent';
import HomepageComponent from './components/Homepage/HomepageComponent';
import AuthContext from "./context/AuthContext";
import UnauthorizedPage from './components/General/UnauthorizedPage';
import ProtectedRoute from './routes/ProtectedRoute';
import ReceiptsOverviewComponent from './components/Receipts/ReceiptsOverviewComponent';
import ReportsOverviewComponent from './components/Reports/ReportsOverviewComponent';
import ConnectionContext from "./context/ConnectionContext";
import ServicesService from "./services/ServicesService";
import ReceiptsService from "./services/ReceiptsService";
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ServiceDetailsComponent from './components/Services/ServiceDetailsComponent';

function App() {
  const {t} = useTranslation();
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
                  <ReservationsOverviewComponent t={t} user={user} />
                </ProtectedRoute>
                <ProtectedRoute path="/timeline">
                  <TimelineComponent user={user} />
                </ProtectedRoute>
                <ProtectedRoute path="/serviceInfo">
                  <ServiceInfoComponent user={user} />
                </ProtectedRoute>
                <ProtectedRoute path="/serviceDetails">
                  <ServiceDetailsComponent user={user} />
                </ProtectedRoute>
                <Route path="/unauthorized" component={UnauthorizedPage}></Route>
                <Route path="/register" component={RegisterComponent}></Route>
                <Route path="/" render={() => <HomepageComponent />}></Route>
              </Switch>
            </Grid>
          </ConnectionContext.Provider>
        </AuthContext.Provider>
      </Router>
    </div>

  );
}

export default App;
