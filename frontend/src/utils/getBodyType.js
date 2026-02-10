export const getBodyType = (vata, pitta, kapha) =>{
    let bodyType = "Vata";
    let highestScore = vata;

    if (pitta > highestScore || highestScore === pitta){
        highestScore = pitta
        bodyType = "Pitta"
    }

    if (kapha > highestScore || highestScore === kapha){
        highestScore = kapha
        bodyType = "Kapha"
    }
    return bodyType;
};