import React, { useEffect, useState } from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import logo from "../../images/etermin1.PNG";

const useStyles = makeStyles((theme) => ({
    footerContainer: {
        padding: '25px',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        textAlign: 'center'
    },
    logo: {
        width: '50px'
    }
}));

function FooterComponent({ }) {
    const classes = useStyles();
    const { t } = useTranslation();
    var logo = require('../../images/etermin3.PNG')


    return (
        <Grid container className={classes.footerContainer} justify="center">
            <Grid item xs={12} md={8} lg={6}>
                <div>
                    <img src={logo} className={classes.logo} style={{display: "inline-block"}}/>
                    <Typography variant="h5" style={{display: "inline-block", marginLeft: '25px'}}>
                        {t("siteTitle")}
                    </Typography>
                </div>
            </Grid>
        </Grid>
    );
}

export default FooterComponent;