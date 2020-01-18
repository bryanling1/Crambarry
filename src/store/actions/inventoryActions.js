export const setItemBody = (data) =>{
return(dispatch, getState, {getFirebase}) =>{
    const firebase = getFirebase();
        var obj = {}
        obj["/users/"+getState().firebase.auth.uid+"/itemBody"] = data.itemName
        firebase.database().ref().update(obj);
    }
}
export const setItemLegs = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["/users/"+getState().firebase.auth.uid+"/itemLegs"] = data.itemName
        firebase.database().ref().update(obj);
        }
    }
export const setItemDesk = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["/users/"+getState().firebase.auth.uid+"/itemDesk"] = data.itemName
        firebase.database().ref().update(obj);
        }
    }
export const setItemHead = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["/users/"+getState().firebase.auth.uid+"/itemHead"] = data.itemName
        firebase.database().ref().update(obj);
        
        }
    }
export const setItemHat = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["/users/"+getState().firebase.auth.uid+"/itemHat"] = data.itemName
        firebase.database().ref().update(obj);
        }
    }
export const setItemFace = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["/users/"+getState().firebase.auth.uid+"/itemFace"] = data.itemName
        firebase.database().ref().update(obj);
        }
    }