import React, { Component, useState, useContext, useEffect, number, setState } from 'react'
import { formatTime } from '../Utils';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { REFRESH_TIME } from '../Constants'
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { makeStyles } from '@material-ui/core/styles';
import AuthContext from "../context/AuthContext";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import ServicesService from '../services/ServicesService';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { withTranslation, useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '50ch',
        },
    },
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
}));

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
            currentPosition: [0, 0]
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
                this.state.initialPosition[0] = this.state.storitev.lokacija.x;
                this.state.initialPosition[1] = this.state.storitev.lokacija.y;
            },
            1000
        );
        //console.log(this.state)
    }

    saveMarkers = (newMarkerCoords) => {
        const selectedPosition = newMarkerCoords;
        this.setState((prevState) => ({ ...prevState, selectedPosition }));
    };

    render() {
        const { t, i18n } = this.props
        return (
            <div>
                <div className="timeline-datepicker">
                    <Typography variant="h5">{t("services.serviceInfo.title")}</Typography>
                    <br />
                    <MapContainer center={[46.5604847, 15.6346753]} zoom={15} scrollWheelZoom={true} style={{ "height": "400px", "width": "100%" }}>
                        <TileLayer
                            attribution='Simply press on the map to select current location'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MyMarker saveMarkers={this.saveMarkers} initialPosition={this.state.initialPosition} currentPosition={this.state.currentPosition} selectedPosition={this.state.selectedPosition} />
                    </MapContainer>

                    <InfoForm storitev={this.state.storitev} pos={this.state.selectedPosition} changeSnackbarState={this.changeStateSnackbar} />
                </div>

                <Snackbar anchorOrigin={{ "vertical": "bottom", "horizontal": "center" }} autoHideDuration={2000} onClose={this.changeStateSnackbar} open={this.state.openSnackbar}>
                    <Alert onClose={this.changeStateSnackbar} severity="success">
                        {this.state.snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}

function InfoForm(props) {
    const classes = useStyles();

    const { t } = useTranslation();
    return (<form className={classes.root} noValidate autoComplete="off">
        <br />
        <TextField id="ime" label={t("services.serviceInfo.serviceName")} variant="outlined" key={`imeStoritve:${props.storitev.ime || ''}`} defaultValue={props.storitev.ime || ''} onChange={(e) => { props.storitev.ime = e.target.value }} />
        <TextField id="naslov" label={t("services.serviceInfo.serviceAddress")} variant="outlined" key={`naslovStoritve:${props.storitev.naslov || ''}`} defaultValue={props.storitev.naslov || ''} onChange={(e) => { props.storitev.naslov = e.target.value }} />
        <br />
        <FormControl variant="outlined" className={classes.formControl}>
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
        <br />
        <TextField id="opis" key={`opisStoritve:${props.storitev.opis || ''}`} defaultValue={props.storitev.opis || ''} onChange={(e) => { props.storitev.opis = e.target.value }} label={t("services.serviceInfo.serviceDescription")} variant="outlined" multiline fullWidth style={{ margin: 8 }} rows="6" />

        <br />
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
    </form>)
}

function MyMarker(props) {
    console.log(props)
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
            if(props.selectedPosition[0]!=0&&props.selectedPosition[1]!=0)
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
    return null;
}

export default withTranslation()(ServiceInfoComponent)
