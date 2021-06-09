import { Typography } from "@material-ui/core";
import React, {useContext} from "react";
import { useTranslation } from "react-i18next";
import UnauthorizedPerson from "../../asssets/img/unauthorized-person.svg";
import AuthContext from "../../context/AuthContext";
import { Redirect } from 'react-router-dom'

function UnauthorizedPage(){
    const { t } = useTranslation();
    const Auth = useContext(AuthContext);

    if (Auth.isLoggedIn) {
        return <Redirect to="/overview" />;
    }

    return (
        <div>
            <img src={UnauthorizedPerson} width={200} />
            
            <Typography variant="h3">
                {t("unauthorizedPage.text")}
            </Typography>
        </div>
    );
}

export default UnauthorizedPage;