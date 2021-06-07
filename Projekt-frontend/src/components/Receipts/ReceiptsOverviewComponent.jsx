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
import PrintReceiptDialog from "./PrintReceiptDialog";
import AddReceiptDialog from './AddReceiptDialog';
import AddIcon from '@material-ui/icons/Add';

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

function ReceiptsOverviewComponent({ }) {
    const classes = useStyles();
    const { t } = useTranslation();
    const Auth = useContext(AuthContext);

    const [errorAlertOpen, setErrorAlertOpen] = useState(false);
    const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [receiptId, setReceiptId] = useState(null);
    const [receipts, setReceipts] = useState([]);


    useEffect(() => {
        var podjetjeId = Auth.user.company_id;
        ReceiptsService.get_all_receipts(podjetjeId)
            .then((result) => {
                console.log(result);
                setReceipts(result.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const receiptPrintClick = (id) => {
        setReceiptId(id);
        setPdfDialogOpen(true);
    }

    const receiptClick = (id) => {
        console.log("open" + id);
        setIsNew(false);
        setReceiptId(id);
        setDetailsDialogOpen(true);
    }

    const newReceipt = () => {
        setIsNew(true);
        setReceiptId(null);
        setDetailsDialogOpen(true);
    }

    const dodajRacun = (racun) => {
        var racuni = receipts.slice();
        racuni.push(racun);
        setReceipts(racuni);
    }

    const odstraniRacun = (id) => {
        console.log("odstrani");
        var racuni = receipts.slice();
        var index = racuni.findIndex((racun) => racun._id === id);
        console.log(index);
        racuni.splice(index, 1);
        console.log(racuni);
        setReceipts(racuni);
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
            <Grid container>
                <Grid item xs={12} >
                    <Typography variant="h6" className={classes.title}>
                        {t("receipts.title")}
                    </Typography>
                    <div className={classes.demo}>
                        <List dense={true}>
                            {receipts.map((receipt) => (
                                <ListItem button onClick={() => receiptClick(receipt._id)}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ReceiptIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={receipt.cena + '€'}
                                        secondary={`${receipt.ime_stranke} ${receipt.priimek_stranke} • ${moment(receipt.datum).format('ll')}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete" onClick={() => receiptPrintClick(receipt._id)}>
                                            <ReceiptIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Grid>
            </Grid>
            {receiptId ? (
                <>
                    <PrintReceiptDialog
                        isOpen={pdfDialogOpen}
                        closeDialog={() => setPdfDialogOpen(false)}
                        receiptId={receiptId}
                    />
                    <AddReceiptDialog
                        isOpen={detailsDialogOpen}
                        closeDialog={() => setDetailsDialogOpen(false)}
                        receiptId={receiptId}
                        isNew={false}
                        odstraniRacun={odstraniRacun}
                    />
                </>
            ) : (
            <AddReceiptDialog
                isOpen={detailsDialogOpen}
                closeDialog={() => setDetailsDialogOpen(false)}
                isNew={true}
                dodajRacun={dodajRacun}
            />)}

            <Fab color="primary" aria-label="add" className={classes.fab} onClick={newReceipt}>
                <AddIcon />
            </Fab>
        </div >
    );
}

export default ReceiptsOverviewComponent
