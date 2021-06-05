import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import ServicesService from '../services/ServicesService'

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import ServicesListComponent from './ServicesListComponent';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { REFRESH_TIME } from '../Constants'

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
        this.setState({ "isOnline": false,
        isAddServiceShowing:false,
        isEditServiceShowing:false
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

    render() {
        const isOnline = this.state.isOnline;
        return (
            <div>
                <ServicesListComponent refreshServices={this.loadStoritve} changeEditServiceData={this.changeEditServiceData} services={this.state.storitve}></ServicesListComponent>

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
            </div>
        )
    }
}

export default withRouter(ServicesOverviewComponent)
