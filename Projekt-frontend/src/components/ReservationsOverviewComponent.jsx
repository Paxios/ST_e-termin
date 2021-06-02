import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import ReservationService from '../services/ReservationService'

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import CreateReservationDialogComponent from './CreateReservationDialogComponent';
import ReservationsListComponent from './ReservationsListComponent';
import EditReservationDialogComponent from './EditReservationDialogComponent';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';



class FooterComponent extends Component {
    constructor(props) {
        super(props)
        this.loadRezervacije()
        this.state = {
            rezervacije: [],
            isAddReservationShowing: false,
            isEditReservationShowing: false,
            editReservation: {},
            openSnackbar:false,
            snackbarMessage:""
        }

    }

    loadRezervacije = () => {
        ReservationService.rezervacije_by_company_id(this.props.user.company_id).then((response) => {
            this.setState({ rezervacije: response.data })
            return response;
        }).catch((error) => {
            console.log(error)
            return null;
        });
    }

    closeAddReservationDialog = () => {
        this.setState({ isAddReservationShowing: false })
    }

    changeEditReservationDialogState = () => {
        if(this.state.isEditReservationShowing === true){
            this.setState({editReservation: {}})
        }
        this.setState({ isEditReservationShowing: !this.state.isEditReservationShowing })
    }

    changeEditReservationData = (reservation) => {    
        this.changeEditReservationDialogState();
        this.setState({editReservation:reservation});
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
        return (
            <div>
                <ReservationsListComponent refreshReservations={this.loadRezervacije} changeEditReservationData={this.changeEditReservationData} reservations={this.state.rezervacije}></ReservationsListComponent>

                {/* FAB */}
                <Tooltip title="Add reservation" aria-label="add_reservation">
                    <Fab color="primary" className="fab_add_reservation" onClick={() => {
                        this.setState({ isAddReservationShowing: true })
                    }}>
                        <AddIcon />
                    </Fab>
                </Tooltip>

                {/* DIALOGS */}
                <CreateReservationDialogComponent changeSnackBarState ={this.changeSnackBarMessage} refreshReservations={this.loadRezervacije} user={this.props.user} closeDialog={this.closeAddReservationDialog} isShowing={this.state.isAddReservationShowing} />
                <EditReservationDialogComponent company_id={this.props.user.company_id} changeSnackBarState={this.changeSnackBarMessage} refreshReservations={this.loadRezervacije} closeEditReservationDialog={this.changeEditReservationDialogState} isEditReservationShowing={this.state.isEditReservationShowing} reservation={this.state.editReservation} />
                
                <Snackbar anchorOrigin={{ "vertical": "bottom", "horizontal": "center" }} autoHideDuration={2000} onClose={this.changeSnackBarState} open={this.state.openSnackbar}>
                    <Alert onClose={this.changeSnackBarState} severity="success">
                        {this.state.snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}

export default withRouter(FooterComponent)
