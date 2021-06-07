import React, { Component } from 'react'
import ReservationService from '../services/ReservationService';
import {
    Dialog,
    TextField,
    Button,
    Select,
    MenuItem,
} from "@material-ui/core";
import AuthContext from '../context/AuthContext';
import { withTranslation } from 'react-i18next';

class CreateReservationDialogComponent extends Component {
    static contextType = AuthContext

    constructor(props) {
        super(props)

        this.state = {
            fName: "",
            lName: "",
            duration: "",
            workDescription: "",
            phoneNumber: "",
            reservation_date: "",
            service_id: "",
        }

        this.handleDifferentServiceSelected = this.handleDifferentServiceSelected.bind(this)
    }

    getCurrentTime() {
        const today = new Date()
        var day = today.getDate()
        if (day < 10)
            day = "0" + day;

        var month = parseInt(today.getMonth() + 1)
        if (month < 10)
            month = "0" + month;

        var hours = today.getHours();
        if (hours < 10)
            hours = "0" + hours;

        var minutes = today.getMinutes();
        if (minutes < 10)
            minutes = "0" + minutes;

        const formatted_date = today.getFullYear() + "-" + month + "-" + day + "T" + hours + ":" + minutes;
        return formatted_date;
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
                <Dialog className="dialog_add_new_reservation" onClose={this.props.closeDialog} open={this.props.isShowing} >
                    <TextField id="create_reservation_fname" label={this.props.t("reservations.newReservation.firstName")} variant="outlined" onChange={
                        (e) => {
                            this.setState({ fName: e.target.value });
                        }

                    } />
                    <TextField id="create_reservation_lname" required label={this.props.t("reservations.newReservation.lastName")} variant="outlined" onChange={
                        (e) => {
                            this.setState({ lName: e.target.value });
                        }} />
                    <TextField id="create_reservation_phone_number" label={this.props.t("reservations.newReservation.phoneNumber")} variant="outlined" onChange={
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
                    {/* <TextField id="create_reservation_service_id" label="Service ID" variant="outlined" onChange={
                        (e) => {
                            this.setState({ service_id: e.target.value });
                        }} /> */}
                    <TextField id="create_reservation_duration" value={this.state.duration} label={this.props.t("reservations.newReservation.duration")} variant="outlined" type="number" onChange={
                        (e) => {
                            this.setState({ duration: parseInt(e.target.value) });
                        }} />
                    <TextField id="create_reservation_description" multiline rows={3} label={this.props.t("reservations.newReservation.description")} variant="outlined" onChange={
                        (e) => {
                            this.setState({ workDescription: e.target.value });
                        }} />

                    <TextField id="create_reservation_date" required label={this.props.t("reservations.newReservation.time")} type="datetime-local" variant="outlined"
                        InputLabelProps={{ shrink: true, }} defaultValue={this.getCurrentTime()} onChange={
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
                                id_podjetje: this.context.user.company_id,
                                datum: this.state.reservation_date,
                                trajanje: this.state.duration,
                                delo: this.state.workDescription
                            }
                            ReservationService.add_new_rezervacija(this.context.user.company_id, reservation).then((response) => {
                                this.props.refreshReservations();
                                this.props.changeSnackBarState(this.props.t("reservations.newReservation.addNewReservationSuccess"));
                                this.props.closeDialog();
                            }).catch((err) => {
                                console.log(err);
                            });
                        }} >{this.props.t("reservations.newReservation.add")}</Button>

                </Dialog>
            </div>
        )
    }
}

export default withTranslation()(CreateReservationDialogComponent)
