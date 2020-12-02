import React, { useContext } from 'react';
import { AppBar, makeStyles, Toolbar, Typography, Button, Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AppContext from '../appContext';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles(theme => ({
    appBar: {
        width: `calc(100% - ${240}px)`,
        marginLeft: 240,
    },
}))

export default function Navbar() {
    const classes = useStyles();
    const context = useContext(AppContext);
    return (
        <div>
            <AppBar position="fixed" color="primary" className={classes.appBar}>
                <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
                    <Tooltip title="Inicio">
                        <Typography variant="button">
                            <Link to="/" style={{ fontWeight: "bold", textDecoration: "none", color: "white" }}>
                                Sistema de gestión
                            </Link>
                        </Typography>
                    </Tooltip>
                    <Button color="inherit" onClick={() => context.handleLogout()}>
                        <ExitToAppIcon />
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}