import React, { Component } from 'react'
import {
    Dialog,
    TextField,
    Button,
    Select,
    MenuItem,
    Slide,
    AppBar,
    Toolbar,
    FormControl,
    IconButton,
    Typography,
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
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

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleDifferentServiceSelected = this.handleDifferentServiceSelected.bind(this)

    }

    Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });


    handleDifferentServiceSelected(e) {
        this.setState({
            service_id: e.target.value,
            duration: this.props.storitev.ponudba.find(ponudba => ponudba.id === e.target.value).trajanje
        });
    }

    handleFormSubmit(e) {
        let numOfErrors = 0;

        if (this.state.fName === "") {
            numOfErrors += 1;
        }
        if (this.state.lName === "") {
            numOfErrors += 1;

        }
        if (this.state.reservation_date === "") {
            numOfErrors += 1;

        }
        if (this.state.duration === "") {
            numOfErrors += 1;

        }
        if (numOfErrors !== 0) {
            this.props.changeSnackBarState(this.props.t("reservations.newReservation.updateReservationError"), "error");
            return;
        }

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
            this.props.changeSnackBarState(this.props.t("reservations.newReservation.updateReservationSuccess", "success"));
            this.props.closeEditReservationDialog();
        }).catch((err, body) => {
            console.log(err);
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
                <Dialog fullScreen className="dialog_edit_reservation" onClose={this.props.closeEditReservationDialog} open={this.props.isEditReservationShowing} TransitionComponent={this.Transition}
                    onEnter={() => {
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

                    <AppBar className="createReservation-toolbar">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={this.props.closeEditReservationDialog} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" >
                                {this.props.t("reservations.newReservation.title")}
                            </Typography>
                            <Button autoFocus color="inherit" className="createReservation-add-btn" onClick={this.handleFormSubmit}>
                                {this.props.t("reservations.newReservation.update")}
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <FormControl className="createReservation-formControl" variant="outlined">
                        <TextField required className="createReservation-textField" id="create_reservation_fname" defaultValue={this.props.reservation.ime_stranke || ''} label={this.props.t("reservations.newReservation.firstName")} variant="outlined" onChange={
                            (e) => {
                                this.setState({ fName: e.target.value });
                            }} />
                        <TextField required className="createReservation-textField" id="create_reservation_lname" defaultValue={this.props.reservation.priimek_stranke || ''} label={this.props.t("reservations.newReservation.lastName")} variant="outlined" onChange={
                            (e) => {
                                this.setState({ lName: e.target.value });
                            }} />
                        <TextField required className="createReservation-textField" id="create_reservation_phone_number" defaultValue={this.props.reservation.tel_st || ''} label={this.props.t("reservations.newReservation.phoneNumber")} variant="outlined" onChange={
                            (e) => {
                                this.setState({ phoneNumber: e.target.value });
                            }} />
                        <Typography className="createReservation-textField">{this.props.t("reservations.newReservation.selectType")}</Typography>
                        <Select
                            required
                            id="create_reservation_service_id"
                            variant="outlined"
                            value={this.state.service_id}
                            onChange={this.handleDifferentServiceSelected}>
                            {ponudbe.map(storitev => (<MenuItem key={storitev.id} value={storitev.id}>{storitev.ime}</MenuItem>))}
                        </Select>
                        {/* <TextField id="create_reservation_service_id" label="Service ID" defaultValue={this.props.reservation.id_storitev || ''} variant="outlined" onChange={
                        (e) => {
                            this.setState({ service_id: e.target.value });
                        }} /> */}
                        <TextField required className="createReservation-textField" id="create_reservation_duration" label={this.props.t("reservations.newReservation.duration")} variant="outlined" value={this.state.duration || ''} type="number" onChange={
                            (e) => {
                                this.setState({ duration: parseInt(e.target.value) });
                            }} />
                        <TextField className="createReservation-textField" id="create_reservation_description" multiline rows={3} label={this.props.t("reservations.newReservation.description")} defaultValue={this.props.reservation.delo || ''} variant="outlined" onChange={
                            (e) => {
                                this.setState({ workDescription: e.target.value });
                            }} />

                        <TextField required className="createReservation-textField" id="create_reservation_date" required label={this.props.t("reservations.newReservation.time")} defaultValue={formatDateForDatePicker(this.props.reservation.datum)} type="datetime-local" variant="outlined"
                            InputLabelProps={{ shrink: true, }} onChange={
                                (e) => {
                                    this.setState({ reservation_date: e.target.value });
                                }} />

                        {/* <Button variant="contained" color="primary"
                            onClick={this.handleFormSubmit} >{this.props.t("reservations.newReservation.update")}</Button> */}
                    </FormControl>
                </Dialog>
            </div>
        )
    }
}

export default withTranslation()(EditReservationDialogComponent)
