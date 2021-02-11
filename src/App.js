import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./components/login";
import Upload from "./components/upload";
import Gallery from "./components/gallery";
import ProtectedRoute from './components/ProtectedRoute';

class App extends React.Component {
  state={
    loggedIn : sessionStorage.getItem('token') ? true: false,
    error: !sessionStorage.getItem('token') ? "You must log in first" : ''

  }
  render() {
    const { error } = this.state.error;
    
  return (<Router>
    <div className="App">
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to={"/gallery"}>ImageStack</Link>       

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                </li>

            </ul>
            <ul className="navbar-nav ">
                <li className="nav-item">
                <Link className="nav-link" to={"/gallery"}>Gallery</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to={"/upload-images"}>Upload</Link>
                </li>


            </ul>
        </div>
    </nav>     

      <div className="outer">
        {error && alert({error})}
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path="/sign-in" component={Login} />
            <ProtectedRoute path="/upload-images" loggedIn={this.state.loggedIn} component={Upload} />
            <ProtectedRoute path="/gallery" loggedIn={this.state.loggedIn} component={Gallery}/>
          </Switch>
      </div>
    </div></Router>
  )
  }
}

export default App;