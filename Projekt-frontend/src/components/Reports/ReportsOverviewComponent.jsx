import React, { useState, useEffect, useContext } from 'react'
import {
    Dialog,
    Grid,
    makeStyles,
    Typography,
    TextField,
    Button,
    ListItemText,
    ListItem,
    List,
    Divider,
    AppBar,
    Toolbar,
    IconButton,
    Slide,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Collapse,
    Container,
    ListItemAvatar,
    Avatar,
    ListItemSecondaryAction,
    Fab
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from "react-i18next";
import AuthContext from "../../context/AuthContext";
import ServicesService from '../../services/ServicesService';
import ReceiptsServiceService from '../../services/ReceiptsService';
import ReceiptsService from '../../services/ReceiptsService';
import Alert from '@material-ui/lab/Alert';
import ReservationService from '../../services/ReservationService';
import { DataGrid } from '@material-ui/data-grid';
import ReceiptIcon from '@material-ui/icons/Receipt';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple';
import moment from "moment";
import 'moment/lang/sl';
import { saveAs } from 'file-saver';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    title: {
        marginLeft: '10px',
        marginTop: '15px'
    },
    fab: {
        position: 'fixed',
        bottom: '25px',
        right: '25px'
    }
}));

function ReportsOverviewComponent({ }) {
    const classes = useStyles();
    const { t } = useTranslation();
    const Auth = useContext(AuthContext);

    const [errorAlertOpen, setErrorAlertOpen] = useState(false);

    useEffect(() => {

    }, []);

    const downloadReport = () => {
        var id = Auth.user.company_id;
        console.log(Auth.user);
        axios({
            method: 'GET',
            url: 'http://localhost:3000/porocilo/' + id,
            responseType: 'blob',
            headers: {
                Authorization: Auth.user.jwt,
                Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                responseType: 'blob',
            }
        })
            .then((result) => {
                console.log(result);
                const blob = new Blob([result.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                console.log(blob);
                saveAs(blob, "report.xlsx")
            })
    }

    const errorAlert = (
        <Collapse in={errorAlertOpen}>
            <Alert
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        className={classes.closeAlertButton}
                        onClick={() => {
                            setErrorAlertOpen(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                severity="error"
                style={{ border: "solid 1px rgb(255, 224, 220)" }}
            >
                {t("reservations.confirmReservationDialog.error")}
            </Alert>
        </Collapse>
    );


    return (
        <div>
            <button onClick={downloadReport}>Download report</button>
        </div >
    );
}

export default ReportsOverviewComponent
