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
    ListItemSecondaryAction
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
import PrintReceiptDialog from "./PrintReceiptDialog";

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
    }
}));

function ReceiptsOverviewComponent({ }) {
    const classes = useStyles();
    const { t } = useTranslation();
    const Auth = useContext(AuthContext);

    const [errorAlertOpen, setErrorAlertOpen] = useState(false);
    const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
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

    const handleCellClick = params => {
        if (params.field === "details") {
            console.log("details");
        }
        else if (params.field === "print") {
            console.log("print");
        }
    };
    const receiptClick = (id) => {
        setReceiptId(id);
        setPdfDialogOpen(true);
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
                                <ListItem button>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ReceiptIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={receipt.cena}
                                        secondary={`${receipt.ime_stranke} ${receipt.priimek_stranke} • ${moment(receipt.datum).format('ll')}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete" onClick={() => receiptClick(receipt._id)}>
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
                <PrintReceiptDialog
                    isOpen={pdfDialogOpen}
                    closeDialog={() => setPdfDialogOpen(false)}
                    receiptId={receiptId}
                />
            ) : ('')}

        </div >
    );
}

export default ReceiptsOverviewComponent
