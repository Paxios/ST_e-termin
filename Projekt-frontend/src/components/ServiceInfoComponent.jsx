import React, { Component, useState } from 'react'
import ReservationService from '../services/ReservationService';
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

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

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
    constructor(props) {
        super(props)

        this.state = {
            selectedDate: new Date(),
            reservations: [],
            user: JSON.parse(sessionStorage.getItem("user"))
        }
    }

    componentDidMount() {
        this.loadRezervacije(this.state.selectedDate);

        this.interval = setInterval(() => {
            this.loadRezervacije(this.state.selectedDate);
        }, REFRESH_TIME);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    loadRezervacije = (date) => {
        ReservationService.timeline_loadRezervacije(this, date);
    }

    handleDateChange = (e) => {
        this.setState({ selectedDate: e })
        this.loadRezervacije(e)
    }

    render() {
        var isThereWork = false;
        if (this.state.reservations.length !== 0)
            isThereWork = true;

        return (
            <div>
                <div className="timeline-datepicker">
                    <Typography variant="h5">Information about your service</Typography>
                    <br />
                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker

                            margin="normal"
                            id="date-picker-dialog"
                            label="Pick the date"
                            format="MM/dd/yyyy"
                            value={this.state.selectedDate}
                            onChange={this.handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider> */}
                    <MapContainer center={[46.5604847, 15.6346753]} zoom={15} scrollWheelZoom={true} style={{ "height": "400px", "width": "100%" }}>
                        <TileLayer
                            attribution='Simply press on the map to select current location'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker />
                    </MapContainer>

                    <InfoForm />
                </div>

            </div>
        )
    }
}

function InfoForm() {
    const classes = useStyles();

    return (<form className={classes.root} noValidate autoComplete="off">
        <br />
        <TextField id="ime" label="Ime podjetja" variant="outlined" />
        <TextField id="naslov" label="Naslov" variant="outlined" />
        <br />
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="outlined-type-native-simple">Tip storitve</InputLabel>
            <Select
                label="Tip storitve"
                inputProps={{
                    name: 'tip',
                    id: 'outlined-type-native-simple',
                }}
            >
                <MenuItem value={'Frizerstvo'}>Frizerstvo</MenuItem>
                <MenuItem value={'Maserstvo'}>Maserstvo</MenuItem>
                <MenuItem value={'Avtomehanika'}>Avtomehanika</MenuItem>
                <MenuItem value={'Vulkanizerstvo'}>Vulkanizerstvo</MenuItem>
            </Select>
            <FormHelperText>Izberite vašo primarno aktivnost ukvarjanja</FormHelperText>
        </FormControl>
        <br />
        <TextField id="opis" label="Opis dejavnosti" variant="outlined" multiline fullWidth style={{ margin: 8 }} rows="6" />

        <br />
        <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.formControl}
            startIcon={<SaveIcon />}
        >
            Update info
      </Button>
    </form>)
}

function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

export default ServiceInfoComponent
