import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import ServicesService from '../services/ServicesService'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ServicesListComponent from './ServicesListComponent';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { REFRESH_TIME } from '../Constants'
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Button, Grid } from '@material-ui/core';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

class ServicesOverviewComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            storitve: [],
            isAddServiceShowing: false,
            isEditServiceShowing: false,
            editService: {},
            openSnackbar: false,
            snackbarMessage: "",
            isOnline: navigator.onLine
        }
    }

    povezava = () => {
        this.setState({ "isOnline": true });
    }

    niPovezave = () => {
        this.setState({
            "isOnline": false,
            isAddServiceShowing: false,
            isEditServiceShowing: false
        });
    }

    loadStoritve = () => {
        ServicesService.overview_loadStoritve(this)
    }

    componentDidMount() {

        window.addEventListener("online", this.povezava, false);
        window.addEventListener("offline", this.niPovezave, false);
        this.loadStoritve()


        this.interval = setInterval(() => {
            this.loadStoritve();
        }, REFRESH_TIME);
    }
    componentWillUnmount() {
        window.removeEventListener("online", this.povezava, false);
        window.removeEventListener("offline", this.niPovezave, false);
        clearInterval(this.interval);
    }

    closeAddServiceDialog = () => {
        this.setState({ isAddServiceShowing: false })
    }

    changeEditServiceDialogState = () => {
        if (this.state.isEditServiceShowing === true) {
            this.setState({ editService: {} })
        }
        this.setState({ isEditServiceShowing: !this.state.isEditServiceShowing })
    }

    changeEditServiceData = (service) => {
        this.changeEditServiceDialogState();
        this.setState({ editService: service });
    }

    changeSnackBarState = () => {
        this.setState({
            openSnackbar: !this.state.openSnackbar,
        });
    }

    changeSnackBarMessage = message => {
        this.setState({
            snackbarMessage: message
        })
        this.changeSnackBarState();
    }

    handleOnClickMarker = (x) => {
        const anchorElement = document.getElementById(x);
        if (anchorElement) {
            anchorElement.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }

    render() {
        const isOnline = this.state.isOnline;
        return (
            <Grid container style={{backgroundColor: '#f4f5f7', paddingTop: '25px'}}>
                <Grid item xs={12} style={{paddingLeft: '18px', paddingRight: '18px'}}>
                    <Card >
                        <CardContent style={{ "padding": "0px" }}>
                            <MapContainer center={[46.5604847, 15.6346753]} zoom={15} scrollWheelZoom={false} style={{ "height": "400px", "width": "100%" }}>
                                <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {
                                    this.state.storitve.map(
                                        service =>
                                            <Marker position={[service.lokacija.x, service.lokacija.y]}>
                                                <Popup>
                                                    <h3>{service.ime}</h3>
                                                    <br />
                                                    {service.tip}
                                                    <br />
                                                    <Button variant="contained" onClick={() => this.handleOnClickMarker(service._id)}>Več informacij</Button>
                                                </Popup>
                                            </Marker>
                                    )
                                }
                            </MapContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <ServicesListComponent refreshServices={this.loadStoritve} changeEditServiceData={this.changeEditServiceData} services={this.state.storitve}></ServicesListComponent>
                </Grid>


                {/* FAB */}
                {/* {isOnline ?
                    <Tooltip title="Add reservation" aria-label="add_reservation">
                        <Fab color="primary" className="fab_add_reservation" onClick={() => {
                            this.setState({ isAddServicesShowing: true })
                        }}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                    : <div></div>} */}

                {/* DIALOGS */}
                {/* <CreateReservationDialogComponent changeSnackBarState={this.changeSnackBarMessage} refreshServices={this.loadRezervacije} user={this.props.user} closeDialog={this.closeAddReservationDialog} isShowing={this.state.isAddServiceShowing} />
                <EditReservationDialogComponent company_id={this.props.user.company_id} changeSnackBarState={this.changeSnackBarMessage} refreshServices={this.loadRezervacije} closeEditReservationDialog={this.changeEditReservationDialogState} isEditServiceShowing={this.state.isEditServiceShowing} service={this.state.editReservation} /> */}

                <Snackbar anchorOrigin={{ "vertical": "bottom", "horizontal": "center" }} autoHideDuration={2000} onClose={this.changeSnackBarState} open={this.state.openSnackbar}>
                    <Alert onClose={this.changeSnackBarState} severity="success">
                        {this.state.snackbarMessage}
                    </Alert>
                </Snackbar>
            </Grid>
        )
    }
}

export default withRouter(ServicesOverviewComponent)
