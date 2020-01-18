import React, {Component} from "react"
class FirstTime extends Component{
render(){
    return(
        <div className="first-time-wrapper">
                    <div onClick={()=>{this.props.close()}} className="first-time-close"></div>
                    <div className="firstTime">
                    Level up and open Loot Boxes to Customize your Avatar
                    <img alt="tempstuff" src="/images/firstTime/levelUp.png" width="100%"/>
                    Ways to Earn: 
                    <ol>
                        <li>Join a Class</li>
                        <li>Chat</li>
                        <li>Play Quizzes</li>
                        <li>Submit quiz questions</li>
                        <li>Ask/Answer Questions</li>
                        <li>Share useful links</li>
                    </ol>
                    <img alt="tempstuff"src="/images/firstTime/stuff.png" height="130px"/><br/><br/>
                    <button onClick={()=>{this.props.close()}} className="btn green">Cool!</button>
                    </div>
                    </div>
    )
}
}
export default FirstTime