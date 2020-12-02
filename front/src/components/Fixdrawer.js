import React, { useState } from 'react';
import { makeStyles, Drawer, List, ListItem, ListItemIcon, ListItemText, MenuItem, Menu } from '@material-ui/core';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import EventIcon from '@material-ui/icons/Event';
import ContactsIcon from '@material-ui/icons/Contacts';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    drawer: {
        width: 240,
        flexShrink: 0,
    },
    drawerPaper: {
        width: 240,
    },
    toolbar: theme.mixins.toolbar,
    link: {
        textDecoration: "none",
        color: "inherit"
    },
}))

export default function Fixdrawer() {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl_, setAnchorEl_] = useState(null);
    const [anchorEl_1, setAnchorEl_1] = useState(null);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClick_ = (e) => {
        setAnchorEl_(e.currentTarget);
    };

    const handleClick_1 = (e) => {
        setAnchorEl_1(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setAnchorEl_(null);
        setAnchorEl_1(null);
    };

    return (
        <div>
            <Drawer
                className={classes.drawer}
                variant='permanent'
                classes={{ paper: classes.drawerPaper }}
                anchor="left">
                <div className={classes.toolbar}></div>
                <List component='nav'>
                    <ListItem button aria-controls="diary" aria-haspopup="true" onClick={handleClick_1}>
                        <ListItemIcon>
                            <ContactsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Clientes" />
                    </ListItem>
                    <Menu
                        id="simple"
                        anchorEl={anchorEl_1}
                        keepMounted
                        open={Boolean(anchorEl_1)}
                        onClose={handleClose}
                    >
                        <Link to='/clients/create' className={classes.link}>
                            <MenuItem onClick={handleClose}>Nuevo cliente</MenuItem>
                        </Link>
                        <Link to='/clients' className={classes.link}>
                            <MenuItem onClick={handleClose}>Lista de clientes</MenuItem>
                        </Link>
                    </Menu>


                    <ListItem button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                        <ListItemIcon>
                            <FastfoodIcon />
                        </ListItemIcon>
                        <ListItemText primary="Productos" />
                    </ListItem>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <Link to='/products/create' className={classes.link}>
                            <MenuItem onClick={handleClose}>Nuevo producto</MenuItem>
                        </Link>
                        <Link to='/products' className={classes.link}>
                            <MenuItem onClick={handleClose}>Lista de productos</MenuItem>
                        </Link>
                    </Menu>

                    <ListItem button aria-controls="simple" aria-haspopup="true" onClick={handleClick_}>
                        <ListItemIcon>
                            <AttachMoneyIcon />
                        </ListItemIcon>
                        <ListItemText primary="Registros" />
                    </ListItem>
                    <Menu
                        id="simple"
                        anchorEl={anchorEl_}
                        keepMounted
                        open={Boolean(anchorEl_)}
                        onClose={handleClose}
                    >
                        <Link to='/registers/create' className={classes.link}>
                            <MenuItem onClick={handleClose}>Nuevo registro</MenuItem>
                        </Link>
                        <Link to='/registers' className={classes.link}>
                            <MenuItem onClick={handleClose}>Historial de registros</MenuItem>
                        </Link>
                    </Menu>

                    <Link to='/events' className={classes.link}>
                        <ListItem button>
                            <ListItemIcon>
                                <EventIcon />
                            </ListItemIcon>
                            <ListItemText primary="Eventos" />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
        </div>
    );
}
