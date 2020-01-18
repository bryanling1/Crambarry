import React, {Component} from "react"
import {connect} from "react-redux";
import {Link} from "react-router-dom"
import moment from 'moment';
import firebase from "firebase/app"

class Home extends Component{
state={
    news: null
}
componentDidMount(){
    firebase.firestore().collection("news").orderBy("date", "desc").limit(3).get().then(snap=>{
        var news = []
        snap.forEach(data=>{
            news.push({...data.data(), id: data.id})
        })
        this.setState({
            news: news
        })
    })
}
render(){
    return(
        this.state.news && 
        <div className="home-page home-fade" >
        {
            !this.props.auth &&
            <div className="landing-page center">
                <div className="container">
                    <div className="row">
                    <h1>A Community that Learns Together, Excels Together.</h1>
                    <br/>
                    <h2>Reimagine your Instagram study group chat and 
                    join your classmates on a journey through academic excellence.</h2>
                    <br/>
                    <Link to="/login/direct"><img className="google-button"alt="google-signin" width="300px" src="/images/btn_google_signin_light_normal_web@2x.png"/></Link>
                    <br/>
                    <br/>
                    <img width="90%"alt="main" src="images/home/main.svg"/>
                    </div>
                </div>
                
            </div>
        }
        {this.props.auth &&
        <div className="home center-align center" >
           
           <div className="container">
            <div className="row">
            <div className="col s12 m6">
                <Link to={this.state.news && "/news/"+this.state.news[0].id}>
                <div className="home-banner">
                    <h1>{this.state.news && this.state.news[0].title}</h1>
                    <p className="home-date"> <i className="material-icons">access_time</i>{this.state.news && moment.unix(this.state.news[0].date.seconds).format("MMMM Do YYYY")}</p>
                    <p>{this.state.news && this.state.news[0].content.substr(0, 200)}...</p>
                </div>
                </Link>
                
            </div>
            <div className="col s12 m6">
              
            </div>
            </div>
            
           </div>
           <div className="home-side" style={this.state.news && {backgroundImage: "url('/images/news/"+ this.state.news[0].image+"')"}}></div>
           <div className="home-background" style={this.state.news && {backgroundImage: "url('/images/news/"+ this.state.news[0].image+"')"}}></div>
        </div>
        }
            {/* NEEEEEEWWWWWWSSSSSSSS LIST */}
            <br/>
            <div className="container">
            <div className="row news-banner">
            <h2>Latest News</h2>
                {
                    this.state.news && this.state.news.map(data=>{
                        return(
                            <Link to={"/news/"+data.id}  key={data.title}>
                            <div className="col s12 m4 ">
                                <div className="news-panel-small z-depth-1">
                                <div className="news-panel-small-content">
                                <h1>{data.title}</h1>
                                <p className="home-date-small"><i className="material-icons">access_time</i>{moment.unix(data.date.seconds).format("MMMM Do YYYY")}</p>
                                </div>
                                <div className="home-date-small-white">{data.content.substr(0,50)}...</div>
                                <div className="news-panel-small-back" style={{backgroundImage: "url('/images/news/"+data.image+"')"}}></div>
                                </div>
                            </div>
                            </Link>
                        )
                    })
                }
                
            </div>
            </div>
            {/* WHAAAAAT ISSSSS ITTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT */}
            <div className="red darken-3">
            <div className="container">
            <div className="row what-is">
                <div className="col s12 m6">
                    <h1>What is Crambarry?</h1>
                    <p>
                        Imagine a gamified chat room where productivity skyrockets as you link arms with your fellow classmates on a journey
                        to mastery of your subject. Well, buckle your seatbelts and make sure your hands are washed.
                    </p>
                </div>
                <div className="col s12 m6">
                    <div className="floating-what-is">
                        <div className="preview1"></div>
                        <div className="preview2"></div>
                        <div className="preview1-shadow"></div>
                        <div className="preview2-shadow"></div>
                    </div>
                </div>
            </div>
            </div>
            </div>
        </div>
    )
}
}
const mapStateToProps = (state) =>{
    return{
        auth: state.firebase.auth.uid
    }
}
export default connect(mapStateToProps)(Home)