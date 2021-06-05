import React, { Component } from 'react'
import ReservationService from '../services/ReservationService';
import { formatTime } from '../Utils';
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
import HotelIcon from '@material-ui/icons/Hotel';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { REFRESH_TIME } from '../Constants'

class TimelineComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedDate: new Date(),
            reservations: [],
            user: JSON.parse(sessionStorage.getItem("user"))
        }

    }

    componentDidMount() {
        this.loadRezervacije(this.state.selectedDate);

        this.interval = setInterval(() => {
            this.loadRezervacije(this.state.selectedDate);
        }, REFRESH_TIME);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    loadRezervacije = (date) => {
        ReservationService.timeline_loadRezervacije(this, date);
        // ReservationService.occupied_rezervacije(this.state.user.company_id).then((response) => {
        //     this.setState({ reservations: filterReservationsByDate(response.data.occupied, date) })
        // }).catch((error) => {
        //     console.log(error)
        // });
    }

    handleDateChange = (e) => {
        this.setState({ selectedDate: e })
        this.loadRezervacije(e)
    }

    render() {
        var isThereWork = false;
        if (this.state.reservations.length !== 0)
            isThereWork = true;
        return (
            <div>
                <div className="timeline-datepicker">
                    <Typography variant="h5">Check the workflow for selected day</Typography>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker

                            margin="normal"
                            id="date-picker-dialog"
                            label="Pick the date"
                            format="MM/dd/yyyy"
                            value={this.state.selectedDate}
                            onChange={this.handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>

                <Timeline align="alternate">
                    {isThereWork
                        ?
                        this.state.reservations.map((reservation, index) =>
                            <TimelineElement key={"timeline_reservatin_" + index} reservation={reservation} index={index} num_elements={this.state.reservations.length} />
                        )
                        :
                        <div>
                            <NoTimelineElements />
                        </div>
                    }
                </Timeline>
            </div>
        )
    }
}

function TimelineElement(props) {
    var isLast = false;
    var color = "primary";
    var variant = "default";
    const dtc = new Date();
    // dtc.setMinutes(dtc.getMinutes+30)
    if ((new Date(props.reservation.start_date)).getTime() < dtc.getTime()) {
        color = "secondary";
    }
    dtc.setHours(dtc.getHours() + 2)
    if ((new Date(props.reservation.start_date)).getTime() > dtc.getTime()) {
        variant = "outlined"
    }


    if (props.index === props.num_elements - 1)
        isLast = true;

    return (
        <TimelineItem>
            <TimelineOppositeContent>
                <Typography variant="h6" color="textPrimary">{formatTime(props.reservation.start_date)}</Typography>
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
                <Paper className="timeline-paper" elevation={3}>
                    <Typography variant="h6" component="h1" >
                        {props.reservation.storitev}
                    </Typography>
                </Paper>
            </TimelineContent>
        </TimelineItem>
    )
}

function NoTimelineElements(props) {
    return (
        <div>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="secondary">
                        <ScheduleIcon />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper className="timeline-paper" elevation={3}>
                        <Typography >
                            There's <strong>no reservations</strong> for this day yet
                                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="primary">
                        <HotelIcon />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper className="timeline-paper" elevation={3}>
                        <Typography >
                            You can <strong>sleep a little bit</strong> longer
                                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="primary">
                        <FastfoodIcon />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper className="timeline-paper" elevation={3}>
                        <Typography  >
                            <strong>Do not</strong> forget to eat and drink
                                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="primary">
                        <EmojiEmotionsIcon />
                    </TimelineDot>
                </TimelineSeparator>
                <TimelineContent>
                    <Paper className="timeline-paper" elevation={3}>
                        <Typography>
                            Most importantly: <br /><strong>Stay positive</strong>
                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
        </div>
    )

}

export default TimelineComponent
