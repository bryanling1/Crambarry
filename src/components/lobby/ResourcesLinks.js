import React, {Component} from "react"
import firebase from "firebase/app"
import {upvote, downvote, addLink, deleteLink, deleteLinkByAdmin, updateNotificationsSeen } from "../../store/actions/resourcesActions"
import {connect} from "react-redux"
import {hoursAgo} from "../class/Resources"

class ResourcesLinks extends Component{
state={
    linksform: false,
    links: null,
    room: null,
    title: null,
    url: null,
    seconds: null,
    http: null,
    openAdminDelete: null
}
deleteLink = () =>{
    this.props.deleteLink({lobby: this.props.roomName, linkid: this.state.linkidtodelete})
    this.closeDelete()
}
openDelete=(e) =>{
    this.setState({delete: true, linkidtodelete: e.target.id})
}
closeDelete=()=>{
    this.setState({delete: false})
}
openform = () =>{
    this.setState({linksform: true})
}
closeform = () =>{
    this.setState({linksform: false, seconds: null})
}
deleteLink = () =>{
    this.props.deleteLink({lobby: this.props.roomName, linkid: this.state.linkidtodelete})
    this.closeDelete()
    this.getLinks();
}
handleSubmit = (e) =>{
    e.preventDefault()
    if(this.state.title && this.state.url){
        if(!this.props.user.lastLink || new Date().getTime()/1000 - this.props.user.lastLink/1000 > 300){
            if(this.state.url.length > 6){
            if(this.state.url.substring(0, 8) === "https://" || this.state.url.substring(0, 7) === "http://"){
                if(this.props.userlobbydata.links < 2 || !this.props.userlobbydata.links ){
                    this.props.addLink({lobby: this.props.roomName, link: this.state.url, title: this.state.title})
                    this.setState({linksform: false, seconds: null, toomany: null})
                    this.getLinks();
                    
                }else{
                    this.setState({http:null})
                    this.setState({toomany:"too many"})
                }
                }else{
                    this.setState({http:"invalid link"})
                }
            }else{
                this.setState({http:"invalid link"})
            }
            
        }else{
            this.setState({seconds: new Date().getTime()/1000 - this.props.user.lastLink/1000})
        }
    }
    
    
}
handleDeleteAsAdmin = (e) =>{
    e.preventDefault();
    if(this.state.reason){
        this.props.deleteLinkByAdmin({lobby: this.props.roomName, linkid: this.state.adminDeleteLinkID, userid: this.state.adminDeleteLinkUserId, reason: this.state.reason})
        this.setState({openAdminDelete: false});
    }
    this.getLinks()
}
handleChange = (e) =>{
    this.setState({
        [e.target.id]: e.target.value
    })
}
//gets the links and sets the state as an object 
getLinks = () =>{
    console.log("got links")
    firebase.firestore().collection("lobbies/"+this.props.roomName+"/links").orderBy("date", "desc").get().then(snapshot=>{
        let links = [];
        snapshot.forEach(data=>{
            links.push({...data.data(), id: data.id});
        })
        this.setState({links: links})
    })
}
getLinksTop = () =>{
    firebase.firestore().collection("lobbies/"+this.props.roomName+"/links").orderBy("rating", "desc").get().then(snapshot=>{
        let links = [];
        snapshot.forEach(data=>{
            links.push({...data.data(), id: data.id});
        })
        this.setState({links: links})
    })
}
getLinksMine = () =>{
    console.log("got mine")
    firebase.firestore().collection("lobbies/"+this.props.roomName+"/links").where("userid", "==", this.props.userid).get().then(snapshot=>{
        let links = [];
        snapshot.forEach(data=>{
            links.push({...data.data(), id: data.id});
        })
        this.setState({links: links})
    })
}
upvote=(e)=>{
    this.props.upvote({lobby: this.props.roomName, id: e.target.id});
    var stateCopy = [...this.state.links];
    const user = this.props.userid;
    stateCopy.forEach(function(obj) {
        if (obj.id === e.target.id) {
            //see if already upvoted
            if(obj.upvoters.includes(user)){

            }else if(obj.downvoters.includes(user)){
                obj.rating += 2
                obj.upvoters.push(user)  
                for(var x in obj.downvoters) {
                    if(obj.downvoters[x] === user) {
                        delete obj.downvoters[x];
                    }
                }
            }
            else{     
                obj.rating += 1
                obj.upvoters.push(user)
            }
        }
    });
    this.setState({links: stateCopy})
}
downvote=(e)=>{
    this.props.downvote({lobby: this.props.roomName, id: e.target.id});
    var stateCopy = [...this.state.links];
    const user = this.props.userid;
    stateCopy.forEach(function(obj) {
        if (obj.id === e.target.id) {
            //see if already upvoted
            if(obj.downvoters.includes(user)){

            }else if(obj.upvoters.includes(user)){
                obj.rating -= 2
                obj.downvoters.push(user)  
                for(var x in obj.upvoters) {
                    if(obj.upvoters[x] === user) {
                        delete obj.upvoters[x];
                    }
                }
            }
            else{     
                obj.rating -= 1
                obj.downvoters.push(user)
            }
        }
    });
    this.setState({links: stateCopy})
}
upvotetoneutral=(e)=>{
    this.props.upvote({lobby: this.props.roomName, id: e.target.id});
    var stateCopy = [...this.state.links];
    const user = this.props.userid;
    stateCopy.forEach(function(obj) {
        if (obj.id === e.target.id) {
            obj.rating -= 1  
            for(var x in obj.upvoters) {
                if(obj.upvoters[x] === user) {
                    delete obj.upvoters[x];
                }
            }
            
        }
    });
    this.setState({links: stateCopy})
}

downvotetoneutral=(e)=>{
    this.props.downvote({lobby: this.props.roomName, id: e.target.id});
    var stateCopy = [...this.state.links];
    const user = this.props.userid;
    stateCopy.forEach(function(obj) {
        if (obj.id === e.target.id) {
            obj.rating += 1  
            for(var x in obj.downvoters) {
                if(obj.downvoters[x] === user) {
                    delete obj.downvoters[x];
                }
            }
            
        }
    });
    this.setState({links: stateCopy})
}

componentDidMount(){
    this.props.target?( this.getLinksMine()):( this.getLinks());
    this.props.updateNotificationsSeen({lobby: this.props.roomName, userID: this.props.userid, notificationType: "linksSeen", totalNotifications: this.props.lobbyData.linkNotifications});
}
render(){
return(
<div className="resources-links">
        {
            //share a link
            this.state.linksform && 
            <div className="resources-links-form-outer">
            <div className="resources-links-form">
            <div className="links-close" onClick={this.closeform}>X</div>
            <h1>Share a Link</h1>
            <p>Share helpful resources and recieve a lootbox for each upvote!</p>
            <form className="col s12" onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="input-field col s12">
                    <input  id="title" type="text" onChange={this.handleChange}/>
                    <label htmlFor="title">Title</label>
                    </div>

                    <div className="input-field col s12">
                    <input  id="url" type="text" onChange={this.handleChange}/>
                    <label htmlFor="url">Link</label>
                    </div>
                    <button type="submit center">CREATE</button><br/>
                    {
                        this.state.seconds && <p className="red-text">Please wait {300 - Math.floor(this.state.seconds)} seconds</p>
                    }
                    {
                        this.state.http && <p className="red-text">Link must include http:// or https://</p>
                    }
                    {
                        this.state.toomany && <p className="red-text">You may only have 2 active links. Delete a previous</p>
                    }
                </div>
            </form>
            </div>
            <div className="resources-links-form-close" onClick={this.closeform}></div>
            </div> 
        }
        {
            //Delete a link
            this.state.delete && <div className="delete-link" onClick={this.closeDelete}>
                <div className="delete-link-panel">
                    <h1>Delete This Link?</h1>
                    <h2>This link will be permanently deleted</h2>
                    <div className="center">
                    <button className="btn red" onClick={this.deleteLink} >YES</button><button onClick={this.closeDelete} className="btn blue">NO</button>
                    </div>
                </div>
            </div>
        }
        {
            //delete link by admin
            this.state.openAdminDelete && <div className="delete-link" >
                <div className="edit-comment-panel">
                    <h1>Delete this Link as an Admin?</h1>
                    <form className="col s12 questions-response-form" onSubmit={this.handleDeleteAsAdmin}>
                        <div className="row">
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Spam / Self Promotion"})}} name="group1" type="radio" />
                                    <span>Spam / Self Promotion</span>
                                </label>
                                </p>
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Inappropriate Language"})}} name="group1" type="radio" />
                                    <span>Inappropriate Language</span>
                                </label>
                                </p>
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Irrelevant"})}} name="group1" type="radio" />
                                    <span>Irrelevant</span>
                                </label>
                                </p>
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Duplicate"})}} name="group1" type="radio" />
                                    <span>Duplicate</span>
                                </label>
                                </p>
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Bad Link"})}} name="group1" type="radio" />
                                    <span>Bad Link</span>
                                </label>
                                </p>
                            <br/>
                            <button className=" btn red center">Yes</button><button onClick={()=>{this.setState({openAdminDelete: false})}} type="submit" className=" btn grey center">No</button>
                        </div>
                    </form>
                </div>
                <div className="close-edit-comment" onClick={()=>{this.setState({openAdminDelete: false})}}>

                </div>
            </div>
        }
        <div className="resources-links-list-all">
        
        <div className="resources-links-menu-bar">
            <div className="resources-links-menu-bar-text"><div className="sort-by">SORT BY: </div>
            <div onClick={this.getLinks} className="resources-links-menu-wrapper new-hover"><i className="material-icons">new_releases</i>New </div>
            <div onClick={this.getLinksTop} className="resources-links-menu-wrapper top-hover"><i className="material-icons">trending_up</i>Top</div>
            <div onClick={this.getLinksMine} className="resources-links-menu-wrapper top-hover"><i className="material-icons">account_circle</i>My Links</div></div>
            <div className="create-link-button " onClick={this.openform}><i className="material-icons">add</i><div className="create-link-button-text">Create</div></div>
        </div>
        {
        this.state.links && this.state.links.map(data=>{
            const upButton = data.upvoters.includes(this.props.userid) ? (<i id={data.id} onClick={this.upvotetoneutral} className="material-icons up-color-lock">arrow_drop_up</i>):(<i id={data.id} onClick={this.upvote} className="material-icons up-color">arrow_drop_up</i>); 
            const downButton = data.downvoters.includes(this.props.userid) ? (<i id={data.id} onClick={this.downvotetoneutral} className="material-icons down-color-lock">arrow_drop_down</i>):(<i id={data.id} onClick={this.downvote} className="material-icons down-color">arrow_drop_down</i>);
            const profileImage = data.profilePic?(data.profilePic):("default");
            let numberStyle = null;
            if(data.upvoters.includes(this.props.userid)){
                numberStyle = "up-color-lock";
            }else if(data.downvoters.includes(this.props.userid)){
                numberStyle = "down-color-lock";
            }
            return(<div className="resources-link resources-link-main" key={data.id}>
                    <div className="vote-arrows">
                    {upButton}
                    <div className={"vote-number "+numberStyle}>{data.rating}</div>
                    {downButton}
                    </div>
                    <div  style={{backgroundImage: "url('/images/profile/"+profileImage+".png'"}} className="resources-link-profile"></div>
                    <div className="resources-link-text">
                        <h1><a target="_blank" rel="noopener noreferrer" href={data.link}>{data.title}</a></h1>
                        <h2><a target="_blank" rel="noopener noreferrer" href={data.link}>{data.link}</a></h2>
                        <p>{data.name+" ("+data.username+") "}<i className="material-icons resources-time">access_time</i> {" "+hoursAgo(data.date.seconds)}</p>
                    </div>
                    {data.userid === this.props.userid ? (<i id={data.id} onClick={this.openDelete} className="material-icons delete-icon">delete</i>):(null)}
                    {
                        //delete as an admin
                        (this.props.isOwner || this.props.isAdmin) && data.userid !== this.props.userid ? (<i onClick={()=>{this.setState({openAdminDelete: true, adminDeleteLinkID: data.id, adminDeleteLinkUserId: data.userid})}} className="material-icons delete-icon">do_not_disturb</i>):(null)
                    }
                </div>);
            })
        }
        {
            this.state.links && this.state.links.length === 0 ? (<p className="white-text">Share a link!</p>):(null)
        }
        </div>
        <div className="resources-link-form-wide"></div>
</div>
)
}
} 

const mapDispatchToProps=(dispatch)=>{
    return{
        upvote: (data)=> {dispatch(upvote(data))},
        downvote: (data)=> {dispatch(downvote(data))},
        addLink: (data)=> {dispatch(addLink(data))},
        deleteLink: (data)=> {dispatch(deleteLink(data))},
        deleteLinkByAdmin: (data)=>{dispatch(deleteLinkByAdmin(data))}, 
        updateNotificationsSeen : (data)=>{dispatch(updateNotificationsSeen(data))}
    }
}

export default connect(null, mapDispatchToProps)(ResourcesLinks)