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

class HeaderDrawerComponent extends Component {
    // constructor(props) {
    //     super(props)

    //     // this.state = {

    //     // }
    // }
    navigateReservartions(destination) {
        this.props.changeDrawerStatus(false);
        this.props.history.push(`/${destination}`);
    }

    navigateServices(destination) {
        this.props.changeDrawerStatus(false);
        this.props.history.push(`/${destination}`);
    }

    render() {
        var logo = require('../images/etermin1.PNG')
        return (

            <div>
                { this.props.loggedIn ?
                    <div>
                        <SwipeableDrawer
                            anchor="left"
                            open={this.props.isDrawerOpen}
                            onClose={this.props.toggleDrawer(false)}
                            onOpen={this.props.toggleDrawer(true)}
                        >
                            <img src={logo} style={{ alignSelf: 'center', height: '120px', width: '120px' }} />
                            <List className="drawer-list">
                                <ListItem className="drawer-list-element" button key="services" onClick={() => {
                                    this.navigateServices("services")
                                }
                                }>
                                    <ListItemIcon><WorkOutlineIcon color="secondary" /></ListItemIcon>
                                    <ListItemText primary="Services" />
                                </ListItem><Divider />
                                <ListItem className="drawer-list-element" button key="receipts" onClick={() => {
                                    this.navigateServices("receipts")
                                }
                                }>
                                    <ListItemIcon><ReceiptIcon color="primary" /></ListItemIcon>
                                    <ListItemText primary="Receipts" />
                                </ListItem><Divider />

                                <ListItem className="drawer-list-element" button key="reservations" onClick={() => {
                                    this.navigateReservartions("overview")
                                }
                                }>
                                    <ListItemIcon><ScheduleIcon color="primary" /></ListItemIcon>
                                    <ListItemText primary="Reservations" />
                                </ListItem><Divider />

                                <ListItem className="drawer-list-element" button key="serviceInfo" onClick={() => {
                                    this.navigateReservartions("serviceInfo")
                                }
                                }>
                                    <ListItemIcon><InfoIcon color="secondary" /></ListItemIcon>
                                    <ListItemText primary="Service info" />
                                </ListItem><Divider />

                                <ListItem className="drawer-list-element" button key="reservations_timeline" onClick={() => {
                                    this.navigateReservartions("timeline")
                                }
                                }>
                                    <ListItemIcon><TimelineIcon color="primary" /></ListItemIcon>
                                    <ListItemText primary="Timeline" />
                                </ListItem><Divider />

                                <ListItem className="drawer-list-element" button key="first_page" onClick={() => {
                                    this.navigateReservartions("")
                                }
                                }>
                                    <ListItemIcon><AccessibleForwardIcon color="secondary" /></ListItemIcon>
                                    <ListItemText primary="First page" />
                                </ListItem><Divider />
                            </List>
                        </SwipeableDrawer>
                    </div>

                    :

                    <div>
                        <SwipeableDrawer
                            anchor="left"
                            open={this.props.isDrawerOpen}
                            onClose={this.props.toggleDrawer(false)}
                            onOpen={this.props.toggleDrawer(true)}
                        >
                            <List className="drawer-list">
                                <ListItem className="drawer-list-element" button key="not_loggedin_first_page" onClick={() => { this.navigateReservartions("") }
                                }><ListItemIcon><AccessibleForwardIcon /></ListItemIcon><ListItemText primary="First page" /></ListItem>
                                <Divider />
                            </List>
                        </SwipeableDrawer>
                    </div>
                }

            </div>
        )
    }
}

export default withRouter(HeaderDrawerComponent)