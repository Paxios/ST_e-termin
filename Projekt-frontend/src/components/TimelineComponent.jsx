import React, { Component } from 'react'
import ReservationService from '../services/ReservationService';
import { filterReservationsByDate, formatTime } from '../Utils';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Typography from '@material-ui/core/Typography';
import TimelineDot from '@material-ui/lab/TimelineDot';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Paper from '@material-ui/core/Paper';

class TimelineComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            reservations: [],
            user: JSON.parse(sessionStorage.getItem("user"))
        }

        this.loadRezervacije();

    }

    loadRezervacije = () => {
        ReservationService.occupied_rezervacije(this.state.user.company_id).then((response) => {
            this.setState({ reservations: filterReservationsByDate(response.data.occupied) })
        }).catch((error) => {
            console.log(error)
        });
    }

    render() {
        return (
            <Timeline align="alternate">
                { this.state.reservations.map((reservation, index) =>
                    <TimelineElement key={"timeline_reservatin_"+index} reservation={reservation} index={index} num_elements={this.state.reservations.length} />
                )}
            </Timeline>
        )
    }
}

function TimelineElement(props) {
    var isLast = false;
    var color = "primary";
    var variant = "default";
    const dtc = new Date();
    // dtc.setMinutes(dtc.getMinutes+30)
    if((new Date(props.reservation.start_date)).getUTCHours() < dtc.getUTCHours()){
        color = "secondary"; 
    }
    if((new Date(props.reservation.start_date)).getUTCHours() > dtc.getUTCHours()+2){
        variant="outlined"
    }


    if (props.index === props.num_elements - 1)
        isLast = true;

    return (
        <TimelineItem>
            <TimelineOppositeContent>
                <Typography color="textPrimary">{formatTime(props.reservation.start_date)}</Typography>
                <Typography color="textSecondary">{formatTime(props.reservation.end_date)}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineDot color={color} variant={variant}>
                    <ScheduleIcon />
                </TimelineDot>
                {isLast ?
                    <div></div>
                    :
                    <TimelineConnector />
                }
            </TimelineSeparator>

            <TimelineContent>
                <Paper elevation={3}>
                    <Typography variant="h6" component="h1" >
                        {props.reservation.storitev}
                    </Typography>
                </Paper>
            </TimelineContent>
        </TimelineItem>
    )
}

export default TimelineComponent
