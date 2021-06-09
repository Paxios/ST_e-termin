import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import SaveIcon from '@material-ui/icons/Save';
import L from 'leaflet';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AuthContext from "../../context/AuthContext";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import ServicesService from '../../services/ServicesService';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
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
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import Input from '@material-ui/core/Input';
import { withTranslation, useTranslation } from "react-i18next";
import { Card, CardHeader, CardMedia, Divider, Grid, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    textInput: {
        marginBottom: '20px',
        width: '100%'
    }
}));

const styles = theme => ({
    table: {
        minWidth: 250,
    },
});

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

class ServiceInfoComponent extends Component {
    static contextType = AuthContext
    constructor(props) {
        super(props)

        this.state = {
            storitev: {},
            user: JSON.parse(sessionStorage.getItem("user")),
            openSnackbar: false,
            snackbarMessage: "",
            selectedPosition: [0, 0],
            initialPosition: [0, 0],
            currentPosition: [0, 0],
            workingHours: {
                mon: "",
                tue: "",
                wed: "",
                thu: "",
                fri: "",
                sat: "",
                sun: "",
            }
        }
    }

    changeStateSnackbar = (message) => {
        this.setState({
            snackbarMessage: message,
            openSnackbar: !this.state.openSnackbar
        })
    }

    componentDidMount() {
        this.loadService();

        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            this.state.currentPosition = [latitude, longitude];
        });
    }

    loadService = () => {
        var podjetjeId = this.context.user.company_id;
        ServicesService.info_loadStoritev(this, podjetjeId);
        setTimeout(
            () => {
                this.state.initialPosition[0] = this.state.storitev.lokacija?.x;
                this.state.initialPosition[1] = this.state.storitev.lokacija?.y;
            },
            1000
        );
        //console.log(this.state)
    }

    saveMarkers = (newMarkerCoords) => {
        const selectedPosition = newMarkerCoords;
        this.setState((prevState) => ({ ...prevState, selectedPosition }));
    };
    updateWorkingHours = (e) => {
        e.preventDefault();
        var ure = {
            pon: {
                zacetek: e.target.ponZacetek.value,
                konec: e.target.ponKonec.value
            },
            tor: {
                zacetek: e.target.torZacetek.value,
                konec: e.target.torKonec.value
            },
            sre: {
                zacetek: e.target.sreZacetek.value,
                konec: e.target.sreKonec.value
            },
            cet: {
                zacetek: e.target.cetZacetek.value,
                konec: e.target.cetKonec.value
            },
            pet: {
                zacetek: e.target.petZacetek.value,
                konec: e.target.petKonec.value
            },
            sob: {
                zacetek: e.target.sobZacetek.value,
                konec: e.target.sobKonec.value
            },
            ned: {
                zacetek: e.target.nedZacetek.value,
                konec: e.target.nedKonec.value
            },
        };
        console.log(ure);
        ServicesService.update_delovni_cas(this.context.user.company_id, ure)
            .then((response) => {

            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        const { t, i18n } = this.props
        var service = this.state.storitev
        const { classes } = this.props;
        return (
            <Grid container>
                <Grid item xs={12} className="timeline-datepicker" style={{ padding: '15px', backgroundColor: '#F4F5F7' }}>
                    <Card>
                        <CardHeader
                            title={t("services.serviceInfo.title")}
                        />
                        <CardMedia>
                            <MapContainer center={[46.5604847, 15.6346753]} zoom={14} scrollWheelZoom={true} style={{ "height": "400px", "width": "100%" }}>
                                <TileLayer
                                    attribution={t("services.serviceInfo.mapInfo")}
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MyMarker saveMarkers={this.saveMarkers} initialPosition={this.state.initialPosition} currentPosition={this.state.currentPosition} selectedPosition={this.state.selectedPosition} />
                            </MapContainer>
                        </CardMedia>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12} lg={8}>
                                    <Typography variant="h5" className={classes.heading}>{t("services.serviceInfo.inviteCode")}</Typography>
                                    {service.inviteCode}
                                </Grid>
                                <Grid item xs={12} style={{marginTop: '25px', marginBottom: '30px'}}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12} lg={8}>
                                    <InfoForm storitev={this.state.storitev} pos={this.state.selectedPosition} changeSnackbarState={this.changeStateSnackbar} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <br />
                    <Grid container justify="center">
                        <Grid item>
                            <form onSubmit={this.updateWorkingHours}>
                                <Card>
                                    <TableContainer component={Paper}>
                                        <Table className={classes.table} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Dan</TableCell>
                                                    <TableCell>Od</TableCell>
                                                    <TableCell>Do</TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow key={service._id}>
                                                    <TableCell component="th" scope="row">
                                                        {t("services.serviceOverview.monday")}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input id="ponZacetek" inputComponent={TextMaskHour} key={`ponZacetek:${service.delovniCas?.pon?.zacetek || ''}`} defaultValue={service.delovniCas?.pon?.zacetek || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                        {/* {service.delovniCas?.pon?.zacetek} - {service.delovniCas?.pon?.konec} */}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input id="ponKonec" inputComponent={TextMaskHour} key={`ponKonec:${service.delovniCas?.pon?.konec || ''}`} defaultValue={service.delovniCas?.pon?.konec || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow key={service._id}>
                                                    <TableCell component="th" scope="row">
                                                        {t("services.serviceOverview.tuesday")}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input id="torZacetek" inputComponent={TextMaskHour} key={`torZacetek:${service.delovniCas?.tor?.zacetek || ''}`} defaultValue={service.delovniCas?.tor?.zacetek || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                        {/* {service.delovniCas?.pon?.zacetek} - {service.delovniCas?.pon?.konec} */}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input variant="outlined" id="torKonec" inputComponent={TextMaskHour} key={`torKonec:${service.delovniCas?.tor?.konec || ''}`} defaultValue={service.delovniCas?.tor?.konec || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow key={service._id}>
                                                    <TableCell component="th" scope="row">
                                                        {t("services.serviceOverview.wednesday")}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input id="sreZacetek" inputComponent={TextMaskHour} key={`sreZacetek:${service.delovniCas?.sre?.zacetek || ''}`} defaultValue={service.delovniCas?.sre?.zacetek || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                        {/* {service.delovniCas?.pon?.zacetek} - {service.delovniCas?.pon?.konec} */}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input id="sreKonec" inputComponent={TextMaskHour} key={`sreKonec:${service.delovniCas?.sre?.konec || ''}`} defaultValue={service.delovniCas?.sre?.konec || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow key={service._id}>
                                                    <TableCell component="th" scope="row">
                                                        {t("services.serviceOverview.thursday")}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input id="cetZacetek" inputComponent={TextMaskHour} key={`cetZacetek:${service.delovniCas?.cet?.zacetek || ''}`} defaultValue={service.delovniCas?.cet?.zacetek || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                        {/* {service.delovniCas?.pon?.zacetek} - {service.delovniCas?.pon?.konec} */}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input id="cetKonec" inputComponent={TextMaskHour} key={`cetKonec:${service.delovniCas?.cet?.konec || ''}`} defaultValue={service.delovniCas?.cet?.konec || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow key={service._id}>
                                                    <TableCell component="th" scope="row">
                                                        {t("services.serviceOverview.friday")}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input id="petZacetek" inputComponent={TextMaskHour} key={`petZacetek:${service.delovniCas?.pet?.zacetek || ''}`} defaultValue={service.delovniCas?.pet?.zacetek || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                        {/* {service.delovniCas?.pon?.zacetek} - {service.delovniCas?.pon?.konec} */}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input id="petKonec" inputComponent={TextMaskHour} key={`petKonec:${service.delovniCas?.pet?.konec || ''}`} defaultValue={service.delovniCas?.pet?.konec || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow key={service._id}>
                                                    <TableCell component="th" scope="row">
                                                        {t("services.serviceOverview.saturday")}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input id="sobZacetek" inputComponent={TextMaskHour} key={`sobZacetek:${service.delovniCas?.sob?.zacetek || ''}`} defaultValue={service.delovniCas?.sob?.zacetek || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                        {/* {service.delovniCas?.pon?.zacetek} - {service.delovniCas?.pon?.konec} */}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input id="sobKonec" inputComponent={TextMaskHour} key={`sobKonec:${service.delovniCas?.sob?.konec || ''}`} defaultValue={service.delovniCas?.sob?.konec || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow key={service._id}>
                                                    <TableCell component="th" scope="row">
                                                        {t("services.serviceOverview.sunday")}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input id="nedZacetek" inputComponent={TextMaskHour} key={`nedZacetek:${service.delovniCas?.ned?.zacetek || ''}`} defaultValue={service.delovniCas?.ned?.zacetek || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                        {/* {service.delovniCas?.pon?.zacetek} - {service.delovniCas?.pon?.konec} */}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Input id="nedKonec" inputComponent={TextMaskHour} key={`nedKonec:${service.delovniCas?.ned?.konec || ''}`} defaultValue={service.delovniCas?.ned?.konec || ''} onChange={(e) => { console.log(e.target.value) }} />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>
                                <br />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className={classes.formControl}
                                    startIcon={<SaveIcon />}
                                >
                                    {t("services.serviceInfo.saveWorkingHoursButton")}
                                </Button>
                            </form>
                        </Grid>

                        <br />
                    </Grid>

                    <Snackbar anchorOrigin={{ "vertical": "bottom", "horizontal": "center" }} autoHideDuration={2000} onClose={this.changeStateSnackbar} open={this.state.openSnackbar}>
                        <Alert onClose={this.changeStateSnackbar} severity="success">
                            {this.state.snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Grid>
            </Grid>
        )
    }
}

function TextMaskHour(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            // ref={(ref) => {
            //   inputRef(ref ? ref.inputElement : null);
            // }}
            mask={[/^([0-2])/, /([0-9])/, ":", /[0-5]/, /[0-9]/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

TextMaskHour.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

function InfoForm(props) {
    const classes = useStyles();

    const { t } = useTranslation();
    return (
        <form className={classes.root} noValidate autoComplete="off">
            <Grid container justify="center" style={{textAlign: 'center'}}>
                <Grid item xs={12}>
                    <TextField className={classes.textInput} id="ime" label={t("services.serviceInfo.serviceName")} variant="outlined" key={`imeStoritve:${props.storitev.ime || ''}`} defaultValue={props.storitev.ime || ''} onChange={(e) => { props.storitev.ime = e.target.value }} />
                </Grid>
                <Grid item xs={12}>
                    <TextField className={classes.textInput} id="naslov" label={t("services.serviceInfo.serviceAddress")} variant="outlined" key={`naslovStoritve:${props.storitev.naslov || ''}`} defaultValue={props.storitev.naslov || ''} onChange={(e) => { props.storitev.naslov = e.target.value }} />
                </Grid>
                <Grid item xs={12}>
                    <FormControl variant="outlined" className={classes.formControl} className={classes.textInput}>
                        <InputLabel htmlFor="outlined-type-native-simple">{t("services.serviceInfo.serviceType")}</InputLabel>
                        <Select
                            label="Tip storitve" key={`tipStoritve:${props.storitev.tip || ''}`} defaultValue={props.storitev.tip || ''}
                            onChange={(e) => { props.storitev.tip = e.target.value }}
                            inputProps={{
                                name: 'tip',
                                id: 'outlined-type-native-simple',
                            }}
                        >
                            <MenuItem value={'Frizerstvo'}>{t("services.serviceInfo.serviceTypeHairdressing")}</MenuItem>
                            <MenuItem value={'Maserstvo'}>{t("services.serviceInfo.serviceTypeMasseuse")}</MenuItem>
                            <MenuItem value={'Avtomehanika'}>{t("services.serviceInfo.serviceTypeMechanic")}</MenuItem>
                            <MenuItem value={'Vulkanizerstvo'}>{t("services.serviceInfo.serviceTypeVulcanizer")}</MenuItem>
                        </Select>
                        <FormHelperText>{t("services.serviceInfo.serviceTypeHelper")}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField className={classes.textInput} id="opis" key={`opisStoritve:${props.storitev.opis || ''}`} defaultValue={props.storitev.opis || ''} onChange={(e) => { props.storitev.opis = e.target.value }} label={t("services.serviceInfo.serviceDescription")} variant="outlined" multiline fullWidth rows="6" />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => {
                            console.log(props.storitev)
                            console.log(props.pos)
                            ServicesService.update_storitev(props.storitev._id, {
                                ime: props.storitev.ime,
                                naslov: props.storitev.naslov,
                                tip: props.storitev.tip,
                                opis: props.storitev.opis,
                                lokacija: {
                                    x: props.pos[0],
                                    y: props.pos[1]
                                }
                            });
                            props.changeSnackbarState("Successfully updated service information.");
                        }}
                        className={classes.formControl}
                        startIcon={<SaveIcon />}
                    >
                        {t("services.serviceInfo.saveButton")}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

function MyMarker(props) {
    const map = useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            var i = 0
            map.eachLayer((layer) => {
                if (i == 0)
                    i++
                else
                    layer.remove();
            });
            L.marker([lat, lng], { DefaultIcon }).addTo(map);
            props.saveMarkers([lat, lng]);
        },
        keydown: (e) => {
            var i = 0
            map.eachLayer((layer) => {
                if (i == 0)
                    i++
                else
                    layer.remove();
            });
            map.flyTo(props.initialPosition, map.getZoom());
            L.marker(props.initialPosition, { DefaultIcon }).addTo(map);
            props.saveMarkers(props.initialPosition);
        },
        mouseout: (e) => {
            if (props.selectedPosition[0] != 0 && props.selectedPosition[1] != 0)
                map.flyTo(props.selectedPosition, map.getZoom());
        },
        contextmenu: (e) => {
            var i = 0
            map.eachLayer((layer) => {
                if (i == 0)
                    i++
                else
                    layer.remove();
            });
            map.flyTo(props.currentPosition, map.getZoom());
            L.marker(props.currentPosition, { DefaultIcon }).addTo(map);
            props.saveMarkers(props.currentPosition);
        }
    });
    if (props.initialPosition[0] == 0 && props.initialPosition[1] == 0) {
        setTimeout(
            () => {
                map.flyTo(props.initialPosition, map.getZoom());
                L.marker(props.initialPosition, { DefaultIcon }).addTo(map);
            },
            1000
        );
    }
    return null;
}

export default withStyles(styles)(withTranslation()(ServiceInfoComponent))
