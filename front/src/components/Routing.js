import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import AppContext from '../appContext';
import CreateProduct from './Products/Create';
import { LinearProgress } from '@material-ui/core';
import ProductList from './Products/List';
import Registers from './Registers/Registers';
import LoginUser from './LoginUser';
import ProductID from './Products/ProductID';
import Events from './Events';
import Dashboard from './Dashboard/Dashboard';
import Clients from './Clients/Clients';
import RegistersList from './Registers/RegistersList';
import NewClient from './Clients/NewClient';
import ClientHistory from './Clients/ClientHistory';

export default function Routing() {
    const context = useContext(AppContext);
    return (
        <div>
            {
                context.ui.loading ? (
                    <LinearProgress />
                ) : null
            }
            <Route
                exact path='/products/edit/:id'
                component={ProductID} />
            <Route
                exact path='/products/create'
                component={CreateProduct} />
            <Route
                exact path='/products'
                component={ProductList} />
            <Route
                exact path='/events'
                component={Events} />
            <Route
                exact path='/registers/create'
                component={Registers} />
            <Route
                exact path="/registers"
                component={RegistersList} />
            <Route
                exact path='/login'
                component={LoginUser} />
            <Route
                exact path='/clients/registers/:id'
                component={ClientHistory} />
            <Route
                exact path='/clients/create'
                component={NewClient} />
            <Route
                exact path='/clients'
                component={Clients} />
            <Route
                exact path='/'
                component={Dashboard}>
            </Route>
        </div>
    );
}