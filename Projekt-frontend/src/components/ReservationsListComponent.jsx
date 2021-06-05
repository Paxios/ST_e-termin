import React, { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import ReservationService from '../services/ReservationService';
import { formatDate } from '../Utils'
import DoneAllIcon from '@material-ui/icons/DoneAll';
import AddReservationReceiptDialog from './Receipts/AddReservationReceiptDialog';


var isOnline = navigator.onLine;

const povezava = () => {
    isOnline = true;
}

const niPovezave = () => {
    isOnline = false;
}

window.addEventListener("online", povezava, false);
window.addEventListener("offline", niPovezave, false);

class ReservationsListComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            openSnackbar: false,
            snackbarMessage: ""
        }
    }

    changeStateSnackbar = (message) => {
        this.setState({
            snackbarMessage: message,
            openSnackbar: !this.state.openSnackbar
        })
    }

    render() {
        return (
            <div>
                <ReservationElements refreshReservations={this.props.refreshReservations} changeEditReservationData={this.props.changeEditReservationData} reservations={this.props.reservations} changeSnackbarState={this.changeStateSnackbar} openConfirmReservationDialog={this.props.openConfirmReservationDialog}/>
                <Snackbar anchorOrigin={{ "vertical": "bottom", "horizontal": "center" }} autoHideDuration={2000} onClose={this.changeStateSnackbar} open={this.state.openSnackbar}>
                    <Alert onClose={this.changeStateSnackbar} severity="success">
                        {this.state.snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        )
    }

}


function ReservationElements(props) {
    // const res = filterReservations(props.reservations);
    const res = props.reservations;
    const forReturn = res.map((reservation) =>
        <ReservationElement key={reservation._id} refreshReservations={props.refreshReservations} changeEditReservationData={props.changeEditReservationData} changeSnackbarState={props.changeSnackbarState} reservation={reservation} openConfirmReservationDialog={props.openConfirmReservationDialog}/>
    )
    return (<ul>{forReturn}</ul>);
}

function ReservationElement(props) {
    const reservation = props.reservation;
    return (
        <div>
            <Card className="reservation_card_element" >
                <CardContent>
                    <Typography className="reservation-service" variant="h6" color="textPrimary">{reservation.id_storitev /*TODO ime storitve in ne id storitve*/}
                        {isOnline ?
                        <div>
                            <IconButton className="complete-reservation" aria-label="complete" onClick={() => {
                                props.openConfirmReservationDialog(reservation);
                            }}>
                                <DoneAllIcon className="complete-reservation-icon" />
                            </IconButton>
                            <IconButton className="edit-reservation" aria-label="edit" onClick={() => {
                                props.changeEditReservationData(reservation)
                            }
                            } >
                                <EditIcon color="primary" /></IconButton>
                            <IconButton className="delete-reservation" aria-label="delete" onClick={() => {
                                ReservationService.delete_rezervacija(reservation._id).then((response) => {
                                    console.log(response);
                                    props.refreshReservations();
                                    props.changeSnackbarState("Successfully deleted one reservation.");
                                }).catch(error => {
                                    console.log(error)
                                })

                            }} ><DeleteIcon color="secondary" /></IconButton>
                        </div>
                        :<div></div>}

                    </Typography>
                    <Typography className="reservation-date" variant="h6" color="textSecondary">{formatDate(reservation.datum) /*TODO ime storitve in ne id storitve*/}</Typography>
                    <Typography className="reservation-name" color="textPrimary">{`${reservation.ime_stranke} ${reservation.priimek_stranke},${reservation.tel_st}`}</Typography>
                    <TextField className="reservation-description" multiline InputProps={{ readOnly: false }} value={reservation.delo} variant="outlined" />

                </CardContent>
            </Card>
        </div>
    );
}

export default ReservationsListComponent
