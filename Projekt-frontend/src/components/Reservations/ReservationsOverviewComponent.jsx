import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import ReservationService from '../../services/ReservationService'

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import CreateReservationDialogComponent from './CreateReservationDialogComponent';
import ReservationsListComponent from './ReservationsListComponent';
import EditReservationDialogComponent from './EditReservationDialogComponent';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { REFRESH_TIME } from '../../Constants'
import AddReservationReceiptDialog from '../Receipts/AddReservationReceiptDialog';
import ServicesService from '../../services/ServicesService';
import AuthContext from "../../context/AuthContext";
import { Grid } from "@material-ui/core";

class ReservationsOverviewComponent extends Component {
    static contextType = AuthContext

    constructor(props) {
        super(props)
        this.state = {
            rezervacije: [],
            isAddReservationShowing: false,
            isEditReservationShowing: false,
            editReservation: {},
            openSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",
            isOnline: navigator.onLine,
            isConfirmReservationDialogOpen: false,
            currentConfirmReservation: null,

            storitev: {}
        }
    }

    povezava = () => {
        this.setState({ "isOnline": true });
    }

    niPovezave = () => {
        this.setState({
            "isOnline": false,
            isAddReservationShowing: false,
            isEditReservationShowing: false
        });
    }

    loadRezervacije = () => {
        ReservationService.overview_loadRezervacije(this)
    }

    componentDidMount() {
        window.addEventListener("online", this.povezava, false);
        window.addEventListener("offline", this.niPovezave, false);
        this.loadRezervacije()
        ServicesService.info_loadStoritev(this, this.context.user.company_id)


        this.interval = setInterval(() => {
            this.loadRezervacije();
        }, REFRESH_TIME);
    }
    componentWillUnmount() {
        window.removeEventListener("online", this.povezava, false);
        window.removeEventListener("offline", this.niPovezave, false);
        clearInterval(this.interval);
    }

    closeAddReservationDialog = () => {
        this.setState({ isAddReservationShowing: false })
    }

    changeEditReservationDialogState = () => {
        if (this.state.isEditReservationShowing === true) {
            this.setState({ editReservation: {} })
        }
        this.setState({ isEditReservationShowing: !this.state.isEditReservationShowing })
    }

    changeEditReservationData = (reservation) => {
        this.changeEditReservationDialogState();
        this.setState({ editReservation: reservation });
    }

    openConfirmReservationDialog = (rezervacija) => {
        this.setState({
            currentConfirmReservation: rezervacija,
            isConfirmReservationDialogOpen: true
        });
    }

    closeConfirmReservationDialog = () => {
        this.setState({
            isConfirmReservationDialogOpen: false
        });
    }

    changeSnackBarState = () => {
        this.setState({
            openSnackbar: !this.state.openSnackbar,
        });
    }

    changeSnackBarMessage = (message, severity) => {
        this.setState({
            snackbarMessage: message,
            snackbarSeverity: severity
        })
        this.changeSnackBarState();
    }

    render() {
        const isOnline = this.state.isOnline;
        return (
            <Grid container style={{backgroundColor: '#F4F5F7'}}>
                <Grid item xs={12} lg={8}>
                    <ReservationsListComponent
                        service={this.state.storitev}
                        refreshReservations={this.loadRezervacije}
                        changeEditReservationData={this.changeEditReservationData}
                        reservations={this.state.rezervacije}
                        openConfirmReservationDialog={this.openConfirmReservationDialog}
                    />
                </Grid>


                {/* FAB */}
                {isOnline ?
                    <Tooltip title="Add reservation" aria-label="add_reservation">
                        <Fab color="primary" className="fab_add_reservation" onClick={() => {
                            this.setState({ isAddReservationShowing: true })
                        }}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                    : <div></div>}

                {/* DIALOGS */}
                <CreateReservationDialogComponent storitev={this.state.storitev} changeSnackBarState={this.changeSnackBarMessage} refreshReservations={this.loadRezervacije} user={this.props.user} closeDialog={this.closeAddReservationDialog} isShowing={this.state.isAddReservationShowing} />
                <EditReservationDialogComponent storitev={this.state.storitev} company_id={this.props.user.company_id} changeSnackBarState={this.changeSnackBarMessage} refreshReservations={this.loadRezervacije} closeEditReservationDialog={this.changeEditReservationDialogState} isEditReservationShowing={this.state.isEditReservationShowing} reservation={this.state.editReservation} />

                <Snackbar anchorOrigin={{ "vertical": "bottom", "horizontal": "center" }} autoHideDuration={2000} onClose={this.changeSnackBarState} open={this.state.openSnackbar}>
                    <Alert onClose={this.changeSnackBarState} severity={this.state.snackbarSeverity}>
                        {this.state.snackbarMessage}
                    </Alert>
                </Snackbar>
                {this.state.currentConfirmReservation ? (
                    <AddReservationReceiptDialog
                        isOpen={this.state.isConfirmReservationDialogOpen}
                        closeDialog={this.closeConfirmReservationDialog}
                        reservation={this.state.currentConfirmReservation}
                        refreshReservations={this.loadRezervacije}
                        changeSnackBarState={this.changeSnackBarMessage}
                    />
                ) : ('')}

            </Grid>
        )
    }
}

export default withRouter(ReservationsOverviewComponent)
