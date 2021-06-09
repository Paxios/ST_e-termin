import React, { Component } from 'react'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ScheduleIcon from '@material-ui/icons/Schedule';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import InfoIcon from '@material-ui/icons/Info';
import AccessibleForwardIcon from '@material-ui/icons/AccessibleForward';
import { withRouter } from 'react-router-dom'
import TimelineIcon from '@material-ui/icons/Timeline';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { useTranslation } from "react-i18next";
import { Button, IconButton, Typography } from '@material-ui/core';

function HeaderDrawerComponent(props) {
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;
    var nextLanguage = "sl";
    if(currentLanguage === nextLanguage){
        nextLanguage = "en";
    }
    // constructor(props) {
    //     super(props)

    //     // state = {

    //     // }
    // }
    console.log(currentLanguage);
    const navigateReservartions = (destination) => {
        props.changeDrawerStatus(false);
        props.history.push(`/${destination}`);
    }

    const navigateServices = (destination) => {
        props.changeDrawerStatus(false);
        props.history.push(`/${destination}`);
    }
    const changeLanguage = (lang) => {
        console.log(lang);
        i18n.changeLanguage(lang);
    }


    var logo = require('../../images/etermin3.PNG');
    return (

        <div>
            { props.loggedIn ?
                <div>
                    <SwipeableDrawer
                        anchor="left"
                        open={props.isDrawerOpen}
                        onClose={props.toggleDrawer(false)}
                        onOpen={props.toggleDrawer(true)}
                    >
                        <img src={logo} style={{ alignSelf: 'center', height: '120px', width: '120px', marginTop: '25px' }} />
                        <List className="drawer-list">
                            <ListItem className="drawer-list-element" button key="receipts" onClick={() => {
                                navigateServices("receipts")
                            }
                            }>
                                <ListItemIcon><ReceiptIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("drawerMenuItems.receipts")} />
                            </ListItem><Divider />
                            <ListItem className="drawer-list-element" button key="reports" onClick={() => {
                                navigateServices("reports")
                            }
                            }>
                                <ListItemIcon><AssessmentIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("drawerMenuItems.reports")} />
                            </ListItem><Divider />

                            <ListItem className="drawer-list-element" button key="reservations" onClick={() => {
                                navigateReservartions("overview")
                            }
                            }>
                                <ListItemIcon><ScheduleIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("drawerMenuItems.reservations")} />
                            </ListItem><Divider />

                            <ListItem className="drawer-list-element" button key="serviceInfo" onClick={() => {
                                navigateReservartions("serviceInfo")
                            }
                            }>
                                <ListItemIcon><InfoIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("drawerMenuItems.serviceInfo")} />
                            </ListItem><Divider />

                            <ListItem className="drawer-list-element" button key="serviceDetails" onClick={() => {
                                navigateReservartions("serviceDetails")
                            }
                            }>
                                <ListItemIcon><InfoIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("drawerMenuItems.serviceDetails")} />
                            </ListItem><Divider />

                            <ListItem className="drawer-list-element" button key="reservations_timeline" onClick={() => {
                                navigateReservartions("timeline")
                            }
                            }>
                                <ListItemIcon><TimelineIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("drawerMenuItems.timeline")} />
                            </ListItem><Divider />

                            <ListItem className="drawer-list-element" button key="first_page" onClick={() => {
                                navigateReservartions("")
                            }
                            }>
                                <ListItemIcon><AccessibleForwardIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("drawerMenuItems.firstPage")} />
                            </ListItem><Divider />
                        </List>
                        <div style={{ textAlign: 'center' }}>
                            <Button
                                onClick={() => changeLanguage(nextLanguage)}
                            >
                                {currentLanguage === "en" ? (
                                    <img src="https://lipis.github.io/flag-icon-css/flags/4x3/si.svg" width="24px" />
                                ) : (
                                    <img src="https://lipis.github.io/flag-icon-css/flags/4x3/gb.svg" width="24px" />
                                )}
                                <Typography style={{ marginLeft: '10px' }}>
                                    {currentLanguage === "en" ? "Slovenski jezik" : "English"}
                                </Typography>
                            </Button>
                        </div>

                    </SwipeableDrawer>
                </div>

                :

                <div>
                    <SwipeableDrawer
                        anchor="left"
                        open={props.isDrawerOpen}
                        onClose={props.toggleDrawer(false)}
                        onOpen={props.toggleDrawer(true)}
                    >
                        <img src={logo} style={{ alignSelf: 'center', height: '120px', width: '120px', marginTop: '25px' }} />
                        <List className="drawer-list">
                            <ListItem className="drawer-list-element" button key="services" onClick={() => {
                                navigateServices("services")
                            }
                            }>
                                <ListItemIcon><WorkOutlineIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("drawerMenuItems.services")} />
                            </ListItem><Divider />
                            <ListItem className="drawer-list-element" button key="not_loggedin_first_page" onClick={() => { navigateReservartions("") }
                            }><ListItemIcon><AccessibleForwardIcon /></ListItemIcon><ListItemText primary="First page" /></ListItem>
                            <Divider />
                        </List>
                    </SwipeableDrawer>
                </div>
            }

        </div>
    )
}

export default withRouter(HeaderDrawerComponent)