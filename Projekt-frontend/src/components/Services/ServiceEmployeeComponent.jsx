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

function ServiceEmployeeComponent({ }) {
    const classes = useStyles();
    const { t } = useTranslation();
    const Auth = useContext(AuthContext);
    const Connection = useContext(ConnectionContext);

    var columns = [
        { title: "id", field: "id", hidden: true },
        { title: t("services.serviceDetails.name"), field: "naziv" },
        { title: t("services.serviceDetails.phone"), field: "telefon" }
    ]
    const [data, setData] = useState([]);

    //for error handling
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    useEffect(() => {
        var podjetjeId = Auth.user.company_id;
        ServicesService.storitev_by_company_id(podjetjeId)
            .then((result) => {
                setData(result.data.zaposleni);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    const handleRowUpdate = (newData, oldData, resolve) => {
        let errorList = []
        if (newData.naziv === "") {
            errorList.push(t("services.serviceDetails.nameError"))
        }
        if (newData.telefon === "") {
            errorList.push(t("services.serviceDetails.phoneError"))
        }

        if (errorList.length < 1) {
            var podjetjeId = Auth.user.company_id;
            ServicesService.updateEmployee(podjetjeId, newData)
                .then((res) => {
                    console.log("reached")
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
        } else {
            setErrorMessages(errorList)
            setIserror(true)
            resolve()

        }

    }

    const handleRowAdd = (newData, resolve) => {
        let errorList = []
        if (newData.naziv === "") {
            errorList.push(t("services.serviceDetails.nameError"))
        }
        if (newData.telefon === "") {
            errorList.push(t("services.serviceDetails.phoneError"))
        }

        if (errorList.length < 1) {
            var podjetjeId = Auth.user.company_id;
            ServicesService.addEmployee(podjetjeId, newData)
                .then((res) => {
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
        } else {
            setErrorMessages(errorList)
            setIserror(true)
            resolve()
        }


    }

    const handleRowDelete = (oldData, resolve) => {
        var podjetjeId = Auth.user.company_id;
        ServicesService.removeEmployee(podjetjeId, oldData._id)
            .then((res) => {
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
    }


    return (
        <div>
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
                title={t("services.serviceDetails.employeeList")}
                columns={columns}
                data={data}
                icons={tableIcons}
                localization={{
                    body: {
                        addTooltip: t("services.serviceDetails.add"),
                        deleteTooltip: t("services.serviceDetails.delete"),
                        editTooltip: t("services.serviceDetails.edit"),
                        emptyDataSourceMessage: t("services.serviceDetails.empty"),
                        editRow: {
                            deleteText: t("services.serviceDetails.deleteText"),
                            cancelTooltip: t("services.serviceDetails.cancelTooltip"),
                            saveTooltip: t("services.serviceDetails.saveTooltip")
                        }
                    },
                    pagination: {
                        labelDisplayedRows: t("services.serviceDetails.displayedRows"),
                        labelRowsSelect: t("services.serviceDetails.rows")
                    },
                    toolbar: {
                        searchTooltip: t("services.serviceDetails.search"),
                        searchPlaceholder: t("services.serviceDetails.search")
                    },
                    header: {
                        actions: t("services.serviceDetails.actions")
                    },
                }}
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
        </div>
    );
}

export default ServiceEmployeeComponent
