export const addItem = (item) =>{
    return(dispatch, getState, {getFirestore, getFirebase})=>{
        const firebase = getFirebase();
        var obj = {}
        obj["/userItems/"+getState().firebase.auth.uid+"/"+item.name+"/name"] = item.name;
        firebase.database().ref().update(obj);
        //remove a box
        const removePresentRef = firebase.database().ref("users/"+getState().firebase.auth.uid+"/presents")
        removePresentRef.transaction(data=>{
            if(data > 0){
                return data - 1
            }else{
                return data
            }
        })
        //if the item is a dupicate, give the correct amount of coins
        if(item.isDup){
            var coinsRef = firebase.database().ref("users/"+getState().firebase.auth.uid+"/tokens")
            let giveXp = 0
            switch(item.tier){
                case 4:
                    giveXp = 50;
                    break;
                case 3:
                  giveXp = 25;
                  break;
                case 2:
                    giveXp = 15;
                    break;
                default: 
                    giveXp = 5;
                    break;
            }
            coinsRef.transaction(data=>{
                return data + giveXp
            })
        }else{
            //increase the number of items the user found by 1
            const itemCountRef = firebase.database().ref("/users/"+getState().firebase.auth.uid+"/items");
            itemCountRef.transaction(data=>{
                return data + 1;
            })
        }
        //increae number of total boxes open for admins
        const adminBoxes = firebase.database().ref("admin/boxesOpened");
        adminBoxes.transaction(data=>{
            return data + 1;
        }).then(()=>{
        //increase the type of item found
        const adminBoxTier = firebase.database().ref("admin/itemsFoundT"+item.tier)
        adminBoxTier.transaction(data=>{
            return data + 1;
        })
        })
       

    }
}

export const buyGiftbox = (n) =>{
    return(dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        const tokensRef = firebase.database().ref("/users/"+getState().firebase.auth.uid+"/tokens");
        const presentsRef = firebase.database().ref("/users/"+getState().firebase.auth.uid+"/presents");

        tokensRef.transaction(data=>{
            if(data >= n.price){
                presentsRef.transaction(data=>{
                        return data + n.boxes;
                })
                return data - n.price;
            }
        })

    }
}