import React, { Component } from 'react';
import Nav from "./components/layout/Nav";
import {BrowserRouter, Switch, Route} from "react-router-dom"
import Signin from "./components/auth/SignIn"
import {connect} from "react-redux"
import RootDashboard from "./components/dashboard/RootDashboard"
import RootLobby from "./components/lobby/RootLobby"
import RootInventory from "./components/inventory/RootInventory"
import AddItem from "./components/admin/AddItem"
import RootGiftBox from "./components/giftbox/RootGiftBox"
import FourO from "./components/layout/404.js"
import Home from "./components/layout/Home.js"
import Count from "./components/admin/Count"
import MyRoomsOwn from "./components/dashboard/MyRoomsOwn"
import {DuplicatLobbyRed}  from "./components/lobby/DuplicateLobbyRed"
import News from "./components/news/News"
import AddNews from "./components/admin/AddNews"
import Test from "./components/layout/Test"
import Banned from "./components/layout/Banned"
import Notifications from "./components/layout/Notifications.js"

class App extends Component {
  render() {
    return (
        <BrowserRouter>
        <div className="app">
          <Nav auth={this.props.auth} profile={this.props.profile}/>
          <Switch>
          <Route path="/profile/:id" component={RootDashboard}/>
          <Route path="/signup" component={Signin}/>
          <Route path="/lobbyError" component={DuplicatLobbyRed}/>
          <Route path="/login/:direct?" component={Signin}/>
          <Route path="/lobby/:id/:target?" component={RootLobby}/>
          <Route path="/news/:id" component={News}/>
          <Route path="/ban/:reason" component={Banned}/>
          <Route path="/inventory" component={RootInventory}/>
          <Route path="/adminadditem" component={AddItem}/>
          <Route path="/admindash" component={Count}/>
          <Route path="/notifications" component={Notifications}/>
          <Route path="/adminnews" component={AddNews}/>
          <Route path="/myrooms" component={MyRoomsOwn}/>
          <Route path="/gifts" component={RootGiftBox}/>
          <Route path="/home" component={Home}/>
          <Route path="/test" component={Test}/>
          <Route path="/" component={Home} exact={true}/>
          <Route path="/" component={FourO}/>
          </Switch>
        </div>
        </BrowserRouter>
    );
  }
}
const mapStateToProps=(state)=>{
  return{
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}
export default connect(mapStateToProps)(App);
