export const addItem = (itemData) =>{
    return(dispatch, getSatet, {getFirebase})=>{
        const firebase = getFirebase();
        const countRef = firebase.database().ref("/items/"+itemData.type+"/tier"+itemData.tier+"ItemCount");
        var datas = {
            name: itemData.name.replace(/\s/g, "")
        }
        countRef.transaction(data=>{
            var obj = {};
            obj["items/"+itemData.type+"/ItemsTier"+itemData.tier+"/"+data] = datas;
            data && firebase.database().ref().update(obj);
            return data + 1;
        }).then(()=>{dispatch({type: "ADD_ITEM_SUCCESS"})}).catch((err) => dispatch({type:"ADD_ITEM_FAIL", err}))
    }
}

export const addNews = (itemData) =>{
    return(dispatch, getSatet, {getFirestore})=>{
        const firestore = getFirestore();
        firestore.collection("news").add({
            title: itemData.title,
            date: new Date(), 
            content: itemData.content,
            image: itemData.image
        })
    }
}