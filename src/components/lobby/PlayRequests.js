import React, {Component} from "react"
import {firebaseConnect} from "react-redux-firebase"
import {connect} from "react-redux"
import {compose} from "redux"
import {updateQuestionRequest, acceptQuestionRequest,  declineQuestionRequest} from "../../store/actions/resourcesActions"
import {hoursAgo} from "../class/Resources"

class PlayRequests extends Component{
state={
    createQuestionForm: false,
    questionType: null,
    question: null,
    questionImageUrl: null,
    answer: null,
    answerImageUrl: null,
    option2: null,
    option3: null,
    option4: null,
    delete: false,
    accept: false,
    decline: false
}
handleChange=(e)=>{
    this.setState({
        [e.target.id]: e.target.value
    })
}
accept=(e)=>{
    e.preventDefault();
    this.props.acceptQuestionRequest(
        {lobby: this.props.roomName, 
        type: this.state.questionType === "mc"?("mc"):("sa"), 
        question: this.state.question,
        questionImage: this.state.questionImageUrl,
        answer: this.state.answer,
        answerImage: this.state.answerImageUrl,
        option2: this.state.option2,
        option3: this.state.option3,
        option4: this.state.option4,
        unitID: this.props.unitID,
        authorID: this.state.authorID,
        authorUsername: this.state.authorUsername,
        questionID: this.state.questionID
        }
    )
}
decline=(e)=>{
    e.preventDefault();
    this.props.declineQuestionRequest(
        {lobby: this.props.roomName, 
        unitID: this.props.unitID,
        questionID: this.state.questionID, 
        authorID: this.state.authorID
        }
    )
}
//update question
handleUpdateQuestion=(e)=>{
    e.preventDefault();
    //for multiple choice and short answer, question can be null if questionimageUrl is defined
    if(this.state.questionType === "mc" || this.state.questionType === "sa"){
        if(this.state.question || this.state.questionImageUrl){
            if(this.state.questionType === "mc"){
                if(this.state.answer && this.state.option2 && this.state.option3 && this.state.option4){
                    this.props.updateQuestion(
                        {lobby: this.props.roomName, 
                        type: this.state.questionType === "mc"?("mc"):("sa"), 
                        question: this.state.question,
                        questionImage: this.state.questionImageUrl,
                        answer: this.state.answer,
                        answerImage: this.state.answerImageUrl,
                        option2: this.state.option2,
                        option3: this.state.option3,
                        option4: this.state.option4,
                        unitID: this.props.unitID,
                        questionID: this.state.questionUpdateID
                        }
                    )
                    this.setState({
                        updateQuestionForm: false,
                        questionType: null,
                        question: null,
                        questionImageUrl: null,
                        answer: null,
                        answerImageUrl: null,
                        option2: null,
                        option3: null,
                        option4: null
                    })
                }
            }else{
                if(this.state.answer){
                    this.props.updateQuestion(
                        {lobby: this.props.roomName, 
                        type: this.state.questionType === "mc"?("mc"):("sa"), 
                        question: this.state.question,
                        questionImage: this.state.questionImageUrl,
                        answer: this.state.answer,
                        answerImage: this.state.answerImageUrl,
                        option2: this.state.option2,
                        option3: this.state.option3,
                        option4: this.state.option4,
                        unitID: this.props.unitID, 
                        questionID: this.state.questionUpdateID
                        }
                    )
                    this.setState({
                        updateQuestionForm: false,
                        questionType: null,
                        question: null,
                        questionImageUrl: null,
                        answer: null,
                        answerImageUrl: null,
                        option2: null,
                        option3: null,
                        option4: null
                    })
                }
            }
            
        }
    }else if(this.state.questionType === "fc"){
        if( (this.state.question || this.state.questionImageUrl) && (this.state.answer || this.state.answerImageUrl) ){
            this.props.updateQuestion(
                {lobby: this.props.roomName, 
                type: "fc", 
                question: this.state.question,
                questionImage: this.state.questionImageUrl,
                answer: this.state.answer,
                answerImage: this.state.answerImageUrl,
                option2: this.state.option2,
                option3: this.state.option3,
                option4: this.state.option4,
                unitID: this.props.unitID,
                questionID: this.state.questionUpdateID
                }
            )
            this.setState({
                updateQuestionForm: false,
                questionType: null,
                question: null,
                questionImageUrl: null,
                answer: null,
                answerImageUrl: null,
                option2: null,
                option3: null,
                option4: null
            })
        }
    }
}
render(){
return(
<div>
    {
            //Approve Question
            this.state.accept && <div className="delete-link" onClick={()=>{this.setState({accept: false})}}>
                <div className="delete-link-panel">
                    <h1>Approve Question?</h1>
                    <h2>This question will be added</h2>
                    <div className="center">
                    <button className="btn light-green accent-3" onClick={this.accept} >YES</button><button onClick={()=>{this.setState({accept: false})}} className="btn grey">NO</button>
                    </div>
                </div>
            </div>
    }
    {
            //Decline Question
            this.state.decline && <div className="delete-link" onClick={()=>{this.setState({decline: false})}}>
                <div className="delete-link-panel">
                    <h1>Decline Question?</h1>
                    <h2><b>Remember:</b> you can edit requests and still give credit</h2>
                    <div className="center">
                    <button className="btn red" onClick={this.decline} >YES</button><button onClick={()=>{this.setState({decline: false})}} className="btn grey">NO</button>
                    </div>
                </div>
            </div>
    }
    {
        //edit a question
        this.state.updateQuestionForm && 
            <div className="resources-links-form-outer">
            <div className="resources-links-form resources-play-form">
            <h1>Create A Question</h1>
            <form className="col s12" onSubmit={this.handleUpdateQuestion}>
                    <div className="row"  style={{marginBottom: "0px"}}>
                    <div className="input-field col s6"  style={{marginBottom: "0px"}}>
                    <p>
                        <label>
                            <input checked={this.state.questionType === "mc"?("checked"):(null)} onClick={()=>{this.setState({questionType: "mc", answerImageUrl: null})}} name="group1" type="radio" />
                            <span className="radio-width-2">Multiple Choice</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input checked={this.state.questionType === "fc"?("checked"):(null)} onClick={()=>{this.setState({questionType: "fc"})}} name="group1" type="radio" />
                            <span className="radio-width-2">Flash Card</span>
                        </label>
                    </p>
                    </div>
                    <div className="input-field col s6"  style={{marginBottom: "0px"}}>
                    <p>
                        <label>
                            <input checked={this.state.questionType === "sa"?("checked"):(null)} onClick={()=>{this.setState({questionType: "sa", answerImageUrl: null})}} name="group1" type="radio" />
                            <span className="radio-width-2">Short Answer</span>
                        </label>
                    </p>
                    </div>
                    </div>
                <div style={{marginBottom: "0px"}} className="row">
                    <div style={{marginBottom: "0px"}} className="input-field col s8">
                    <label className={this.state.question?("active"):(null)}>Question</label>
                    <input  value={this.state.question?(this.state.question):(null)} id="question" type="text" onChange={this.handleChange}/>
                    
                    </div> 
                    <div  style={{marginBottom: "0px"}} className="input-field col s4">
                    <label className={this.state.questionImageUrl?("active"):(undefined)}>Image URL</label>
                    <input value={this.state.questionImageUrl?(this.state.questionImageUrl):(undefined)} id="questionImageUrl" type="text" onChange={this.handleChange}/>
                    </div> 
                </div>
                {
                this.state.questionType !== "mc" 
                ?(this.state.questionType !== "sa"?(<div  style={{marginBottom: "0px"}}className="row">
                    <div   style={{marginBottom: "0px"}}className="input-field col s8">
                    <input value={ this.state.answer ? (this.state.answer):(null)} id="answer" type="text" onChange={this.handleChange}/>
                    <label className={this.state.answer?("active"):(null)} htmlFor="answer">Answer</label>
                    </div> 
                    <div  style={{marginBottom: "0px"}} className="input-field col s4">
                    <input  value={this.state.answerImageUrl?(this.state.answerImageUrl):(undefined)} id="answerImageUrl" type="text" onChange={this.handleChange}/>
                    <label className={this.state.answerImageUrl?("active"):(undefined)} htmlFor="answerImageUrl">Image URL</label>
                    </div> 
                </div>):(
                    <div  style={{marginBottom: "0px"}}className="row">
                    <div   style={{marginBottom: "0px"}}className="input-field col s12">
                    <input  value={ this.state.answer ? (this.state.answer):(null)} id="answer" type="text" onChange={this.handleChange}/>
                    <label className={this.state.answer?("active"):(null)}  htmlFor="answer">Answer</label>
                    </div> 
                </div>
                ))
                :(<div  style={{marginBottom: "0px"}}className="row">
                    <div   style={{marginBottom: "0px"}}className="input-field col s6">
                    <input  value={ this.state.answer ? (this.state.answer):(null)} id="answer" type="text" onChange={this.handleChange}/>
                    <label className={this.state.answer?("active"):(null)} htmlFor="answer">Answer</label>
                    </div> 
                    <div   style={{marginBottom: "0px"}}className="input-field col s6">
                    <input value={ this.state.option2 ? (this.state.option2):(null)} id="option2" type="text" onChange={this.handleChange}/>
                    <label className={this.state.option2 ?("active"):(null)} htmlFor="option2">Option 2</label>
                    </div> 
                    <div   style={{marginBottom: "0px"}}className="input-field col s6">
                    <input  value={ this.state.option3 ? (this.state.option3):(null)}id="option3" type="text" onChange={this.handleChange}/>
                    <label className={this.state.option3 ?("active"):(null)}htmlFor="option3">Option 3</label>
                    </div> 
                    <div   style={{marginBottom: "0px"}}className="input-field col s6">
                    <input value={ this.state.option4 ? (this.state.option4):(null)} id="option4" type="text" onChange={this.handleChange}/>
                    <label className={this.state.option4 ?("active"):(null)}htmlFor="option4">Option 4</label>
                    </div> 
                </div>)
            }
                <div className="row">
                <button type="submit">UPDATE</button><br/>
                </div>
            </form>
            </div>
            <div className="resources-links-form-close" onClick={()=>{this.setState({updateQuestionForm: false})}}></div>
            </div> 
    }
    <div className="row" style={{margin: 0}}>
    <p style={{cursor: "pointer"}}onClick={this.props.backToUnits}className="white-text">{"< Back to Questions"}</p>
    </div>
    {
        //map the question in the database
        this.props.questions && Object.entries(this.props.questions).map(data=>{
            return(
                <div className="question-preview-container" style={{position: "relative"}}>
                    <i onClick={()=>{this.setState({updateQuestionForm: true, 
                        truecreateQuestionForm: false,
                        questionType: data[1].type,
                        question: data[1].question ? (data[1].question):(null),
                        questionImageUrl: data[1].questionPicture ? (data[1].questionPicture):(null),
                        answer: data[1].answer ? (data[1].answer):(null),
                        answerImageUrl: data[1].answerPicture ? (data[1].answerPicture):(null),
                        option2: data[1].option2 ? (data[1].option2):(null),
                        option3: data[1].option3 ? (data[1].option3):(null),
                        option4: data[1].option4 ? (data[1].option4):(null),
                        questionUpdateID: data[0]
                        })}} className="material-icons delete-icon">edit</i>
                    <p className="set-username" style={{bottom: "43px"}}><i class="material-icons">person</i>{data[1].authorUsername}</p>
                    <p className="set-last-edit" style={{bottom: "43px"}}><i class="material-icons">access_time</i>{hoursAgo(new Date(data[1].lastEdit).getTime()/1000)}</p>
                    <div className="question-preview-side">
                        {
                            data[1].question
                        }
                        {
                            data[1].questionPicture?(
                                <img alt={data[1].questionPicture} src={data[1].questionPicture}/>
                            ):(null)
                        }
                    </div>
                    <div className="question-preview-side">
                    {
                            data[1].answer
                    }
                    {
                            data[1].answerPicture?(
                                <img alt={data[1].answerPicture} src={data[1].answerPicture}/>
                            ):(null)
                    }
                    </div>
                <div className="request-buttons">
                        <div onClick={()=>{this.setState({accept: true, 
                        questionType: data[1].type,
                        question: data[1].question ? (data[1].question):(null),
                        questionImageUrl: data[1].questionPicture ? (data[1].questionPicture):(null),
                        answer: data[1].answer ? (data[1].answer):(null),
                        answerImageUrl: data[1].answerPicture ? (data[1].answerPicture):(null),
                        option2: data[1].option2 ? (data[1].option2):(null),
                        option3: data[1].option3 ? (data[1].option3):(null),
                        option4: data[1].option4 ? (data[1].option4):(null),
                        questionID: data[0],
                        authorID: data[1].authorID,
                        authorUsername: data[1].authorUsername
                        })}}className="request-approve-button">Approve</div>
                        <div onClick={()=>{this.setState({decline: true, 
                        questionID: data[0],authorID: data[1].authorID
                        })}}className="request-decline-button">Decline</div>
                </div>
                </div>
            )
        })
    }

</div>
)
}
} 
const mapStateToProps = (state, ownProps) =>{
    return{
        questions: state.firebase.data.questionRequests && state.firebase.data.questionRequests[ownProps.roomName][ownProps.unitID],
    }
}
const mapDispatchToProps=(dispatch)=>{
    return{
        updateQuestion: (data)=>{dispatch(updateQuestionRequest(data))},
        acceptQuestionRequest: (data)=>{dispatch(acceptQuestionRequest(data))},
        declineQuestionRequest: (data)=>{dispatch(declineQuestionRequest(data))}
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firebaseConnect((props)=>{
        return[
            {path: "questionRequests/"+props.roomName+"/"+props.unitID},
        ]
    }),
    
)(PlayRequests)