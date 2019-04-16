import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './Components/LandingPage'
import NotFoundPage from './Components/NotFoundPage'
import Dashboard from './Components/Dashboard'
import ProjectDashboard from './Components/ProjectDashboard'
import logo from './logo.svg';
import './App.css';



const App = () =>{
  
  return (
    <div className="fullHeight">
      <Router>
        <Switch>
          <Route exact path="/" render={(props)=><LandingPage  {...props}/>}/>
          <Route exact path="/dashboard" render={(props)=><Dashboard  {...props}/>}/>
          <Route exact path="/dashboard/project/:id" render={(props)=><ProjectDashboard  {...props}/>}/>
        
          <Route component={NotFoundPage} />
        </Switch>
      </ Router>
      
    </div>
  )
}


export default App;
