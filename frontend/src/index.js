import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage'
import NotFoundPage from './Components/NotFoundPage'
import './styles/styles.scss';
import '../node_modules/spectre.css/dist/spectre.min.css';
import '../node_modules/spectre.css/dist/spectre-icons.min.css';



ReactDOM.render(
    <Router>
      <div>
        <Route exact path="/" render={(props)=><LandingPage  {...props}/>}/>
        
      </div>
    </ Router>,
    document.getElementById('app')
  );

