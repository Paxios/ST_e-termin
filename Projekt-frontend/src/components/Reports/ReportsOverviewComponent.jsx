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
    Fab,
    Card
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from "react-i18next";
import AuthContext from "../../context/AuthContext";
import ServicesService from '../../services/ServicesService';
import ReceiptsServiceService from '../../services/ReceiptsService';
import ReceiptsService from '../../services/ReceiptsService';
import Alert from '@material-ui/lab/Alert';
import ReportService from '../../services/ReportService';
import { DataGrid } from '@material-ui/data-grid';
import ReceiptIcon from '@material-ui/icons/Receipt';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple';
import moment from "moment";
import 'moment/locale/sl';
import { saveAs } from 'file-saver';
import axios from 'axios';
import GetAppIcon from '@material-ui/icons/GetApp';
import BarChartComponent from './Graphs/BarChartComponent';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LineChartComponent from './Graphs/LineChartComponent';
import ViewPdfReportDialog from './ViewPdfReportDialog';
import { BACKEND_URL, REPORT_PREFIX } from '../../Constants';

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
    downloadButton: {
        backgroundColor: '#3f51b5',
        color: 'white',
        boxShadow: '0 3px 5px 0 rgba(47,85,212,.3)',
        borderRadius: '6px',
        fontSize: '14px',
        "&:hover": {
            backgroundColor: '#2c40b1',
        }
    },
    container: {
        paddingTop: '25px'
    },
    graphContainer: {
        height: '300px',
        marginTop: '25px'
    },
    graphTitle: {
        textAlign: 'center',
        fontSize: '18px'
    }
}));

function ReportsOverviewComponent({ }) {
    const classes = useStyles();
    const { t } = useTranslation();
    const Auth = useContext(AuthContext);

    const [errorAlertOpen, setErrorAlertOpen] = useState(false);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [pdfReportData, setPdfReportData] = useState("");
    const [countData, setCountData] = useState([]);
    const [reservationsData, setReservationsData] = useState([]);

    useEffect(() => {
        const loadCountData = () => {
            var id = Auth.user.company_id;
            ReportService.get_report_count(id)
                .then((response) => {
                    console.log(response.data);
                    setCountData(response.data);
                });
            ReportService.get_reservations_count(id)
                .then((result) => {
                    console.log(result.data);
                    setReservationsData(result.data);
                });
        }
        loadCountData();
    }, []);

    const downloadReport = () => {
        var id = Auth.user.company_id;
        console.log(Auth.user);
        axios({
            method: 'GET',
            url: BACKEND_URL + REPORT_PREFIX + id,
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

    const showPdfReport = () => {
        var id = Auth.user.company_id;
        ReportService.get_racuni_report_pdf(id)
            .then((result) => {
                setPdfReportData(result.data);
                setReportDialogOpen(true);
            })
            .catch((error) => {
                console.log(error);
            });
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
        <div style={{backgroundColor: '#F4F5F7'}}>
            <Grid container className={classes.container}>
                <Grid item xs={6} style={{ textAlign: "center" }}>
                    <Button
                        className={classes.downloadButton}
                        onClick={downloadReport}
                    >
                        <GetAppIcon />
                        <Typography>
                            {t("reports.xlsxButton")}
                        </Typography>
                    </Button>
                </Grid>
                <Grid item xs={6} style={{ textAlign: "center" }}>
                    <Button
                        className={classes.downloadButton}
                        onClick={showPdfReport}
                    >
                        <GetAppIcon />
                        <Typography>
                            {t("reports.pdfButton")}
                        </Typography>
                    </Button>
                </Grid>
                <Grid item xs={12} style={{marginTop: '25px', padding: '15px'}}>
                    <Card>
                        <Grid item xs={12} className={classes.graphContainer}>
                            <Typography className={classes.graphTitle}>
                                {t("reports.countGraph")}
                            </Typography>
                            <BarChartComponent data={countData} barNames={["count"]} colors={["#3f51b5", "#89BD23", "#10458C"]} />
                        </Grid>
                        <Grid item xs={12} className={classes.graphContainer}>
                            <Typography className={classes.graphTitle}>
                                {t("reports.priceGraph")}
                            </Typography>
                            <BarChartComponent data={countData} barNames={["znesek"]} colors={["#89BD23", "#10458C"]} />
                        </Grid>
                        <Grid item xs={12} className={classes.graphContainer}>
                            <Typography className={classes.graphTitle}>
                                {t("reports.reservationsGraph")}
                            </Typography>
                            <LineChartComponent data={reservationsData} lineNames={["count"]} colors={["#3f51b5", "#10458C"]} />
                        </Grid>
                    </Card>
                </Grid>

                <ViewPdfReportDialog
                    isOpen={reportDialogOpen}
                    closeDialog={() => setReportDialogOpen(false)}
                    data={pdfReportData}
                />
            </Grid>
        </div >
    );
}

export default ReportsOverviewComponent
