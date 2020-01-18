//this function gives the user a notifiction 
//needs parameters:
//userID, title, description, lobby, type
export const pushNotification  = (data) =>{
        console.log(data)
        const firebase = data.getFirebase;
        //get a new key
        const newKey = firebase.database().ref("notifications/"+data.userID).push().key
        var obj = {}
        obj["notifications/"+data.userID+"/"+newKey+"/date"] = new Date();
        obj["notifications/"+data.userID+"/"+newKey+"/title"] = data.title;
        obj["notifications/"+data.userID+"/"+newKey+"/description"] = data.description;
        obj["notifications/"+data.userID+"/"+newKey+"/lobby"] = data.lobby;
        obj["notifications/"+data.userID+"/"+newKey+"/type"] = data.type;
        firebase.database().ref().update(obj).then(()=>{
            //increment the user's notifications by one
            const userNotiRef = firebase.database().ref("/users/"+data.userID+"/notifications")
            userNotiRef.transaction(run=>{
                return (run || 0) + 1
            })
        })
}


export const upvote = (data) =>{
    return(dispatch, getState, {getFirestore, getFirebase}) =>{
        const firestore = getFirestore();
        const firebase = getFirebase();
        const username = getState().firebase.auth.uid;
        const docRef = firestore.collection("lobbies/"+data.lobby+"/links").doc(data.id)
        //get data
        firestore.collection("lobbies/"+data.lobby+"/links").doc(data.id).get().then(data2=>{
            let upvoters = data2.data().upvoters;
            let downvoters = data2.data().downvoters;
            let author = data2.data().userid;
            let allUpvoters = data2.data().allUpvoters;
            //check if already upvoted
            if(!upvoters.includes(username)){
                //if the user has it downvoted, increase rating by 2 to accoutn for netural vote
                let amount = 1;
                if(downvoters.includes(username)){
                    amount = 2;
                }
                downvoters.pop(downvoters.indexOf(username));
                //give the author atokens if the user has not upvoted before
                if(!allUpvoters.includes(username)){
                    const authorRef = firebase.database().ref("users/"+author+"/tokens");
                    authorRef.transaction(run=>{
                        return run + 5;
                    }).then(()=>{
                        //push a notification
                        pushNotification({getFirebase: getFirebase(), 
                            userID: author, title:"Money in the Bank!",
                             description: (getState().firebase.profile.username+ " upvoted your link and you recieved +5 tokens!"), 
                             type: "link", 
                             lobby: data.lobby})
                    })
                }
                //handle upvotes
                firestore.runTransaction(t=>{
                    return t.get(docRef).then(doc=>{
                        const newRating = doc.data().rating + amount
                        t.update(docRef, {rating: newRating, upvoters: firestore.FieldValue.arrayUnion(username), downvoters:downvoters, allUpvoters: firestore.FieldValue.arrayUnion(username)})
                    })
                })
            }else{
                upvoters.pop(upvoters.indexOf(username));
                firestore.runTransaction(t=>{
                    return t.get(docRef).then(doc=>{
                        const newRating = doc.data().rating - 1;
                        t.update(docRef, {rating: newRating, upvoters: upvoters})
                    })
                }) 
            }   
        })
    }
}


export const downvote = (data) =>{
    return(dispatch, getState, {getFirestore}) =>{
        const firestore = getFirestore();
        const username = getState().firebase.auth.uid;
        const docRef = firestore.collection("lobbies/"+data.lobby+"/links").doc(data.id)
        //get data
        firestore.collection("lobbies/"+data.lobby+"/links").doc(data.id).get().then(data=>{
            let upvoters = data.data().upvoters;
            let downvoters = data.data().downvoters;
            //check if already upvoted
            if(!downvoters.includes(username)){
                //if the user has it upvoted, decrease rating by 2 to accoutn for netural vote
                let amount = 1;
                if(upvoters.includes(username)){
                    amount = 2;
                }
                upvoters.pop(upvoters.indexOf(username));
                firestore.runTransaction(t=>{
                    return t.get(docRef).then(doc=>{
                        const newRating = doc.data().rating - amount
                        t.update(docRef, {rating: newRating, downvoters: firestore.FieldValue.arrayUnion(username), upvoters:upvoters})
                    })
                })
            }else{
                downvoters.pop(downvoters.indexOf(username));
                firestore.runTransaction(t=>{
                    return t.get(docRef).then(doc=>{
                        const newRating = doc.data().rating + 1;
                        t.update(docRef, {rating: newRating, downvoters: downvoters})
                    })
                }) 
            }   
        })
    }
}
export const addLink = (data) =>{
    return(dispatch, getState, {getFirestore, getFirebase}) =>{
        const firestore = getFirestore();
        const firebase = getFirebase();
        firestore.collection("lobbies/"+data.lobby+"/links").add({
            allUpvoters: [getState().firebase.auth.uid],
            date: new Date(),
            downvoters: [],
            link: data.link,
            name: getState().firebase.profile.firstName + " " + getState().firebase.profile.lastName,
            rating: 1,
            title: data.title,
            upvoters: [getState().firebase.auth.uid],
            username: getState().firebase.profile.username,
            userid: getState().firebase.auth.uid
        })
        var obj = {}
        obj["/users/"+ getState().firebase.auth.uid+"/lastLink"] = new Date().getTime();
        firebase.database().ref().update(obj).then(()=>{
            //increase the number of links by 1 for the user
            const userRef = firebase.database().ref("/lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/links")
            userRef.transaction(run=>{
                return (run || 0) + 1;
            }).then(()=>{
                //increase the number of link notifications
                const lobbyRef = firebase.database().ref("/lobbyData/"+data.lobby+"/linkNotifications")
                lobbyRef.transaction(run=>{
                    return (run || 0) + 1;
            }).then(()=>{
                //increase the number of link notifications of self so you dont see your own notification
                const lobbyUserRef = firebase.database().ref("/lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/linksSeen")
                lobbyUserRef.transaction(run=>{
                    return (run || 1) + 1;
                })
            })
            })
        })
    }
}

export const deleteLink = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        const firestore = getFirestore();
        //remove the link
        firestore.collection("lobbies/"+data.lobby+"/links/").doc(data.linkid).delete().then(()=>{
        //give the user a nother link that they can add
        const linkCountRef = firebase.database().ref("lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/links");
        linkCountRef.transaction(run=>{
            return run - 1;
        })
        })
       
    }
}

export const addQuestion = (data) =>{
    return(dispatch, getState, {getFirestore, getFirebase}) =>{
        const firestore = getFirestore();
        const firebase = getFirebase();
        firestore.collection("lobbies/"+data.lobby+"/questions").add({
            allUpvoters: [getState().firebase.auth.uid],
            date: new Date(),
            downvoters: [],
            image: data.imageurl?(data.imageurl):(null),
            description: data.description,
            name: getState().firebase.profile.firstName + " " + getState().firebase.profile.lastName,
            rating: 1,
            title: data.title,
            upvoters: [getState().firebase.auth.uid],
            username: getState().firebase.profile.username,
            userid: getState().firebase.auth.uid,
            answered: false
        })
        var obj = {}
        obj["/users/"+ getState().firebase.auth.uid+"/lastLink"] = new Date().getTime();
        firebase.database().ref().update(obj).then(()=>{
            //increase the number of links by 1 for the user
            const userRef = firebase.database().ref("/lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/questions")
            userRef.transaction(run=>{
                return run + 1 | 1;
            }).then(()=>{
                //increase the number of question notifications
                const lobbyRef = firebase.database().ref("/lobbyData/"+data.lobby+"/questionNotifications")
                lobbyRef.transaction(run=>{
                    return (run || 1) + 1;
                })
                //increase the number of link notifications of self so you dont see your own notification
                const lobbyUserRef = firebase.database().ref("/lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/questionsSeen")
                lobbyUserRef.transaction(run=>{
                    return (run || 1) + 1;
                })
            })
        })
    }
}

export const deleteQuestion = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        const firestore = getFirestore();
        //remove the question  
        firestore.collection("lobbies/"+data.lobby+"/questions/").doc(data.linkid).delete().then(()=>{
        //give the user a nother link that they can add
        const linkCountRef = firebase.database().ref("lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/questions");
        console.log(data)
        linkCountRef.transaction(run=>{
            return run - 1;
            })
        })
       
    }
}

export const upvotequestion = (data) =>{
    return(dispatch, getState, {getFirestore, getFirebase}) =>{
        const firestore = getFirestore();
        const firebase = getFirebase();
        const username = getState().firebase.auth.uid;
        const docRef = firestore.collection("lobbies/"+data.lobby+"/questions").doc(data.id)
        //get data
        firestore.collection("lobbies/"+data.lobby+"/questions").doc(data.id).get().then(data2=>{
            let upvoters = data2.data().upvoters;
            let downvoters = data2.data().downvoters;
            let author = data2.data().userid;
            let allUpvoters = data2.data().allUpvoters;
            //check if already upvoted
            if(!upvoters.includes(username)){
                //if the user has it downvoted, increase rating by 2 to accoutn for netural vote
                let amount = 1;
                if(downvoters.includes(username)){
                    amount = 2;
                }
                downvoters.pop(downvoters.indexOf(username));
                //give the author tokens if the user has not upvoted before
                if(!allUpvoters.includes(username)){
                    const authorRef = firebase.database().ref("users/"+author+"/presents");
                    authorRef.transaction(run=>{
                        return run + 5;
                    }).then(()=>{
                        //push a notification
                        pushNotification({getFirebase: getFirebase(), 
                            userID: author, 
                            title:"Cash Money!",
                             description: (getState().firebase.profile.username+ " upvoted your question and you recieved +5 tokens!"), 
                             type: "question", 
                             lobby: data.lobby})
                    })
                }
                //handle upvotes
                firestore.runTransaction(t=>{
                    return t.get(docRef).then(doc=>{
                        const newRating = doc.data().rating + amount
                        t.update(docRef, {rating: newRating, upvoters: firestore.FieldValue.arrayUnion(username), downvoters:downvoters, allUpvoters: firestore.FieldValue.arrayUnion(username)})
                    })
                })
            }else{
                upvoters.pop(upvoters.indexOf(username));
                firestore.runTransaction(t=>{
                    return t.get(docRef).then(doc=>{
                        const newRating = doc.data().rating - 1;
                        t.update(docRef, {rating: newRating, upvoters: upvoters})
                    })
                }) 
            }   
        })
    }
}

export const downvotequestion = (data) =>{
    return(dispatch, getState, {getFirestore}) =>{
        const firestore = getFirestore();
        const username = getState().firebase.auth.uid;
        const docRef = firestore.collection("lobbies/"+data.lobby+"/questions").doc(data.id)
        //get data
        firestore.collection("lobbies/"+data.lobby+"/questions").doc(data.id).get().then(data=>{
            let upvoters = data.data().upvoters;
            let downvoters = data.data().downvoters;
            //check if already upvoted
            if(!downvoters.includes(username)){
                //if the user has it upvoted, decrease rating by 2 to accoutn for netural vote
                let amount = 1;
                if(upvoters.includes(username)){
                    amount = 2;
                }
                upvoters.pop(upvoters.indexOf(username));
                firestore.runTransaction(t=>{
                    return t.get(docRef).then(doc=>{
                        const newRating = doc.data().rating - amount
                        t.update(docRef, {rating: newRating, downvoters: firestore.FieldValue.arrayUnion(username), upvoters:upvoters})
                    })
                })
            }else{
                downvoters.pop(downvoters.indexOf(username));
                firestore.runTransaction(t=>{
                    return t.get(docRef).then(doc=>{
                        const newRating = doc.data().rating + 1;
                        t.update(docRef, {rating: newRating, downvoters: downvoters})
                    })
                }) 
            }   
        })
    }
}

export const addQuestionComment = (data) =>{
    return(dispatch, getState, {getFirestore, getFirebase}) =>{
        const firestore = getFirestore();
        firestore.collection("lobbyQuestionResponses/"+data.lobby+"/"+data.id).add({
            allUpvoters: [getState().firebase.auth.uid],
            date: new Date(),
            downvoters: [],
            image: data.image?(data.image):(null),
            name: getState().firebase.profile.firstName + " " + getState().firebase.profile.lastName,
            rating: 1,
            comment: data.comment,
            upvoters: [getState().firebase.auth.uid],
            username: getState().firebase.profile.username,
            userid: getState().firebase.auth.uid,
            answer: false
        }).then(()=>{
            //add to comment count
            const docRef = firestore.collection("lobbies/"+data.lobby+"/questions").doc(data.id)
            firestore.runTransaction(t=>{
                return t.get(docRef).then(doc=>{
                    const newComments = doc.data().comments + 1 || 1;
                    t.update(docRef, {comments: newComments})
                })
            })
        }).then(()=>{
            //push a notification

            //Only push notifaction if the authorid is different than the user
            if(data.authorid !== getState().firebase.auth.uid){
                pushNotification({getFirebase: getFirebase(), 
                    userID: data.authorid, 
                    title:"New Comment",
                    description: (getState().firebase.profile.username+ " commented on your post: "+data.questionTitle),
                    link: data.id, 
                    type: "question", 
                    lobby: data.lobby})
            }
        })
    }
}

export const upvoteQuestionComment = (data) =>{
    return(dispatch, getState, {getFirestore, getFirebase}) =>{
        const firestore = getFirestore();
        const firebase = getFirebase();
        const username = getState().firebase.auth.uid;
        const docRef = firestore.collection("lobbyQuestionResponses/"+data.lobby+"/"+data.questionid).doc(data.commentid)
        //get data
        firestore.collection("lobbyQuestionResponses/"+data.lobby+"/"+data.questionid).doc(data.commentid).get().then(data2=>{
            let upvoters = data2.data().upvoters;
            let downvoters = data2.data().downvoters;
            let author = data2.data().userid;
            let allUpvoters = data2.data().allUpvoters;
            //check if already upvoted
            if(!upvoters.includes(username)){
                //if the user has it downvoted, increase rating by 2 to accoutn for netural vote
                let amount = 1;
                if(downvoters.includes(username)){
                    amount = 2;
                }
                downvoters.pop(downvoters.indexOf(username));
                //give the author tokens if the user has not upvoted before
                if(!allUpvoters.includes(username)){
                    const authorRef = firebase.database().ref("users/"+author+"/tokens");
                    authorRef.transaction(run=>{
                        return run + 5;
                    }).then(()=>{
                        //sent notification
                        pushNotification({getFirebase: getFirebase(), 
                            userID: author, 
                            title:"Comment Upvoted",
                            description: ("You recieved +5 tokens! "+getState().firebase.profile.username+ " upvoted your comment on: "+data.questionTitle),
                            link: data.questionid, 
                            type: "question", 
                            lobby: data.lobby})
                    })
                }
                //handle upvotes
                firestore.runTransaction(t=>{
                    return t.get(docRef).then(doc=>{
                        const newRating = doc.data().rating + amount
                        t.update(docRef, {rating: newRating, upvoters: firestore.FieldValue.arrayUnion(username), downvoters:downvoters, allUpvoters: firestore.FieldValue.arrayUnion(username)})
                    })
                })
            }else{
                upvoters.pop(upvoters.indexOf(username));
                firestore.runTransaction(t=>{
                    return t.get(docRef).then(doc=>{
                        const newRating = doc.data().rating - 1;
                        t.update(docRef, {rating: newRating, upvoters: upvoters})
                    })
                }) 
            }   
        })
    }
}

export const downvoteQuestionComment = (data) =>{
    return(dispatch, getState, {getFirestore}) =>{
        const firestore = getFirestore();
        const username = getState().firebase.auth.uid;
        const docRef = firestore.collection("lobbyQuestionResponses/"+data.lobby+"/"+data.questionid).doc(data.commentid)
        //get data
        firestore.collection("lobbyQuestionResponses/"+data.lobby+"/"+data.questionid).doc(data.commentid).get().then(data=>{
            let upvoters = data.data().upvoters;
            let downvoters = data.data().downvoters;
            //check if already upvoted
            if(!downvoters.includes(username)){
                //if the user has it upvoted, decrease rating by 2 to accoutn for netural vote
                let amount = 1;
                if(upvoters.includes(username)){
                    amount = 2;
                }
                upvoters.pop(upvoters.indexOf(username));
                firestore.runTransaction(t=>{
                    return t.get(docRef).then(doc=>{
                        const newRating = doc.data().rating - amount
                        t.update(docRef, {rating: newRating, downvoters: firestore.FieldValue.arrayUnion(username), upvoters:upvoters})
                    })
                })
            }else{
                downvoters.pop(downvoters.indexOf(username));
                firestore.runTransaction(t=>{
                    return t.get(docRef).then(doc=>{
                        const newRating = doc.data().rating + 1;
                        t.update(docRef, {rating: newRating, downvoters: downvoters})
                    })
                }) 
            }   
        })
    }
}

export const deleteQuestionComment = (data) =>{
    return(dispatch, getState, {getFirestore}) =>{
        const firestore = getFirestore();
        //remove the link
        firestore.collection("lobbyQuestionResponses/"+data.lobby+"/"+data.questionid+"/").doc(data.commentid).delete()
            const docRef = firestore.collection("lobbies/"+data.lobby+"/questions").doc(data.questionid)
            firestore.runTransaction(t=>{
                return t.get(docRef).then(doc=>{
                    const newComments = doc.data().comments - 1 || 0;
                    t.update(docRef, {comments: newComments})
                })
            })
       
    }
}

export const updateQuestionComment = (data) =>{
    return(dispatch, getState, {getFirestore}) =>{
        const firestore = getFirestore();
        //remove the link
        firestore.collection("lobbyQuestionResponses/"+data.lobby+"/"+data.questionid+"/").doc(data.commentid).update({
            comment: data.comment,
            image: data.image?(data.image):(null),        
            lastEdit: new Date()
        })
    }
}

export const markAnswer = (data) =>{
    return(dispatch, getState, {getFirestore, getFirebase}) =>{
        const firestore = getFirestore();
        const firebase = getFirebase();
        //set the comment as the answer
        firestore.collection("lobbyQuestionResponses/"+data.lobby+"/"+data.questionid+"/").doc(data.commentid).update({
            answer: true
        }).then(()=>{
        //set the comment as answered
        firestore.collection("lobbies/"+data.lobby+"/questions").doc(data.questionid).update({
            answered: true,
        }).then(()=>{
        //give the author of the answer rewards
            //only give if different user
            if(getState().firebase.auth.uid!== data.answerAuthor){
                const authorRef = firebase.database().ref("users/"+data.answerAuthor+"/tokens");
                authorRef.transaction(run=>{
                    return run + 100;
                }).then(()=>{
                    //sent notification
                    pushNotification({getFirebase: getFirebase(), 
                        userID: data.answerAuthor, 
                        title:"Question Answered",
                        description: ("You recieved +100 tokens! Your comment has been marked as the correct answer from: "+data.questionTitle),
                        link: data.questionid, 
                        type: "question", 
                        lobby: data.lobby})
            })
            }
            
        })
    })
}
}

export const addQCommentComment = (data) =>{
    return(dispatch, getState, {getFirestore, getFirebase}) =>{
        const firestore = getFirestore();
        firestore.collection("questionCommentComments/"+data.id+"/comments").add({
            date: new Date(),
            name: getState().firebase.profile.firstName + " " + getState().firebase.profile.lastName,
            comment: data.comment
        }).then(()=>{
            //add to comment count
            const docRef = firestore.collection("lobbyQuestionResponses/"+data.lobby+"/"+data.questionid).doc(data.id)
            firestore.runTransaction(t=>{
                return t.get(docRef).then(doc=>{
                    const newRating = doc.data().comments + 1 || 1;
                    t.update(docRef, {comments: newRating})
                })
            }).then(()=>{
                //sent notification
                pushNotification({getFirebase: getFirebase(), 
                    userID: data.authorid, 
                    title:"New Comment on your Answer",
                    description: (getState().firebase.profile.username+" commented on your answer from: "+data.questionTitle),
                    link: data.questionid, 
                    type: "question", 
                    lobby: data.lobby})
        })
        })
        
    }
}

export const banUser = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["lobbyData/"+data.lobby+"/bannedUsers/"+data.userid+"/id"] = data.userid;
        obj["lobbyData/"+data.lobby+"/bannedUsers/"+data.userid+"/reasoning"] = data.reason;
        firebase.database().ref().update(obj).then(()=>{
            //sent notification
            pushNotification({getFirebase: getFirebase(), 
                userID: data.userid, 
                title:"Account Banned",
                description: ("Admin "+getState().firebase.profile.username+" has banned your account from "+data.lobby+". Reason: "+data.reason),
                type: "admin", 
                lobby: data.lobby})
    });
    }
}

export const unbanUser = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["lobbyData/"+data.lobby+"/bannedUsers/"+data.userid] = null;
        firebase.database().ref().update(obj).then(()=>{
            //sent notification
            pushNotification({getFirebase: getFirebase(), 
                userID: data.userid, 
                title:"Account Unbanned",
                description: ("Your account from "+data.lobby+" has been unbanned."),
                type: "admin", 
                lobby: data.lobby})
    });
    }
}

export const adminUser = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["lobbyData/"+data.lobby+"/admins/"+data.userid+"/id"] = data.userid;
        firebase.database().ref().update(obj).then(()=>{
            //sent notification
            pushNotification({
                getFirebase: getFirebase(), 
                userID: data.userid, 
                title:"Admin Promotion",
                description: ("Owner "+getState().firebase.profile.username+" has given you admin previleges"),
                type: "admin", 
                lobby: data.lobby})
    });
    }
}

export const unAdmin = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["lobbyData/"+data.lobby+"/admins/"+data.userid] = null;
        firebase.database().ref().update(obj).then(()=>{
            //sent notification
            pushNotification({
                getFirebase: getFirebase(), 
                userID: data.userid, 
                title:"Admin Privileges",
                description: ("Owner "+getState().firebase.profile.username+" has has removed your admin privileges"),
                type: "admin", 
                lobby: data.lobby})
    });;
    }
}

export const deleteLinkByAdmin = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        const firestore = getFirestore();
        //remove the link
        firestore.collection("lobbies/"+data.lobby+"/links").doc(data.linkid).delete().then(()=>{
            //give the user a nother link that they can add
            const linkCountRef = firebase.database().ref("lobbyusers/"+data.lobby+"/"+data.userid+"/links");
            linkCountRef.transaction(run=>{
                return run - 1;
            }).then(()=>{
                //give user a notification that their links has been deleted
                pushNotification({
                    getFirebase: getFirebase(), 
                    userID: data.userid, 
                    title:"Link Removed",
                    description: ("Admin "+getState().firebase.profile.username+" has has removed your Link. Reason: "+data.reason),
                    type: "admin", 
                    lobby: data.lobby})
            })
        })
        
    }
}

export const deleteQuestionByAdmin = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        const firestore = getFirestore();
        //remove the link
        firestore.collection("lobbies/"+data.lobby+"/questions").doc(data.linkid).delete().then(()=>{
            //give the user a nother link that they can add
            const linkCountRef = firebase.database().ref("lobbyusers/"+data.lobby+"/"+data.userid+"/questions");
            linkCountRef.transaction(run=>{
                return run - 1;
            }).then(()=>{
                //give user a notification that their question has been deleted
                pushNotification({
                    getFirebase: getFirebase(), 
                    userID: data.userid, 
                    title:"Question Removed",
                    description: ("Admin "+getState().firebase.profile.username+" has has removed your Question. Reason: "+data.reason),
                    type: "admin", 
                    lobby: data.lobby})
            })
        })
        
    }
}

export const createUnit = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        const newKey = firebase.database().ref("play").child(data.lobby).push().key;
        var obj = {}
        obj["play/"+data.lobby+"/"+newKey+"/color"] = data.color;
        obj["play/"+data.lobby+"/"+newKey+"/name"] = data.name;
        obj["play/"+data.lobby+"/"+newKey+"/questions"] = 0;
        obj["play/"+data.lobby+"/"+newKey+"/lastEdit"] = new Date();
        obj["play/"+data.lobby+"/"+newKey+"/plays"] = 0;
        obj["play/"+data.lobby+"/"+newKey+"/requests"] = 0;
        firebase.database().ref().update(obj).then(()=>{
            //increase the number of play notifications
            const lobbyRef = firebase.database().ref("/lobbyData/"+data.lobby+"/playNotifications")
            lobbyRef.transaction(run=>{
                return (run || 1) + 1;
            })
            //increase the number of play notifications of self so you dont see your own notification
            const lobbyUserRef = firebase.database().ref("/lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/playsSeen")
            lobbyUserRef.transaction(run=>{
                return (run || 1) + 1;
            })
        })
    }
}

export const deleteUnit = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["play/"+data.lobby+"/"+data.unitID] = null;
        firebase.database().ref().update(obj)
    }
}

export const editUnit = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["play/"+data.lobby+"/"+data.unitID+"/color"] = data.color;
        obj["play/"+data.lobby+"/"+data.unitID+"/name"] = data.name;
        firebase.database().ref().update(obj)
    }
}
export const addPlayToUnit = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        const playRef = firebase.database().ref("play/"+data.lobby+"/"+data.unitID+"/plays");
        playRef.transaction(run=>{
            return run + 1;
        })
    }
}
export const createQuestion = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        var obj = {}
        const newKey = firebase.database().ref("questions").child(data.lobby).push().key
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+newKey+"/type"] = data.type;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+newKey+"/question"] = data.question;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+newKey+"/questionPicture"] = data.questionImage;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+newKey+"/answer"] = data.answer;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+newKey+"/answerPicture"] = data.answerImage;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+newKey+"/option2"] = data.option2;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+newKey+"/option3"] = data.option3;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+newKey+"/option4"] = data.option4;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+newKey+"/lastEdit"] = new Date();
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+newKey+"/authorID"] = getState().firebase.auth.uid;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+newKey+"/authorUsername"] = getState().firebase.profile.username;
        obj["play/"+data.lobby+"/"+data.unitID+"/lastEdit"] = new Date();
        firebase.database().ref().update(obj)
        //increase question count by 1
        const questionRef = firebase.database().ref("play/"+data.lobby+"/"+data.unitID+"/questions");
        questionRef.transaction(data=>{
            return data + 1
        }).then(()=>{
            //increase the number of play notifications
            const lobbyRef = firebase.database().ref("/lobbyData/"+data.lobby+"/playNotifications")
            lobbyRef.transaction(run=>{
                return (run || 1) + 1;
            })
            //increase the number of play notifications of self so you dont see your own notification
            const lobbyUserRef = firebase.database().ref("/lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/playsSeen")
            lobbyUserRef.transaction(run=>{
                return (run || 1) + 1;
            })
        })
    }
}

export const createQuestionRequest = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        var obj = {}
        const newKey = firebase.database().ref("questions").child(data.lobby).push().key
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+newKey+"/type"] = data.type;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+newKey+"/question"] = data.question;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+newKey+"/questionPicture"] = data.questionImage;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+newKey+"/answer"] = data.answer;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+newKey+"/answerPicture"] = data.answerImage;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+newKey+"/option2"] = data.option2;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+newKey+"/option3"] = data.option3;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+newKey+"/option4"] = data.option4;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+newKey+"/lastEdit"] = new Date();
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+newKey+"/authorID"] = getState().firebase.auth.uid;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+newKey+"/authorUsername"] = getState().firebase.profile.username;
        firebase.database().ref().update(obj)
        //increase question count by 1
        const questionRef = firebase.database().ref("play/"+data.lobby+"/"+data.unitID+"/requests");
        questionRef.transaction(data=>{
            return data + 1
        })
    }
}
export const acceptQuestionRequest = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/type"] = data.type;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/question"] = data.question;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/questionPicture"] = data.questionImage;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/answer"] = data.answer;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/answerPicture"] = data.answerImage;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/option2"] = data.option2;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/option3"] = data.option3;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/option4"] = data.option4;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/lastEdit"] = new Date();
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/authorID"] = data.authorID;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/authorUsername"] = data.authorUsername;
        //remove request
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+data.questionID] = null;
        firebase.database().ref().update(obj)
        //decrease requests count by 1
        const questionRef = firebase.database().ref("play/"+data.lobby+"/"+data.unitID+"/requests");
        questionRef.transaction(data=>{
            return data - 1
        })
        //increase questions by 1
        const playRef = firebase.database().ref("play/"+data.lobby+"/"+data.unitID+"/questions");
        playRef.transaction(data=>{
            return data + 1
        }).then(()=>{
            //increase the number of play notifications
            const lobbyRef = firebase.database().ref("/lobbyData/"+data.lobby+"/playNotifications")
            lobbyRef.transaction(run=>{
                return (run || 1) + 1;
            })
            //increase the number of play notifications of self so you dont see your own notification
            const lobbyUserRef = firebase.database().ref("/lobbyusers/"+data.lobby+"/"+getState().firebase.auth.uid+"/playsSeen")
            lobbyUserRef.transaction(run=>{
                return (run || 1) + 1;
            }).then(()=>{
                //push notifictaion
                pushNotification({
                    getFirebase: getFirebase(), 
                    userID: data.authorID, 
                    title:"Question Approved",
                    description: ("Admin "+getState().firebase.profile.username+" has approved your question!"),
                    type: "play", 
                    lobby: data.lobby})
            })
        })
    }
}
export const declineQuestionRequest = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        var obj = {}
        //remove request
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+data.questionID] = null;
        firebase.database().ref().update(obj)
        //decrease requests count by 1
        const questionRef = firebase.database().ref("play/"+data.lobby+"/"+data.unitID+"/requests");
        questionRef.transaction(data=>{
            return data - 1
        }).then(()=>{
             //push notifictaion
             pushNotification({
                getFirebase: getFirebase(), 
                userID: data.authorID, 
                title:"Question Declined",
                description: ("Admin "+getState().firebase.profile.username+" has declined your question"),
                type: "play", 
                lobby: data.lobby})
        })
    }
}

export const updateQuestion = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/type"] = data.type;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/question"] = data.question;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/questionPicture"] = data.questionImage;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/answer"] = data.answer;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/answerPicture"] = data.answerImage;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/option2"] = data.option2;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/option3"] = data.option3;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/option4"] = data.option4;
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/lastEdit"] = new Date();
        obj["play/"+data.lobby+"/"+data.unitID+"/lastEdit"] = new Date();
        firebase.database().ref().update(obj)
    }
}

export const updateQuestionRequest = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/type"] = data.type;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/question"] = data.question;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/questionPicture"] = data.questionImage;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/answer"] = data.answer;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/answerPicture"] = data.answerImage;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/option2"] = data.option2;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/option3"] = data.option3;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/option4"] = data.option4;
        obj["questionRequests/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/lastEdit"] = new Date();
        firebase.database().ref().update(obj)
    }
}

export const deleteUnitQuestion = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID] = null;
        obj["play/"+data.lobby+"/"+data.unitID+"/lastEdit"] = new Date();
        firebase.database().ref().update(obj)
        //decrease question by 1
        const questionRef = firebase.database().ref("play/"+data.lobby+"/"+data.unitID+"/questions");
        questionRef.transaction(data=>{
            return data - 1
        }).then(()=>{
            //push notifictaion
            pushNotification({
                getFirebase: getFirebase(), 
                userID: data.authorID, 
                title:"Question Removed",
                description: ("Admin "+getState().firebase.profile.username+" has removed your question"),
                type: "play", 
                lobby: data.lobby})
        })
    }
}
export const starQuestion = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/stars/"+getState().firebase.auth.uid+"/id"] = getState().firebase.auth.uid;
        firebase.database().ref().update(obj)
    }
}

export const unStarQuestion = (data) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["questions/"+data.lobby+"/"+data.unitID+"/"+data.questionID+"/stars/"+getState().firebase.auth.uid] = null;
        firebase.database().ref().update(obj)
    }
}

export const giveTokens = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        const tokensRef = firebase.database().ref("users/"+data.userID+"/tokens")
        tokensRef.transaction(run=>{
            return run + data.amount
        }).then(()=>{
            //push notifictaion
            pushNotification({
                getFirebase: getFirebase(), 
                userID: data.userID, 
                title:"Get Money!",
                description: ("Somebody answered your question! You received +1 tokens."),
                type: "play", 
                lobby: data.lobby})
        })
    }
}

export const updateNotificationsSeen  = (data) =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firebase = getFirebase();
        var obj = {}
        obj["lobbyusers/"+data.lobby+"/"+data.userID+"/"+data.notificationType] = data.totalNotifications;
        firebase.database().ref().update(obj)
    }
}






