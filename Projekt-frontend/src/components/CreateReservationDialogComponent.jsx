import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ReservationService from '../services/ReservationService';

class CreateReservationDialogComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fName: "",
            lName: "",
            duration: 0,
            workDescription: "",
            phoneNumber: "",
            reservation_date: "",
            service_id: ""
        }
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

    render() {
        return (
            <div>
                <Dialog className="dialog_add_new_reservation" onClose={this.props.closeDialog} open={this.props.isShowing} >
                    <TextField id="create_reservation_fname" label="First name" variant="outlined" onChange={
                        (e) => {
                            this.setState({ fName: e.target.value });
                        }

                    } />
                    <TextField id="create_reservation_lname" required label="Last name" variant="outlined" onChange={
                        (e) => {
                            this.setState({ lName: e.target.value });
                        }} />
                    <TextField id="create_reservation_phone_number" label="Phone number" variant="outlined" onChange={
                        (e) => {
                            this.setState({ phoneNumber: e.target.value });
                        }} />
                    <TextField id="create_reservation_service_id" label="Service ID" variant="outlined" onChange={
                        (e) => {
                            this.setState({ service_id: e.target.value });
                        }} />
                    <TextField id="create_reservation_duration" label="Duration" variant="outlined" type="number" onChange={
                        (e) => {
                            this.setState({ duration: parseInt(e.target.value) });
                        }} />
                    <TextField id="create_reservation_description" multiline rows={3} label="Description" variant="outlined" onChange={
                        (e) => {
                            this.setState({ workDescription: e.target.value });
                        }} />

                    <TextField id="create_reservation_date" required label="Time" type="datetime-local" variant="outlined"
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
                                id_podjetje: this.props.user.company_id,
                                datum: this.state.reservation_date,
                                trajanje: this.state.duration,
                                delo: this.state.workDescription
                            }
                            ReservationService.add_new_rezervacija(this.props.user.company_id, reservation).then( (response) => {
                                this.props.refreshReservations();
                                this.props.changeSnackBarState("Successfully added new reservation");
                                this.props.closeDialog();
                            }).catch( (err) => {
                                console.log(err);
                            });
                        }} >Add</Button>

                </Dialog>
            </div>
        )
    }
}

export default CreateReservationDialogComponent
