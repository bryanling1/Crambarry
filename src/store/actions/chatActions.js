export const sendChatMessage = (message) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        firebase.push("/lobbies/" +message.roomName,  {
            message: message.message,
            user: getState().firebase.profile.username,
            date: firebase.database.ServerValue.TIMESTAMP,
            textColor: getState().firebase.profile.textColor
        }).then(()=>{dispatch({type:"CHAT_SUCCESS"})})
        .catch((err)=>{dispatch({type:"CHAT_FAILURE", err})})
        //update the last sent message
        var obj = {}
        obj["lobbyData/"+message.roomName+"/lastMessage"] = new Date();
        firebase.database().ref().update(obj);
    }
}
export const offlineuser = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var ref = firebase.database().ref("lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/status");
        var refdub = firebase.database().ref("users/"+getState().firebase.auth.uid+"/inLobby");
        ref.onDisconnect().set("offline")
        refdub.onDisconnect().set(false)
    }
}

export const addOnline = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var updates = {};
        updates["lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/xp"] = getState().firebase.profile.xp;
        updates["lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/itemBody"] = getState().firebase.profile.itemBody;
        updates["lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/itemHead"] = getState().firebase.profile.itemHead;
        updates["lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/itemLegs"] = getState().firebase.profile.itemLegs;
        updates["lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/itemDesk"] = getState().firebase.profile.itemDesk;
        updates["lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/itemFace"] = getState().firebase.profile.itemFace;
        updates["lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/itemHat"] = getState().firebase.profile.itemHat;
        updates["lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/status"] = "online";
        updates["lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/id"] = getState().firebase.auth.uid;
        updates["lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/username"] = getState().firebase.profile.username;
        updates["lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/name"] = getState().firebase.profile.firstName + " " +getState().firebase.profile.lastName ;
        updates["users/"+getState().firebase.auth.uid+"/inLobby"] = true;
        getState().firebase.profile.xp && firebase.ref().update(updates)
}
}

export const subtractOnline = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        const firebaseref = firebase.database().ref("/lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/status");
        firebaseref.transaction(data=>{
            return "offline"
        })
        var object = {};
        object["users/"+getState().firebase.auth.uid+"/inLobby"] = false;
        firebase.ref().update(object)
    }
}

export const updateXp = (amount) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var DocRef = firebase.database().ref("users/"+amount.uid+"/xp");
        var DocRefTotal = firebase.database().ref("/admin/totalxp");
        var rtref = firebase.database().ref("/lobbyusers/"+amount.lobby+"/"+amount.uid+"/xp")
        DocRef.transaction(data => {
            return data + amount.number;
          }).then(()=>{
                DocRefTotal.transaction(data=>{
                    return data+amount.number;
                }).then(()=>{
                    rtref.transaction(xp=>{
                        return xp+amount.number;
                    })
                })
          })
    }
}

export const givePresent = (data) =>{
    return(dispatch, getState, {getFirebase})=>{
        const firebase = getFirebase();
        const DocRef = firebase.database().ref("users/"+data.uid+"/presents")
        DocRef.transaction(data=>{
            return data + 1;
        })
    }
 }



