import React, { Component } from 'react'

class HeaderComponent extends Component {
    constructor(props) {
        super(props)

        this.state = { loggedIn: window.sessionStorage.getItem("user") };

    }


    render() {
        const { loggedIn } = this.state;
        var initialHref = window.location.href;
        return (
            <div>
                <header>
                    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                        <div><a href="./" className="navbar-brand">Customer & Coupon Management App</a></div>
                        {loggedIn
                            ? <button style={{ marginLeft: "10px" }} onClick={() => {
                                window.sessionStorage.removeItem("user"); 
                                this.setState({ loggedIn: !loggedIn }); 
                                window.location = initialHref;
                            }} className="btn btn-primary">Log out </button>
                            : <button style={{ marginLeft: "10px" }} onClick={() => {
                                window.sessionStorage.setItem("user", JSON.stringify({
                                    "username": "admin",
                                    "password": "1002335060"
                                })); 
                                this.setState({ loggedIn: !loggedIn }); 
                                window.location = initialHref;
                            }} className="btn btn-primary">Log in </button>
                        }

                    </nav>
                </header>
            </div>
        )
    }
}

export default HeaderComponent
