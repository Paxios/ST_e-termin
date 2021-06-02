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
import { formatDate, filterReservations } from '../Utils'

class ReservationsListComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            openSnackbar: false
        }
    }

    changeStateSnackbar = () => {
        this.setState({ openSnackbar: !this.state.openSnackbar })
    }

    render() {
        return (
            <div>
                <ReservationElements refreshReservations={this.props.refreshReservations} changeEditReservationData={this.props.changeEditReservationData} reservations={this.props.reservations} changeSnackbarState={this.changeStateSnackbar} />
                <Snackbar anchorOrigin={{ "vertical": "bottom", "horizontal": "center" }} autoHideDuration={2000} onClose={this.changeStateSnackbar} open={this.state.openSnackbar}>
                    <Alert onClose={this.changeStateSnackbar} severity="success">
                        Successfully deleted a reservation.
                    </Alert>
                </Snackbar>
            </div>
        )
    }

}


function ReservationElements(props) {

    const res = filterReservations(props.reservations);
    const forReturn = res.map((reservation) =>
        <ReservationElement key={reservation._id} refreshReservations={props.refreshReservations} changeEditReservationData={props.changeEditReservationData} changeSnackbarState={props.changeSnackbarState} reservation={reservation} />
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
                        <IconButton className="edit-reservation" aria-label="edit" onClick={() => {
                            props.changeEditReservationData(reservation)
                        }
                        } >
                            <EditIcon color="primary" /></IconButton>
                        <IconButton className="delete-reservation" aria-label="delete" onClick={() => {
                            ReservationService.delete_rezervacija(reservation._id).then((response) => {
                                console.log(response);
                                props.refreshReservations();
                                props.changeSnackbarState();
                            }).catch(error => {
                                console.log(error)
                            })

                        }} ><DeleteIcon color="secondary" /></IconButton>
                    </Typography>
                    <Typography className="reservation-date" variant="h6" color="textSecondary">{formatDate(reservation.datum) /*TODO ime storitve in ne id storitve*/}</Typography>
                    <Typography className="reservation-name" color="textPrimary">{`${reservation.ime_stranke} ${reservation.priimek_stranke}, ${reservation.tel_st}`}</Typography>
                    <TextField className="reservation-description" multiline InputProps={{ readOnly: false }} value={reservation.delo} variant="outlined" />

                </CardContent>
            </Card>
        </div>
    );
}

export default ReservationsListComponent
