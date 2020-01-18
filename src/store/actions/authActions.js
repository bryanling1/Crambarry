export const signIn = (creds) =>{
    return(dispatch, getState, {getFirestore, getFirebase} ) =>{
        const firebase = getFirebase();
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider).then(function(result) {
            /*
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...*/
          }).catch(function(error) {
              /*
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...*/
          });
        
    }
}
export const signUp = (userData) =>{
    return(dispatch, getState, {getFirebase})=>{
        const firebase = getFirebase();
        const itemBodyGen = ["bluetee-body-idle", "whitetee-body-idle", "redtee-body-idle"][Math.floor(Math.random()*3)]
        const itemDeskGen = "pine-desk-idle"
        const itemHeadGen = ["olof-head-idle", "alexa-head-idle", "mike-head-idle", "barbra-head-idle"][Math.floor(Math.random()*4)]
        const itemLegsGen =  "jeanpants-legs-idle"
        var data = {
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            lobbynames: [],
            xp: 100,
            level: 1,
            tokens: 0,
            textColor: ["light-blue-text text-accent-1", 
                        "blue-text", 
                        "red-text text-accent-1",
                        "orange-text",
                        "amber-text",
                        "green-text lighten-1", 
                        "teal-text text-lighten-1",
                        "pink-text text-lighten-2"][Math.floor(Math.random()*8)],
            presents: 5, 
            inLobby: "",
            items: 6,
            itemBody: itemBodyGen,
            itemDesk: itemDeskGen,
            itemFace: "none-face-idle",
            itemHat: "none-hat-idle",
            itemHead: itemHeadGen,
            itemLegs: itemLegsGen,
            karma: 1,
            dateJoined: new Date().getTime()/1000,
            notifications: 0,
            notificationsSeen: 0,

            }
            var obj = {};
            //set the items found in user items ref
            obj["users/"+getState().firebase.auth.uid] = data;
            obj["userItems/"+getState().firebase.auth.uid+"/"+itemBodyGen+"/name"] = itemBodyGen;
            obj["userItems/"+getState().firebase.auth.uid+"/"+itemDeskGen+"/name"] = itemDeskGen;
            obj["userItems/"+getState().firebase.auth.uid+"/"+itemHeadGen+"/name"] = itemHeadGen;
            obj["userItems/"+getState().firebase.auth.uid+"/"+itemLegsGen+"/name"] = itemLegsGen;
            obj["userItems/"+getState().firebase.auth.uid+"/none-hat-idle/name"] = "none-hat-idle";
            obj["userItems/"+getState().firebase.auth.uid+"/none-face-idle/name"] = "none-face-idle";
            firebase.database().ref().update(obj).then(()=>{
                firebase.database().ref("lobbyData").orderByChild("code").equalTo(userData.lobbyCode).once("value").then(snapshot=>{
                    snapshot.forEach(data=>{
                        if(data.val()){
                            const lobbyname = data.val().name;
                            //set the new lobby as a thing
                            var lobbydata = {
                                name: lobbyname 
                            }
                            var obj = {};
                            obj["/usersinlobby/"+getState().firebase.auth.uid+"/"+lobbyname] = lobbydata ;
                            firebase.database().ref().update(obj);
                                dispatch({type: "ADD_LOBBY_SUCCESS"})
                        }else{
                            dispatch({type: "ADD_LOBBY_ERROR"})
                        }
                    })
                    
                })
            });
    }
}

export const signOut = () =>{
    return(dispatch, getState, {getFirebase})=>{
        const firebase = getFirebase();
        firebase.auth().signOut().then(()=>{
            dispatch({type: "SIGNOUT"})
        }).catch((err)=>{dispatch({type: "SIGNOUT_ERROR", err})})
    }
}