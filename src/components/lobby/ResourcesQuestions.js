import React, {Component} from "react"
import firebase from "firebase/app"
import {addQuestion, deleteQuestion, deleteQuestionByAdmin, updateNotificationsSeen} from "../../store/actions/resourcesActions"
import {connect} from "react-redux"
import OneQuestion from "./OneQuestion"
import {hoursAgo} from "../class/Resources"


class ResourcesQuestions extends Component{
state={
    linksform: false,
    links: null,
    room: null,
    title: null,
    imageurl: null,
    seconds: null,
    invalid: null,
    onequestionmode: false,
    openAdminDelete: false
}

backtoquestions = () =>{
    this.setState({onequestionmode: false})
    this.getLinks()
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
    this.props.deleteQuestion({lobby: this.props.roomName, linkid: this.state.linkidtodelete})
    this.closeDelete()
    this.getLinks();
}
handleSubmit = (e) =>{
    e.preventDefault()
    if(this.state.title && this.state.description){
        if(!this.props.user.lastLink || new Date().getTime()/1000 - this.props.user.lastLink/1000 > 300){
            if(this.state.title.length > 6 && this.state.title.length < 200 && this.state.description.length > 6 && this.state.description.length < 1000 ){
                if(this.props.userlobbydata.questions < 2 || !this.props.userlobbydata.questions ){
                    this.props.addQuestion({lobby: this.props.roomName, imageurl: this.state.imageurl, title: this.state.title, description: this.state.description})
                    this.setState({linksform: false, seconds: null, toomany: null})
                    this.getLinks();
                    
                }else{
                    this.setState({invalid:null})
                    this.setState({toomany:"too many"})
                }
            }else{
                this.setState({invalid:true})
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
    firebase.firestore().collection("lobbies/"+this.props.roomName+"/questions").orderBy("date", "desc").get().then(snapshot=>{
        let links = [];
        snapshot.forEach(data=>{
            links.push({...data.data(), id: data.id});
        })
        this.setState({links: links})
    })
}
getLinksTop = () =>{
    firebase.firestore().collection("lobbies/"+this.props.roomName+"/questions").orderBy("rating", "desc").get().then(snapshot=>{
        let links = [];
        snapshot.forEach(data=>{
            links.push({...data.data(), id: data.id});
        })
        this.setState({links: links})
    })
}
getLinksMine = () =>{
    firebase.firestore().collection("lobbies/"+this.props.roomName+"/questions").where("userid", "==", this.props.userid).get().then(snapshot=>{
        let links = [];
        snapshot.forEach(data=>{
            links.push({...data.data(), id: data.id});
        })
        this.setState({links: links})
    })
}

componentDidMount(){
    this.props.target?( this.getLinksMine()):( this.getLinks());
    this.props.updateNotificationsSeen({lobby: this.props.roomName, userID: this.props.userid, notificationType: "questionsSeen", totalNotifications: this.props.lobbyData.questionNotifications});
}
render(){
return(
<div className="resources-links resources-links-main">
        {
            this.state.linksform && 
            <div className="resources-links-form-outer">
            <div className="resources-links-form resources-questions-form">
            <div className="links-close" onClick={this.closeform}>X</div>
            <h1>Ask A Question</h1>
            <p>Reward others for helping and earn lootboxes for each upvote</p>
            <form className="col s12" onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="input-field col s12">
                    <input  id="title" type="text" onChange={this.handleChange}/>
                    <label htmlFor="title">Question</label>
                    </div>
                
                    <div className="input-field col s12">
                    <input  id="imageurl" type="text" onChange={this.handleChange}/>
                    <label htmlFor="imageurl">Image URL(Optional)</label>
                    </div>

                    <div className="input-field col s12">
                    <textarea  id="description" type="text" onChange={this.handleChange}/>
                    <label htmlFor="description">Description</label>
                    </div>
                    <button type="submit">CREATE</button><br/>
                    {
                        this.state.seconds && <p className="red-text">Please wait {300 - Math.floor(this.state.seconds)} seconds</p>
                    }
                    {
                        this.state.invalid && <p className="red-text">Your Title or Description is too short / too long</p>
                    }
                    {
                        this.state.toomany && <p className="red-text">You may only have 2 active questions. Delete a previous</p>
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
                <div className="delete-question-panel delete-link-panel">
                    <h1>Delete This Question?</h1>
                    <h2>This question will be permanently deleted</h2>
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
                    <h1>Delete this Question as an Admin?</h1>
                    <form className="col s12 questions-response-form" onSubmit={this.handleDeleteAsAdmin}>
                        <div className="row">
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Not a Question"})}} name="group1" type="radio" />
                                    <span>Not a Question</span>
                                </label>
                                </p>
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Language"})}} name="group1" type="radio" />
                                    <span>Inappropriate Language</span>
                                </label>
                                </p>
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Irrelevant"})}} name="group1" type="radio" />
                                    <span>Irrelevant</span>
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
        {!this.state.onequestionmode && 
        <div className="resources-links-list-all">
        
        <div className="resources-links-menu-bar resources-resources-menu-bar">
            <div className="resources-links-menu-bar-text"><div className="sort-by">SORT BY: </div><div onClick={this.getLinks} className="resources-links-menu-wrapper new-hover"><i className="material-icons">new_releases</i>New </div>
            <div onClick={this.getLinksTop} className="resources-links-menu-wrapper top-hover"><i className="material-icons">trending_up</i>Top</div>
            <div onClick={this.getLinksMine} className="resources-links-menu-wrapper top-hover"><i className="material-icons">account_circle</i>My Links</div></div>
            <div className="create-link-button create-question-button" onClick={this.openform}><i className="material-icons">add</i><div className="create-link-button-text">Question</div></div>
        </div>
        {
        this.state.links && this.state.links.map(data=>{
            const upButton = data.upvoters.includes(this.props.userid) ? (<i id={data.id} className="material-icons up-color-lock">arrow_drop_up</i>):(<i id={data.id} className="material-icons up-color">arrow_drop_up</i>); 
            const downButton = data.downvoters.includes(this.props.userid) ? (<i id={data.id} className="material-icons down-color-lock">arrow_drop_down</i>):(<i id={data.id} className="material-icons down-color">arrow_drop_down</i>);
            const profileImage = data.profilePic?(data.profilePic):("default");
            let numberStyle = null;
            if(data.upvoters.includes(this.props.userid)){
                numberStyle = "up-color-lock";
            }else if(data.downvoters.includes(this.props.userid)){
                numberStyle = "down-color-lock";
            }
            return(<div style={{borderLeft: data.answered?("#76ff03 5px solid"):(null)}}className="resources-link resources-question resources-link-main" key={data.id}>
                    <div className="vote-arrows" onClick={()=>{this.setState({onequestionmode: true, questionid: data.id, authorid: data.userid})}}>
                    {upButton}
                    <div onClick={()=>{this.setState({onequestionmode: true, questionid: data.id, authorid: data.userid, questionTitle: data.title})}} className={"vote-number "+numberStyle}>{data.rating}</div>
                    {downButton}
                    </div>
                    <div  style={data.image ? ({backgroundImage: "url('"+data.image+"')"}): ({backgroundImage: "url('/images/profile/"+profileImage+".png'"})} className="resources-link-profile"></div>
                    <div onClick={()=>{this.setState({onequestionmode: true, questionid: data.id, authorid: data.userid, questionTitle: data.title})}} className="resources-link-text">
                        <h1 className={data.answered ?("light-green-text text-accent-3"):(null)}>{data.title}</h1>
                        <h2 className={"resources-description"}>{data.description.substring(0, 30) + "..."}</h2>
                        <p>{data.username} <i className="material-icons resources-time">access_time</i>{hoursAgo(data.date.seconds)}</p>
                        <p className={data.answered?("light-green-text text-accent-3"):(null)} style={{position: "absolute", right: "10px", bottom: "3px"}}>{data.answered?("Answered "):("Unanswered ")}{data.comments?("("+data.comments+")"):("(0)")}</p>
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
            this.state.links && this.state.links.length === 0 ? (<p className="white-text">Ask a question!</p>):(null)
        }
        </div>
        }
        {this.state.onequestionmode && 
            <OneQuestion backtoquestions={()=>{this.backtoquestions()}} questionTitle={this.state.questionTitle} authorid={this.state.authorid}questionid={this.state.questionid} roomName={this.props.roomName} userid={this.props.userid}/>
        }
        <div className="resources-link-form-wide"></div>
</div>
)
}
} 

const mapDispatchToProps=(dispatch)=>{
    return{
        addQuestion: (data)=> {dispatch(addQuestion(data))},
        deleteQuestion: (data)=> {dispatch(deleteQuestion(data))},
        deleteLinkByAdmin: (data)=>{dispatch(deleteQuestionByAdmin(data))}, 
        updateNotificationsSeen: (data)=>{dispatch(updateNotificationsSeen(data))}
    }
}

export default connect(null, mapDispatchToProps)(ResourcesQuestions)