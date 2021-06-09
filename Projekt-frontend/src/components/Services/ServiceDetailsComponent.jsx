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
import ConnectionContext from "../../context/ConnectionContext";
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
import AddIcon from '@material-ui/icons/Add';
import { forwardRef } from 'react';
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import ServiceEmployeeComponent from './ServiceEmployeeComponent'
import ServiceOfferComponent from './ServiceOfferComponent'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    }
}));

function ServiceDetailsComponent({ }) {
    const classes = useStyles();
    const { t } = useTranslation();
    const Auth = useContext(AuthContext);
    const Connection = useContext(ConnectionContext);

    return (
        // <div style={{ backgroundColor: '#F4F5F7', width: '100%', paddingLeft: '20px', paddingRight: '20px' }}>
        <Grid container spacing={1}>
            <Grid item xs={12} className="timeline-datepicker" style={{ padding: '15px', backgroundColor: '#F4F5F7' }}>
                <ServiceEmployeeComponent></ServiceEmployeeComponent>
            </Grid>
            <Grid item xs={12} className="timeline-datepicker" style={{ padding: '15px', backgroundColor: '#F4F5F7' }}>
                <ServiceOfferComponent></ServiceOfferComponent>
            </Grid>
        </Grid>
        //</div>
    );
}

export default ServiceDetailsComponent
