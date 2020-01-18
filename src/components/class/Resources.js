//compare a date return time that has passed
//where date is in seconds
export const hoursAgo = (date) =>{
   const secondsDifference = new Date().getTime()/1000 - date;

   if(secondsDifference < 60){
    return "now"
    }
   else if(secondsDifference > 60 && secondsDifference < 3600){
        const minutes = Math.floor(secondsDifference/60)
        return minutes > 1?(minutes + " minutes ago"):(minutes + " minute ago")
   }else if (secondsDifference > 3600 && secondsDifference < 86400){
       const hours = Math.floor(secondsDifference / 3600)
       return hours > 1?(hours + " hours ago"):(hours + " hour ago")
   }else if (secondsDifference > 86400 && secondsDifference < 2592000){
       const days = Math.floor(secondsDifference / 86400)
       return days > 1?(days + " days ago"):(days + " day ago")
   }
   else{
       return ("30+ days ago")
   }
}