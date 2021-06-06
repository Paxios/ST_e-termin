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
import ServicesService from '../services/ServicesService';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from "react-i18next";

var isOnline = navigator.onLine;

const povezava = () => {
    isOnline = true;
}

const niPovezave = () => {
    isOnline = false;
}

window.addEventListener("online", povezava, false);
window.addEventListener("offline", niPovezave, false);

class ServicesListComponent extends Component {
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
                <ServiceElements refreshServices={this.props.refreshServices} changeEditServiceData={this.props.changeEditServiceData} services={this.props.services} changeSnackbarState={this.changeStateSnackbar} />
                <Snackbar anchorOrigin={{ "vertical": "bottom", "horizontal": "center" }} autoHideDuration={2000} onClose={this.changeStateSnackbar} open={this.state.openSnackbar}>
                    <Alert onClose={this.changeStateSnackbar} severity="success">
                        {this.state.snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        )
    }

}


function ServiceElements(props) {
    const res = props.services;
    const forReturn = res.map((service) =>
        <ServiceElement key={service._id} refreshServices={props.refreshServices} changeEditServiceData={props.changeEditServiceData} changeSnackbarState={props.changeSnackbarState} service={service} />
    )
    return (<ul style={{ "padding": "0px" }}>{forReturn}</ul>);
}

const useStyles = makeStyles({
    table: {
        minWidth: 250,
    },
});

function ServiceElement(props) {
    const service = props.service;
    const classes = useStyles();
    const { t } = useTranslation();
    return (
        <div id={service._id}>
            <br />
            <Card className="reservation_card_element" >
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Typography className="reservation-service" variant="h6" color="textPrimary">{service.ime}
                                {isOnline ?
                                    <div>
                                        {/* <IconButton className="complete-reservation" aria-label="complete" onClick={() => {
                                ReservationService.delete_rezervacija(reservation._id).then((response) => {
                                    console.log(response);
                                    props.refreshReservations();
                                    props.changeSnackbarState("Successfully marked reservation as completed.");
                                }).catch(error => {
                                    console.log(error)
                                })

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

                            }} ><DeleteIcon color="secondary" /></IconButton> */}
                                    </div>
                                    : <div></div>}

                            </Typography>
                            <Typography className="reservation-date" variant="h6" color="textSecondary">{service.tip}</Typography>
                            <Typography className="reservation-name" color="textPrimary">{`${service.naslov}`}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField className="reservation-description" multiline InputProps={{ readOnly: false }} value={service.opis} variant="outlined" />
                        </Grid>
                    </Grid>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("services.serviceOverview.name")}</TableCell>
                                    <TableCell align="right">{t("services.serviceOverview.phone")}&nbsp;</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {service.zaposleni.map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.naziv}
                                        </TableCell>
                                        <TableCell align="right">{row.telefon}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <br />
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>{t("services.serviceOverview.workingHours")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{t("services.serviceOverview.monday")}</TableCell>
                                            <TableCell>{t("services.serviceOverview.tuesday")}&nbsp;</TableCell>
                                            <TableCell>{t("services.serviceOverview.wednesday")}&nbsp;</TableCell>
                                            <TableCell>{t("services.serviceOverview.thursday")}&nbsp;</TableCell>
                                            <TableCell>{t("services.serviceOverview.friday")}&nbsp;</TableCell>
                                            <TableCell>{t("services.serviceOverview.saturday")}&nbsp;</TableCell>
                                            <TableCell>{t("services.serviceOverview.sunday")}&nbsp;</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow key={service._id}>
                                            <TableCell component="th" scope="row">
                                                {service.delovniCas.pon.zacetek} - {service.delovniCas.pon.konec}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {service.delovniCas.tor.zacetek} - {service.delovniCas.tor.konec}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {service.delovniCas.sre.zacetek} - {service.delovniCas.sre.konec}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {service.delovniCas.cet.zacetek} - {service.delovniCas.cet.konec}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {service.delovniCas.pet.zacetek} - {service.delovniCas.pet.konec}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {service.delovniCas.sob.zacetek} - {service.delovniCas.sob.konec}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {service.delovniCas.ned.zacetek} - {service.delovniCas.ned.konec}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}

export default ServicesListComponent
