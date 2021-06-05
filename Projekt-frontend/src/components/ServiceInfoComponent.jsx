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
            initialPosition: [0, 0]
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
            this.initialPosition = [latitude, longitude];

        });
    }

    loadService = () => {
        var podjetjeId = this.context.user.company_id;
        ServicesService.info_loadStoritev(this, podjetjeId);
    }

    handleClick = (event) => {
        const { lat, lng } = event.latlng
        console.log(`Clicked at ${lat}, ${lng}`)
    }

    handleChange = e => this.setState({ item_msg: e.target.value });

    render() {
        return (
            <div>
                <div className="timeline-datepicker">
                    <Typography variant="h5">Information about your service</Typography>
                    <br />
                    <MapContainer center={[46.5604847, 15.6346753]} zoom={15} scrollWheelZoom={true} style={{ "height": "400px", "width": "100%" }}>
                        <TileLayer
                            attribution='Simply press on the map to select current location'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {/* <LocationMarker /> */}
                        <Markers selectedPosition={this.state.selectedPosition} onChange={this.handleChange} />
                    </MapContainer>

                    <InfoForm storitev={this.state.storitev} changeSnackbarState={this.changeStateSnackbar} />
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

    return (<form className={classes.root} noValidate autoComplete="off">
        <br />
        <TextField id="ime" label="Ime podjetja" variant="outlined" key={`imeStoritve:${props.storitev.ime || ''}`} defaultValue={props.storitev.ime || ''} onChange={(e) => { props.storitev.ime = e.target.value }} />
        <TextField id="naslov" label="Naslov" variant="outlined" key={`naslovStoritve:${props.storitev.naslov || ''}`} defaultValue={props.storitev.naslov || ''} onChange={(e) => { props.storitev.naslov = e.target.value }} />
        <br />
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="outlined-type-native-simple">Tip storitve</InputLabel>
            <Select
                label="Tip storitve" key={`tipStoritve:${props.storitev.tip || ''}`} defaultValue={props.storitev.tip || ''}
                onChange={(e) => { props.storitev.tip = e.target.value }}
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
        <TextField id="opis" key={`opisStoritve:${props.storitev.opis || ''}`} defaultValue={props.storitev.opis || ''} onChange={(e) => { props.storitev.opis = e.target.value }} label="Opis dejavnosti" variant="outlined" multiline fullWidth style={{ margin: 8 }} rows="6" />

        <br />
        <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
                console.log(props.storitev)
                ServicesService.update_storitev(props.storitev._id, {
                    ime: props.storitev.ime,
                    naslov: props.storitev.naslov,
                    tip: props.storitev.tip,
                    opis: props.storitev.opis,
                    lokacija: props.storitev.lokacija
                });
                props.changeSnackbarState("Successfully updated service information.");
            }}
            className={classes.formControl}
            startIcon={<SaveIcon />}
        >
            Update info
      </Button>
    </form>)
}

function Markers(props) {
    var selectedPosition = props.selectedPosition;

    const map = useMapEvents({
        click(e) {
            selectedPosition = [e.latlng.lat, e.latlng.lng]
            console.log(selectedPosition)
            //props.selectedPosition=selectedPosition
            console.log(props.selectedPosition)
            // this.setState({
            //     selectedPosition: selectedPosition
            // });
            //this.selectedPosition=selectedPosition
        },
    })

    return (
        selectedPosition ?
            <Marker
                key={selectedPosition[0]}
                position={selectedPosition}
                interactive={false}
                onChange={props.onChange}
            >
            </Marker>
            : null
    )

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
