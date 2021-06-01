import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import UserService from '../services/UserService'
import Button from '@material-ui/core/Button';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { withRouter } from 'react-router-dom'



class RegisterComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: "",
            password: "",
            company_id: "",
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
                <TextField id="register_username" required label="Username" onChange={(e) => {
                    this.setState({ username: e.target.value });
                }} /> <br /> <br />
                <TextField id="register_password" required label="Password" type="password" onChange={(e) => {
                    this.setState({ password: e.target.value });
                }} /> <br /> <br />
                <TextField id="register_company_id" required label="Company ID" onChange={(e) => {
                    this.setState({ company_id: e.target.value });
                }} /> <br /> <br />
                <Button variant="contained" color="primary" onClick={() => {
                    UserService.register(this.state.username, this.state.password, this.state.company_id).then((response) => {
                        this.navigateFirstPage();
                    }).catch((err) => {
                        this.setState({ showError: true })
                        console.log(typeof (err.response.data.reason))
                        if (typeof (err.response.data.reason) == "string")
                            this.setState({ error_details: err.response.data.reason });
                        else {
                            this.setState({ error_details: "Unexpected error as occured. Please try again later" })
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

export default withRouter(RegisterComponent)
