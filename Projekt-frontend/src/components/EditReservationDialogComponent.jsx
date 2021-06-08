import React, { Component } from 'react'
import {
    Dialog,
    TextField,
    Button,
    Select,
    MenuItem
} from "@material-ui/core";
import ReservationService from '../services/ReservationService';
import { formatDateForDatePicker } from '../Utils'
import { withTranslation } from 'react-i18next';

class EditReservationDialogComponent extends Component {
    constructor(props) {
        super(props)
        // this.updateInitalState = this.updateInitalState.bind(this);


        this.state = {
            _id: "",
            fName: "",
            lName: "",
            duration: "",
            workDescription: "",
            phoneNumber: "",
            reservation_date: "",
            service_id: ""
        }

        this.handleDifferentServiceSelected = this.handleDifferentServiceSelected.bind(this)
    }

    handleDifferentServiceSelected(e) {
        this.setState({
            service_id: e.target.value,
            duration: this.props.storitev.ponudba.find(ponudba => ponudba.id === e.target.value).trajanje
        });
    }


    render() {
        var ponudbe;
        if (this.props.storitev.ponudba)
            ponudbe = this.props.storitev.ponudba;
        else
            ponudbe = [{
                "cena": "0.00",
                "id": "000000000000002d9a78251d",
                "ime": "Error",
                "opis": "Error description",
                "trajanje": 0
            }]

        return (
            <div>
                <Dialog className="dialog_edit_reservation" onClose={this.props.closeEditReservationDialog} open={this.props.isEditReservationShowing} onEnter={() => {
                    this.setState({
                        fName: this.props.reservation.ime_stranke,
                        lName: this.props.reservation.priimek_stranke,
                        duration: this.props.reservation.trajanje,
                        workDescription: this.props.reservation.delo,
                        phoneNumber: this.props.reservation.tel_st,
                        reservation_date: this.props.reservation.datum,
                        service_id: this.props.reservation.id_storitev
                    })
                }}>
                    <TextField id="create_reservation_fname" defaultValue={this.props.reservation.ime_stranke || ''} label={this.props.t("reservations.newReservation.firstName")} variant="outlined" onChange={
                        (e) => {
                            this.setState({ fName: e.target.value });
                        }} />
                    <TextField id="create_reservation_lname" defaultValue={this.props.reservation.priimek_stranke || ''} label={this.props.t("reservations.newReservation.lastName")} variant="outlined" onChange={
                        (e) => {
                            this.setState({ lName: e.target.value });
                        }} />
                    <TextField id="create_reservation_phone_number" defaultValue={this.props.reservation.tel_st || ''} label={this.props.t("reservations.newReservation.phoneNumber")} variant="outlined" onChange={
                        (e) => {
                            this.setState({ phoneNumber: e.target.value });
                        }} />
                    <Select
                        id="create_reservation_service_id"
                        label="Service"
                        variant="outlined"
                        value={this.state.service_id}
                        onChange={this.handleDifferentServiceSelected}>
                        {ponudbe.map(storitev => (<MenuItem key={storitev.id} value={storitev.id}>{storitev.ime}</MenuItem>))}
                    </Select>
                    {/* <TextField id="create_reservation_service_id" label="Service ID" defaultValue={this.props.reservation.id_storitev || ''} variant="outlined" onChange={
                        (e) => {
                            this.setState({ service_id: e.target.value });
                        }} /> */}
                    <TextField id="create_reservation_duration" label={this.props.t("reservations.newReservation.duration")} variant="outlined" value={this.state.duration || ''} type="number" onChange={
                        (e) => {
                            this.setState({ duration: parseInt(e.target.value) });
                        }} />
                    <TextField id="create_reservation_description" multiline rows={3} label={this.props.t("reservations.newReservation.description")} defaultValue={this.props.reservation.delo || ''} variant="outlined" onChange={
                        (e) => {
                            this.setState({ workDescription: e.target.value });
                        }} />

                    <TextField id="create_reservation_date" required label={this.props.t("reservations.newReservation.time")} defaultValue={formatDateForDatePicker(this.props.reservation.datum)} type="datetime-local" variant="outlined"
                        InputLabelProps={{ shrink: true, }} onChange={
                            (e) => {
                                this.setState({ reservation_date: e.target.value });
                            }} />

                    <Button variant="contained" color="primary"
                        onClick={() => {

                            const reservation = {
                                ime_stranke: this.state.fName,
                                priimek_stranke: this.state.lName,
                                tel_st: this.state.phoneNumber,

                                id_storitev: this.state.service_id,
                                id_podjetje: this.props.reservation.id_podjetje,
                                datum: this.state.reservation_date,
                                trajanje: this.state.duration,
                                delo: this.state.workDescription
                            }
                            ReservationService.update_rezervacija(this.props.company_id, this.props.reservation._id, reservation).then((response) => {
                                this.props.refreshReservations();
                                this.props.changeSnackBarState(this.props.t("reservations.newReservation.updateReservationSuccess"));
                                this.props.closeEditReservationDialog();
                            }).catch((err, body) => {
                                console.log(err);
                            });
                        }} >{this.props.t("reservations.newReservation.update")}</Button>

                </Dialog>
            </div>
        )
    }
}

export default withTranslation()(EditReservationDialogComponent)
