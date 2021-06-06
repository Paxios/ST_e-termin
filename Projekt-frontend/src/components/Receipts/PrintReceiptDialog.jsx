import React, { useState, useEffect, useContext } from 'react'
import {
    Dialog,
    makeStyles,
    Typography,
    Button,
    AppBar,
    Toolbar,
    IconButton,
    Slide,
    CircularProgress
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from "react-i18next";
import AuthContext from "../../context/AuthContext";
import ReceiptsService from '../../services/ReceiptsService';
import { Document, Page, pdfjs } from "react-pdf";
import { useWindowWidth } from '@wojtekmaj/react-hooks';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


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
    },
    pdfFile: {
        width: '100%'
    },
    pdfPage: {

    },
    progress: {
        margin: 'auto'
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function PrintReceiptDialog({ isOpen, closeDialog, receiptId }) {
    const classes = useStyles();
    const { t } = useTranslation();
    const Auth = useContext(AuthContext);
    const width = useWindowWidth();

    const [errorAlertOpen, setErrorAlertOpen] = useState(false);
    const [pdfString, setPdfString] = useState("");

    const handleClose = () => {
        closeDialog();
        setPdfString("");
    };

    useEffect(() => {
        ReceiptsService.get_receipt_pdf(receiptId)
            .then((result) => {
                console.log(result.data);
                setPdfString(result.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [isOpen, receiptId]);

    const addReceipt = () => {

    }

    return (
        <div>
            <Dialog fullScreen open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {t("reservations.confirmReservationDialog.title")}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={addReceipt}>
                            {t("reservations.confirmReservationDialog.confirm")}
                        </Button>
                    </Toolbar>
                </AppBar>
                <div style={{textALign: 'center'}}>
                    {pdfString ? (
                        <Document file={`data:application/pdf;base64,${pdfString}`} className={classes.pdfFile} >
                            <Page pageNumber={1} className={classes.pdfPage} width={Math.min(width * 0.95, 700)}/>
                        </Document>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <CircularProgress className={classes.progress} />
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
}

export default PrintReceiptDialog
