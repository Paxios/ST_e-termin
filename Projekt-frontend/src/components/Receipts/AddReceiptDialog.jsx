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
    Collapse
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from "react-i18next";
import AuthContext from "../../context/AuthContext";
import ServicesService from '../../services/ServicesService';
import ReceiptsService from '../../services/ReceiptsService';
import Alert from '@material-ui/lab/Alert';
import ReservationService from '../../services/ReservationService';

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
        marginBottom: '25px'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 'auto',
    },
    textField: {
        marginTop: '10px'
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function AddReceiptDialog({ isOpen, closeDialog, dodajRacun, odstraniRacun, receiptId, isNew }) {
    const classes = useStyles();
    const { t } = useTranslation();
    const Auth = useContext(AuthContext);

    const [errorAlertOpen, setErrorAlertOpen] = useState(false);

    const [vsiZaposleni, setVsiZaposleni] = useState([]);
    const [storitve, setStoritve] = useState([]);

    const [storitevId, setStoritevId] = useState(null);
    const [imeStranka, setImeStranka] = useState("");
    const [priimekStranka, setPriimekStranka] = useState("");
    const [opomba, setOpomba] = useState("");
    const [cena, setCena] = useState("");
    const [izbraniZaposleni, setIzbraniZaposleni] = useState("");
    const [disabled, setDisabled] = useState(false);

    const handleClose = () => {
        setStoritevId(null);
        setImeStranka("");
        setPriimekStranka("");
        setOpomba("");
        setIzbraniZaposleni("");
        setDisabled(false);
        closeDialog();
    };

    useEffect(() => {
        if(!isNew){
            setDisabled(true);
            ReceiptsService.get_receipt_full(receiptId)
                .then((result) => {
                    var receipt = result.data;
                    setVsiZaposleni(receipt.podjetje.zaposleni);
                    setStoritve(receipt.podjetje.ponudba);
                    setStoritevId(receipt.storitev.id);
                    setImeStranka(receipt.ime_stranke);
                    setPriimekStranka(receipt.priimek_stranke);
                    setOpomba(receipt.opomba);
                    setCena(receipt.cena);
                    setIzbraniZaposleni(receipt.zaposleni);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        else{
            setDisabled(false);
            var podjetjeId = Auth.user.company_id;
            ServicesService.storitev_by_company_id(podjetjeId)
            .then((result) => {
                var storitev = result.data;
                if (storitev !== undefined) {
                    setStoritve(storitev.ponudba);
                    setVsiZaposleni(storitev.zaposleni);
                    setIzbraniZaposleni(storitev.zaposleni[0]);
                    setStoritevId(storitev.ponudba[0].id);
                    setCena(storitev.ponudba[0].cena);
                }

            })
            .catch((error) => {
                console.log(error);
            });
        }
        
    }, [isOpen]);


    const addReceipt = () => {
        var id_podjetje = Auth.user.company_id;
        var racun = {
            id_storitev: storitevId,
            ime_stranke: imeStranka,
            priimek_stranke: priimekStranka,
            zaposleni: izbraniZaposleni,
            datum: new Date(),
            opomba: opomba,
            cena: cena,
        };
        console.log(racun);
        ReceiptsService.add_new_racun(id_podjetje, racun)
            .then((result) => {
                console.log(result);
                dodajRacun(result.data);
                closeDialog();
            })
            .catch((err) => {
                console.log(err);
                setErrorAlertOpen(true);
            })
    }

    const handleStoritevChange = (event) => {
        setStoritevId(event.target.value);
        var cena = storitve.find(storitev => storitev.id === event.target.value).cena
        setCena(cena);
    }

    const handleZaposleniChange = (event) => {
        setIzbraniZaposleni(event.target.value);
    }
    const deleteReceipt = () => {
        ReceiptsService.delete_receipt_by_id(receiptId)
            .then((result) => {
                odstraniRacun(receiptId);
                closeDialog();
            })
            .catch((err) => {
                console.log(err);
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
            <Dialog fullScreen open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {t("receipts.detailsDialog.title")}
                        </Typography>
                        {isNew ? (
                            <Button autoFocus color="inherit" onClick={addReceipt}>
                                {t("receipts.detailsDialog.add")}
                            </Button>
                        ) : (
                            <Button autoFocus color="inherit" onClick={deleteReceipt}>
                                {t("receipts.detailsDialog.delete")}
                            </Button>
                        )}
                        
                    </Toolbar>
                </AppBar>
                <FormControl variant="outlined" className={classes.formControl}>
                    {errorAlert}
                    <Typography>{t("reservations.confirmReservationDialog.customer")}</Typography>
                    <TextField
                        className={classes.textField}
                        label={t("reservations.confirmReservationDialog.firstName")}
                        variant="outlined"
                        value={imeStranka}
                        onChange={(event) => setImeStranka(event.target.value)}
                        disabled={disabled}
                    />
                    <TextField
                        className={classes.textField}
                        label={t("reservations.confirmReservationDialog.lastName")}
                        variant="outlined"
                        value={priimekStranka}
                        onChange={(event) => setPriimekStranka(event.target.value)}
                        disabled={disabled}
                    />
                    <Typography>{t("reservations.confirmReservationDialog.service")}</Typography>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={storitevId}
                        onChange={handleStoritevChange}
                        disabled={disabled}
                    >
                        {storitve.map((storitev) => (
                            <MenuItem key={storitev.id} value={storitev.id}>{storitev.ime}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        className={classes.textField}
                        label={t("reservations.confirmReservationDialog.price")}
                        variant="outlined"
                        value={cena}
                        onChange={(event) => setCena(event.target.value)}
                        disabled={disabled}
                    />
                    <TextField
                        className={classes.textField}
                        variant="outlined"
                        label={t("reservations.confirmReservationDialog.note")}
                        multiline
                        rows={3}
                        rowsMax={7}
                        value={opomba}
                        disabled={disabled}
                        onChange={(event) => setOpomba(event.target.value)}
                    />
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>                  
                    <Typography>{t("reservations.confirmReservationDialog.employee")}</Typography>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={izbraniZaposleni}
                        onChange={handleZaposleniChange}
                        disabled={disabled}
                    >
                        {isNew ? vsiZaposleni.map((zaposleni) => (
                            <MenuItem key={zaposleni.naziv} value={zaposleni}>{zaposleni.naziv}</MenuItem>
                        )) : (<MenuItem key={izbraniZaposleni.naziv} value={izbraniZaposleni}>{izbraniZaposleni.naziv}</MenuItem>)}
                    </Select>
                </FormControl>
            </Dialog>
        </div>
    );
}

export default AddReceiptDialog
