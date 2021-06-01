import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import UserService from '../services/UserService'
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import { withRouter } from 'react-router-dom'
import LoginDialogComponent from './LoginDialogComponent'

class HeaderComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loginShowing: false,
            loggedIn: window.sessionStorage.getItem("user_id"),
            username: "",
            password: ""
        };

    }

    handleLoginDialogClickOpen = () => {
        this.setState({ loginShowing: true });
    };

    log_in_successful = () => {
        this.setState({
            loggedIn: true,
            loginShowing: false
        });
        this.navigatePageAfterLogIn();
    };


    navigateRegister() {
        this.props.history.push('/register');
    }

    navigatePageAfterLogIn() {
        this.props.history.push("/");
    }

    render() {
        const { loggedIn } = this.state;
        console.log(loggedIn);
        var initialHref = window.location.href;
        return (
            <div>
                <header>
                    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                        <div><a href="./" className="navbar-brand">e-Termin</a></div>
                        {loggedIn
                            ? <Button style={{ marginLeft: "10px" }}
                                onClick={() => {
                                    window.sessionStorage.removeItem("user_id");
                                    this.setState({ loggedIn: !loggedIn });
                                    window.location = initialHref;
                                }} variant="contained" color="primary">
                                Log out
                            </Button>
                            : <div>
                                <Button style={{ marginLeft: "10px" }} onClick={() => {
                                    this.handleLoginDialogClickOpen()
                                }} variant="contained" color="primary">Log in</Button>

                                <Button style={{ marginLeft: "10px" }} onClick={() => {
                                    this.navigateRegister();
                                }} variant="contained" color="secondary">Register</Button>

                                <LoginDialogComponent isShowing={this.state.loginShowing} logInSuccessful={this.log_in_successful} />
                            </div>
                        }

                    </nav>
                </header>
            </div>
        )
    }
}

export default withRouter(HeaderComponent)
