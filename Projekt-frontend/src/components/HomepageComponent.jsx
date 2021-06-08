import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography';

class HomepageComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }

    }

    render() {
        var logo = require('../images/etermin1.PNG')
        return (
            <div style={{textAlign:"center"}}>
              <img src={logo} style={{ width:"60%", alignSelf: 'center' }} />
              <Typography className="title" variant="h4" noWrap>e-Termin</Typography>
              <Typography className="title" variant="h5" >Se spominjate vaše stare 'Katrce'? Ne skrbite! Naše storitve so zanesljivejše.</Typography>
            </div>
        )
    }
}


export default HomepageComponent
