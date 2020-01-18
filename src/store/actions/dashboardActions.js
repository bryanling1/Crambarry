export const addLobby = (code) =>{
    return(dispatch, getState, {getFirestore, getFirebase})=>{
        
        const firebase = getFirebase();
        firebase.database().ref("lobbyData").orderByChild("code").equalTo(code).once("value").then(snapshot=>{
            if(snapshot.exists()){
                snapshot.forEach(data=>{
                    const lobbyname = data.val().name;
                    //set the new lobby as a thing
                    var lobbydata = {
                        name: lobbyname 
                    }
                    var obj = {};
                    obj["/usersinlobby/"+getState().firebase.auth.uid+"/"+lobbyname] = lobbydata ;
                    firebase.database().ref().update(obj);
                        dispatch({type: "ADD_LOBBY_SUCCESS"})
            })
            }else{
                dispatch({type: "ADD_LOBBY_ERROR"})
            }
           
        })
    }
}

export const updateNotificationsSeenUser  = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["users/"+data.userID+"/notificationsSeen"] = data.totalNotifications;
        firebase.database().ref().update(obj)
    }
}