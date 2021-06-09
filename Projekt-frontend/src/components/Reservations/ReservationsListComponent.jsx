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
import ReservationService from '../../services/ReservationService';
import { formatDate } from '../../Utils'
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { useTranslation } from 'react-i18next';
import { CardActionArea, CardActions } from '@material-ui/core';


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
            <div style={{ paddingTop: '15px' }}>
                <Typography variant="h6" style={{ paddingLeft: '20px' }}>
                    {this.props.t("reservations.title")}
                </Typography>
                <ReservationElements service={this.props.service} refreshReservations={this.props.refreshReservations} changeEditReservationData={this.props.changeEditReservationData} reservations={this.props.reservations} changeSnackbarState={this.changeStateSnackbar} openConfirmReservationDialog={this.props.openConfirmReservationDialog} />
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
    return (
        props.reservations.map((reservation) =>
            <ReservationElement service={props.service} key={reservation._id} refreshReservations={props.refreshReservations} changeEditReservationData={props.changeEditReservationData} changeSnackbarState={props.changeSnackbarState} reservation={reservation} openConfirmReservationDialog={props.openConfirmReservationDialog} />
        )
    );
}

function ReservationElement(props) {
    const reservation = props.reservation;
    var ponudbe = [];
    var ime_ponudbe = props.reservation.id_storitev;
    const { t } = useTranslation();

    if (props.service.ponudba) {
        ponudbe = props.service.ponudba;
        var ponudba = ponudbe.find(ponudba => props.reservation.id_storitev === ponudba.id)
        if (ponudba)
            ime_ponudbe = ponudba.ime;
    }
    return (
        <div style={{ margin: '15px'}}>
            <Card elevation={4} >
            
                    <CardContent>
                        <Typography className="reservation-service" variant="h6" color="textPrimary">{ime_ponudbe}


                        </Typography>
                        <Typography style={{ fontSize: '14px' }} className="reservation-date" variant="h6" color="textSecondary">{formatDate(reservation.datum) /*TODO ime storitve in ne id storitve*/}</Typography>
                        <Typography className="reservation-name" variant="body2" color="textPrimary">{`${reservation.ime_stranke} ${reservation.priimek_stranke} • ${reservation.tel_st}`}</Typography>
                        <Typography>
                            {reservation.delo}
                        </Typography>
                    </CardContent>
            
                {isOnline ?
                    <CardActions>
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
                                props.refreshReservations();
                                props.changeSnackbarState(t("reservations.newReservation.deleteReservationSuccess"), "success");
                            }).catch(error => {
                                console.log(error)
                            })

                        }} ><DeleteIcon color="secondary" /></IconButton>
                    </CardActions>
                    : ('')
                }
            </Card>
        </div>
    );
}

export default ReservationsListComponent
