import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import UserService from '../../services/UserService'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Grid } from '@material-ui/core';

class RegisterComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: "",
            password: "",
            inviteCode: "",
            showError: false,
            error_details: ""
        }
    }

    navigateFirstPage() {
        this.props.history.push('/');
    }

    render() {
        let codeInvited = "";
        if (queryString.parse(this.props.location.search)['inviteCode'])
            codeInvited += queryString.parse(this.props.location.search)['inviteCode'];
        return (
            <div style={{ backgroundColor: '#F4F5F7', padding: '25px' }}>
                <Grid container
                    style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
                        borderRadius: '4px'
                    }}
                >
                    <Grid container xs={12} style={{marginBottom: '25px', textAlign: 'center'}}>
                        <Typography>
                            Registracija
                        </Typography>
                    </Grid>
                    <Grid container xs={12}>
                        <Collapse in={this.state.showError}>
                            <Alert color="error">
                                {this.state.error_details}
                            </Alert>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant="outlined" fullWidth={true} id="register_username" required label={this.props.t("userManagement.username")} onChange={(e) => {
                            this.setState({ username: e.target.value });
                        }} /> <br /> <br />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant="outlined" fullWidth={true} id="register_password" required label={this.props.t("userManagement.password")} type="password" onChange={(e) => {
                            this.setState({ password: e.target.value });
                        }} /> <br /> <br />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant="outlined" fullWidth={true} id="register_inviteCode" defaultValue={codeInvited} label={this.props.t("userManagement.inviteCode")} onChange={(e) => {
                            this.setState({ inviteCode: e.target.value });
                        }} /> <br />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption">{this.props.t("userManagement.inviteCodeHint")}</Typography>
                        <br /> <br />
                    </Grid>
                    <Grid item xs={12} style={{textAlign: 'center'}}>
                        <Button variant="contained" color="primary" onClick={() => {
                            UserService.register(this.state.username, this.state.password, this.state.inviteCode).then((response) => {
                                this.navigateFirstPage();
                            }).catch((err) => {
                                this.setState({ showError: true })
                                console.log(typeof (err.response.data.reason))
                                if (typeof (err.response.data.reason) == "string")
                                    this.setState({ error_details: err.response.data.reason });
                                else {
                                    this.setState({ error_details: "Unexpected error has occured. Please try again later" })
                                }
                            });
                        }}>Registriraj</Button><br /> <br />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withTranslation()(withRouter(RegisterComponent))
