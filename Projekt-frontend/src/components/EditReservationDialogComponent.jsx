import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ReservationService from '../services/ReservationService';
import {formatDateForDatePicker} from '../Utils'

class EditReservationDialogComponent extends Component {
    constructor(props) {
        super(props)
        // this.updateInitalState = this.updateInitalState.bind(this);


        this.state = {
            _id: "",
            fName: "",
            lName: "",
            duration: 0,
            workDescription: "",
            phoneNumber: "",
            reservation_date: "",
            service_id: ""
        }

    }

    render() {
        return (
            <div>
                <Dialog className="dialog_edit_reservation" onClose={this.props.closeEditReservationDialog} open={this.props.isEditReservationShowing} onEnter={() => {
                    this.setState({
                        fName:this.props.reservation.ime_stranke,
                        lName: this.props.reservation.priimek_stranke,
                        duration:this.props.reservation.trajanje,
                        workDescription:this.props.reservation.delo,
                        phoneNumber:this.props.reservation.tel_st,
                        reservation_date:this.props.reservation.datum,
                        service_id:this.props.reservation.id_storitev
                    })
                }}>
                    <TextField id="create_reservation_fname" defaultValue={this.props.reservation.ime_stranke || ''} label="First name" variant="outlined" onChange={
                        (e) => {
                            this.setState({ fName: e.target.value });
                        }} />
                    <TextField id="create_reservation_lname" defaultValue={this.props.reservation.priimek_stranke || ''} label="Last name" variant="outlined" onChange={
                        (e) => {
                            this.setState({ lName: e.target.value });
                        }} />
                    <TextField id="create_reservation_phone_number" defaultValue={this.props.reservation.tel_st || ''} label="Phone number" variant="outlined" onChange={
                        (e) => {
                            this.setState({ phoneNumber: e.target.value });
                        }} />
                    <TextField id="create_reservation_service_id" label="Service ID" defaultValue={this.props.reservation.id_storitev || ''} variant="outlined" onChange={
                        (e) => {
                            this.setState({ service_id: e.target.value });
                        }} />
                    <TextField id="create_reservation_duration" label="Duration" variant="outlined" defaultValue={this.props.reservation.trajanje || ''} type="number" onChange={
                        (e) => {
                            this.setState({ duration: parseInt(e.target.value) });
                        }} />
                    <TextField id="create_reservation_description" multiline rows={3} label="Description" defaultValue={this.props.reservation.delo || ''} variant="outlined" onChange={
                        (e) => {
                            this.setState({ workDescription: e.target.value });
                        }} />

                    <TextField id="create_reservation_date" required label="Time" defaultValue={formatDateForDatePicker(this.props.reservation.datum) } type="datetime-local" variant="outlined"
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
                            ReservationService.update_rezervacija(this.props.company_id,this.props.reservation._id, reservation).then((response) => {
                                console.log(response);
                                this.props.refreshReservations();
                                this.props.changeSnackBarState("Successfully updated reservation");
                                this.props.closeEditReservationDialog();
                            }).catch((err, body) => {
                                console.log(err);
                            });
                        }} >Update</Button>

                </Dialog>
            </div>
        )
    }
}

export default EditReservationDialogComponent
