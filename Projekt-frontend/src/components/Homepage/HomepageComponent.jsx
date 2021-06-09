import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography';

class HomepageComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }

    }

    render() {
        var logo = require('../../images/etermin1.PNG')
        return (
            <div style={{textAlign:"center", backgroundColor: '#F4F5F7', width: '100%'}}>
              <img src={logo} style={{ width:"60%", alignSelf: 'center', maxWidth: '400px'}} />
              <Typography className="title" variant="h4" noWrap>e-Termin</Typography>
              <Typography className="title" variant="h5" style={{padding: '10px'}}>Se spominjate vaše stare 'Katrce'? Ne skrbite! Naše storitve so zanesljivejše.</Typography>
            </div>
        )
    }
}


export default HomepageComponent
