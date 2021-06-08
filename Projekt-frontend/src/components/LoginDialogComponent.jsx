import React, { Component } from 'react'
import UserService from '../services/UserService'
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';

class LoginDialogComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            wrongCredentials: false,
            wrongCredentials_error: "",
        }
    }

    wrongCredentials = (status, reason) => {
        this.setState({ wrongCredentials: status });
        this.setState({ wrongCredentials_error: reason });
    }


    render() {
        return (
            <Dialog onClose={this.props.handleLoginDialogClickClose} open={this.props.isShowing}>
            <form >
                <TextField id="outlined-basic" required label={this.props.t("userManagement.username")} variant="outlined" style={{ marginTop: "100px", marginLeft: "100px", marginRight: "100px" }}
                    onChange={(e) => { this.setState({ username: e.target.value }) }} /> <br /> <br />
                <TextField id="outlined-basic" required type="password" label={this.props.t("userManagement.password")} variant="outlined" style={{ marginTop: "10px", marginBottom: "10px", marginLeft: "100px", marginRight: "100px" }}
                    onChange={(e) => { this.setState({ password: e.target.value }) }} /><br /> <br />
                <Button style={{ marginBottom: "20px", marginLeft: "100px", marginRight: "100px" }} variant="contained" color="primary"
                    onClick={() => {
                        if (this.state.username === "" || this.state.password === "") {
                            this.wrongCredentials(true, "Please fill all required fields");
                            return
                        }
                        this.wrongCredentials(false);
                        UserService.login(this.state.username, this.state.password).then((resp) => {
                            this.props.logInSuccessful();
                            const decodedJWT = (UserService.decodeJWT(resp.headers.authorization))
                            window.sessionStorage.setItem("user", JSON.stringify(
                                {
                                user_id: decodedJWT.user_id,
                            company_id: decodedJWT.company_id,
                            jwt: resp.headers.authorization
                        }));

                        })
                            .catch((err) => {
                                if (err.response)
                                    this.wrongCredentials(true, err.response.data.reason);
                                else {
                                    console.log(err)
                                }
                            });
                    }}>
                    Log in
                </Button>
            </form>
            <Collapse in={this.state.wrongCredentials}>
                <Alert severity="error" style={{ marginBottom: "20px", marginLeft: "100px", marginRight: "100px" }}>
                    <AlertTitle>Error</AlertTitle>
                    {this.state.wrongCredentials_error}
                </Alert>
            </Collapse>
        </Dialog>
        )
    }
}

export default withTranslation()(LoginDialogComponent)