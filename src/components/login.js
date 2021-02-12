import React, { Component } from "react";
import PropTypes from 'prop-types';
import './login.css';
import { Route,Redirect } from "react-router-dom";


export default class Login extends Component {
    baseUrl="https://localhost:3000";
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
            jwt : sessionStorage.getItem('token') || null
        }
    }
    static contextTypes = {
        router: PropTypes.object,
      }
    onChange = (e) =>{
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    onSubmit =(e) => {
        e.preventDefault();
        const { username, password } = this.state;
        fetch(this.baseUrl +'/login', {
            method: "POST",
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(this.state)
            
        })
        .then((response) => response.json())
            .then((result) => {
                console.log(result);
                if(result.accessToken){
                    this.setState({
                        jwt: result.accessToken
                    })
                    sessionStorage.setItem('token',result.accessToken);                 
                    window.location.reload(false);
                }
                else{
                    alert("Invalid credentials");
                }
            })
            
            
        
    }

    render() {
               
        return (           
            
            <div className="parent-login">
                {!this.state.jwt ? 
                (<div className="login-form">
                    <form className="form-login" onSubmit={this.onSubmit}>
                        <h3 className="h3 mb-3 font-weight-normal text-center">Login</h3>
                        <div className="form-group">
                            <label>Email</label>
                            <input  className="form-control" placeholder="Enter username" name="username"  required
                                onChange={e => this.onChange(e)}/>            </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" placeholder="Enter password" name="password" required
                                onChange={e => this.onChange(e)}/>            </div>
                        <button type="submit" className="btn btn-block btn-primary">Login</button>
                    </form>
                    <br />
                </div>
                
                
                 ):(
                        <Redirect to="/gallery"  />
                    )
                }
            </div>
               
            
            
        );
    }
}