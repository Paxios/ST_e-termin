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

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    }
}));

function ServiceOfferComponent({ }) {
    const classes = useStyles();
    const { t } = useTranslation();
    const Auth = useContext(AuthContext);
    const Connection = useContext(ConnectionContext);

    var columns = [
        { title: "id", field: "id", hidden: true },
        { title: "Ime", field: "ime" },
        { title: "Opis", field: "opis" },
        { title: "Cena", field: "cena" },
        { title: "Trajanje", field: "trajanje" }
    ]
    const [data, setData] = useState([]);

    //for error handling
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    useEffect(() => {
        var podjetjeId = Auth.user.company_id;
        ServicesService.storitev_by_company_id(podjetjeId)
            .then((result) => {
                setData(result.data.ponudba);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    const handleRowUpdate = (newData, oldData, resolve) => {
        //validation
        let errorList = []
        // if (newData.first_name === "") {
        //     errorList.push("Please enter first name")
        // }
        // if (newData.last_name === "") {
        //     errorList.push("Please enter last name")
        // }
        // if (newData.email === "" || validateEmail(newData.email) === false) {
        //     errorList.push("Please enter a valid email")
        // }

        if (errorList.length < 1) {
            var podjetjeId = Auth.user.company_id;
            ServicesService.updateOffer(podjetjeId, newData)
                .then((result) => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    resolve()
                    setIserror(false)
                    setErrorMessages([])
                })
                .catch((error) => {
                    setErrorMessages(["Server error"])
                    setIserror(true)
                    resolve()
                });
            // api.patch("/users/" + newData.id, newData)
            //     .then(res => {
            //         const dataUpdate = [...data];
            //         const index = oldData.tableData.id;
            //         dataUpdate[index] = newData;
            //         setData([...dataUpdate]);
            //         resolve()
            //         setIserror(false)
            //         setErrorMessages([])
            //     })
            //     .catch(error => {
            //         setErrorMessages(["Update failed! Server error"])
            //         setIserror(true)
            //         resolve()

            //     })
        } else {
            setErrorMessages(errorList)
            setIserror(true)
            resolve()

        }

    }

    const handleRowAdd = (newData, resolve) => {
        //validation
        let errorList = []
        // if (newData.first_name === undefined) {
        //     errorList.push("Please enter first name")
        // }
        // if (newData.last_name === undefined) {
        //     errorList.push("Please enter last name")
        // }
        // if (newData.email === undefined || validateEmail(newData.email) === false) {
        //     errorList.push("Please enter a valid email")
        // }

        if (errorList.length < 1) { //no error
            var podjetjeId = Auth.user.company_id;
            ServicesService.addOffer(podjetjeId, newData)
                .then((result) => {
                    let dataToAdd = [...data];
                    dataToAdd.push(newData);
                    setData(dataToAdd);
                    resolve()
                    setErrorMessages([])
                    setIserror(false)
                })
                .catch((error) => {
                    setErrorMessages(["Server error"])
                    setIserror(true)
                    resolve()
                });
            // api.post("/users", newData)
            //     .then(res => {
            //         let dataToAdd = [...data];
            //         dataToAdd.push(newData);
            //         setData(dataToAdd);
            //         resolve()
            //         setErrorMessages([])
            //         setIserror(false)
            //     })
            //     .catch(error => {
            //         setErrorMessages(["Cannot add data. Server error!"])
            //         setIserror(true)
            //         resolve()
            //     })
        } else {
            setErrorMessages(errorList)
            setIserror(true)
            resolve()
        }


    }

    const handleRowDelete = (oldData, resolve) => {
        var podjetjeId = Auth.user.company_id;
        ServicesService.removeOffer(podjetjeId, oldData._id)
            .then((result) => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve()
            })
            .catch((error) => {
                setErrorMessages(["Server error"])
                setIserror(true)
                resolve()
            });
        // api.delete("/users/" + oldData.id)
        //     .then(res => {
        //         const dataDelete = [...data];
        //         const index = oldData.tableData.id;
        //         dataDelete.splice(index, 1);
        //         setData([...dataDelete]);
        //         resolve()
        //     })
        //     .catch(error => {
        //         setErrorMessages(["Delete failed! Server error"])
        //         setIserror(true)
        //         resolve()
        //     })
    }


    return (
        <div style={{ backgroundColor: '#F4F5F7', width: '100%', paddingLeft: '20px', paddingRight: '20px' }}>
            <Grid container spacing={1}>
                <Grid item xs={3}></Grid>
                <Grid item xs={6}>
                    <div>
                        {iserror &&
                            <Alert severity="error">
                                {errorMessages.map((msg, i) => {
                                    return <div key={i}>{msg}</div>
                                })}
                            </Alert>
                        }
                    </div>
                    <MaterialTable
                        title="Ponudba"
                        columns={columns}
                        data={data}
                        icons={tableIcons}
                        editable={{
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve) => {
                                    handleRowUpdate(newData, oldData, resolve);

                                }),
                            onRowAdd: (newData) =>
                                new Promise((resolve) => {
                                    handleRowAdd(newData, resolve)
                                }),
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    handleRowDelete(oldData, resolve)
                                }),
                        }}
                    />
                </Grid>
                <Grid item xs={3}></Grid>
            </Grid>
        </div>
    );
}

export default ServiceOfferComponent
