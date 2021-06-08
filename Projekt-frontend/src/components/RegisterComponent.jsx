import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import UserService from '../services/UserService'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

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
        return (
            <div>
                <TextField id="register_username" required label={this.props.t("userManagement.username")} onChange={(e) => {
                    this.setState({ username: e.target.value });
                }} /> <br /> <br />
                <TextField id="register_password" required label={this.props.t("userManagement.password")} type="password" onChange={(e) => {
                    this.setState({ password: e.target.value });
                }} /> <br /> <br />
                <TextField id="register_inviteCode" label={this.props.t("userManagement.inviteCode")} onChange={(e) => {
                    this.setState({ inviteCode: e.target.value });
                }} /> <br />
                <Typography variant="caption">{this.props.t("userManagement.inviteCodeHint")}</Typography>
                <br /> <br />
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
                }}>Register</Button><br /> <br />
                <Collapse in={this.state.showError}>
                    <Alert color="error">
                        <AlertTitle>Error</AlertTitle>
                        {this.state.error_details}
                    </Alert>
                </Collapse>
            </div>
        )
    }
}

export default withTranslation()(withRouter(RegisterComponent))
