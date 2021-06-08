import React, { Component } from 'react'

class HomepageComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }

    }

    render() {
        var logo = require('../images/etermin1.PNG')
        return (
            <div>
              <img src={logo} style={{ width:"100%" ,alignSelf: 'center' }} />
            </div>
        )
    }
}


export default HomepageComponent
