import React, {Component} from "react"
import moment from 'moment';
import firebase from "firebase/app"

class News extends Component{
state={
    news: null
}
componentDidMount(){
    firebase.firestore().collection("news").doc(this.props.match.params.id).get().then(data=>{
        this.setState({
            news: data.data()
        })
    })
}
render(){
    return(
        <div className="news">
        <div className="container">
            <div className="row">
                <div className="col 12">
                <h1>{this.state.news  && this.state.news.title}</h1>
                <p className="home-date-small black-text"><i className="material-icons">access_time</i>{this.state.news && moment.unix(this.state.news.date.seconds).format("MMMM Do YYYY")}</p>
                <img src={this.state.news && "/images/news/"+this.state.news.image} alt={this.state.news && this.state.news.image} width="100%"/>
                <p className="content" dangerouslySetInnerHTML={this.state.news && {__html: this.state.news.content}} />
                </div>
            </div>
        </div>
        
        </div>
    )
}
}

export default News