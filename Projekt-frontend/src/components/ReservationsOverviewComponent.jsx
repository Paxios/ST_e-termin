import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import ReservationService from '../services/ReservationService'

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import CreateReservationDialogComponent from './CreateReservationDialogComponent';



class FooterComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            rezervacije: this.loadRezervacije(),
            isAddReservationShowing: false
        }

    }

    loadRezervacije = () => {
        ReservationService.rezervacije_by_company_id(this.props.user.company_id).then((response) => {
            console.log(response)
            return response;
        }).catch((error) => {
            console.log(error)
            return null;
        });
    }

    closeAddReservationDialog = () => {
        this.setState({ isAddReservationShowing: false })
    }

    render() {
        return (
            <div>
                Dela
                <Tooltip title="Add reservation" aria-label="add_reservation">
                    <Fab color="primary" className="fab_add_reservation" onClick={() => {
                        this.setState({ isAddReservationShowing: true })
                    }}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
                <CreateReservationDialogComponent user={this.props.user} closeDialog= {this.closeAddReservationDialog} isShowing={this.state.isAddReservationShowing} />
            </div>
        )
    }
}

export default withRouter(FooterComponent)
