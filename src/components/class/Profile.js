export const level_background = (xp) =>{
//Blues
if(xp < 1000){
    return "#29b6f6"
}else if (xp>=1000 && xp<3250){
    return "#2196f3"
}else if (xp>=3250 && xp<10750){
    return "#1565c0"
}else if (xp>=10750 && xp<35750){
    return "#0d47a1"
}
//Purples
else if (xp>=100000-64250 && xp<125000-64250){
    return "#7e57c2"
}else if (xp>=125000-64250 && xp<150000-64250){
    return "#5e35b1"
}else if (xp>=150000-64250 && xp<175000-64250){
    return "#9c27b0"
}else if (xp>=175000-64250 && xp<200000-64250){
    return "#6a1b9a"
}
//Pinks
else if (xp>=200000-64250 && xp<225000-64250){
    return "#f06292"
}else if (xp>=225000-64250 && xp<250000-64250){
    return "#ff4081"
}else if (xp>=250000-64250 && xp<275000-64250){
    return "#e91e63"
}else if (xp>=275000-64250 && xp<300000-64250){
    return "#c2185b"
}
//Reds
else if (xp>=300000-64250 && xp<325000-64250){
    return "#ef5350"
}else if (xp>=325000-64250 && xp<350000-64250){
    return "#e53935"
}else if (xp>=350000-64250 && xp<375000-64250){
    return "#c62828"
}else if (xp>=375000-64250 && xp<400000-64250){
    return "#d50000"
}
//Orange
else if (xp>=400000-64250 && xp<425000-64250){
    return "#ffb74d"
}else if (xp>=425000-64250 && xp<450000-64250){
    return "#ff9800"
}else if (xp>=450000-64250 && xp<475000-64250){
    return "#ff6f00"
}else if (xp>=475000-64250 && xp<500000-64250){
    return "#ef6c00"
}

} 

export const early_levels = (xp) =>{
    //to level 10
    if (xp < 1000){
        return 100;
    }
    //to level 20
    else if (xp >= 1000 && xp < 3250){
        return 150;
    }
    //to level 50
    else if (xp >= 3250 && xp < 10750){
        return 250;
    }
    //to level 100
    else if (xp >= 10750 && xp < 35750){
        return 500;
    }
    else{
        return 1000
    }
}

export const xp_subtract = (xp) =>{
    if (xp >= 1000 && xp < 3250){
        return 1000;
    }
    else if (xp >= 3250 && xp < 10750){
        return 3250;
    }
    else if (xp >= 10750  && xp < 35750){
        return 10750;
    }
    else if (xp >= 35750){
        return 35750;
    }
    else{
        return 0
    }
}
export const exact_level = (xp) =>{
    //to level 10
    if (xp < 1000){
        return Math.floor(xp/100);
    }
    else if (xp >= 1000 && xp < 3250){
        return 10 + (Math.floor((xp-1000)/150))
    }
    else if (xp >= 3250 && xp < 10750){
        return 20 + (Math.floor((xp-3250)/250))
    }
    else if (xp >= 10750 && xp < 35750){
        return 50 + (Math.floor((xp-10750)/500))
    }
    else{
        return 100 + (Math.floor((xp-35750)/1000))
    }

}

