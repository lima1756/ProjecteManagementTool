import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';


const App = () =>(
  <div className="fullHeight">
    <Switch>
      <Route exact path="/" render={(props)=><LandingPage  {...props}/>}/>
      
      
      <Route component={NotFoundPage} />
    </Switch>
  </div>
);

export default App;
