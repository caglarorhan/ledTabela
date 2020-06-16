let i=0;
let defaultColors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
let fancyColors = ['#FF5733','#33FF5B', '#DD33FF', '#7733FF', '#FF33B5','#FF8033']
let xMax=0;
let yMax=0;
let interLetterSpace=1;
let newLetterRecord = [];
let leftPadding = 0;
let animIterator=0;
let rectNodeList=null;
let animationStatus=true;
let baseColor='#ebedf0';
let profileName=null;
let totalWordLength=0;
//-----------------------------------------------------------------------------
window.addEventListener('load',  ()=>{
    console.log('test yuklendik...');
    let curURL = window.location.href;
    profileName = curURL.split('github.com')[1].split('/')[1];
    document.querySelector('div.contrib-footer.clearfix.mt-1.mx-3.px-3.pb-1').innerHTML+='<button id="letterRecordDataButton">Show Data</button>';
    document.querySelector('div.contrib-footer.clearfix.mt-1.mx-3.px-3.pb-1').innerHTML+='<button id="clearTheDataButton">Clear Data</button>';
    document.querySelector('div.contrib-footer.clearfix.mt-1.mx-3.px-3.pb-1').innerHTML+='<button id="clearTheTableButton">Clear The Table</button>';
    document.querySelector('div.contrib-footer.clearfix.mt-1.mx-3.px-3.pb-1').innerHTML+='<button id="writeData2TableButton">Write Data2Table</button>';
    document.querySelector('#letterRecordDataButton').addEventListener('click',()=>{
        document.querySelector('div.js-yearly-contributions h2.f4').textContent= `DATA: ${JSON.stringify(newLetterRecord)}`;
    });
    document.querySelector('#clearTheTableButton').addEventListener('click', ()=>{
       resetter();
        leftPadding=0;
    });
    document.querySelector('#clearTheDataButton').addEventListener('click',()=>{
        newLetterRecord=[];
    });
    document.querySelector('#writeData2TableButton').addEventListener('click',()=>{
       setter(newLetterRecord,0,0);
    });

    //
    rectNodeList = document.querySelectorAll('svg.js-calendar-graph-svg g > g > rect');
    rectNodeList.forEach((rectNode)=>{
        let x=Math.floor(i/7);
        let y = i%7;
        rectNode.setAttribute("id", `ID_${x}-${y}`);
        rectNode.addEventListener('click',()=>{newLetterRecord.push([x,y]);});
        xMax = x;
        yMax = y;
        i++;
    });
//--<
});
//-------------------------------------------------------------------------------------------------------------------
function colorSelection(sourceType){
    let colorSelect= defaultColors[2];
    switch (sourceType){
        case 'randomFancy':
            let fcl= fancyColors.length-1;
            let rndOrder = Math.floor(Math.random()*fcl);
            colorSelect = fancyColors[rndOrder];
            break;
        default:
            colorSelect =  defaultColors[2];
            break;
    }
    return colorSelect;

}

function toggleAnimation(){
    console.log(`animasyon durumu: ${animationStatus} idi`);
    animationStatus=!animationStatus;
    console.log(`Simdi: ${animationStatus} oldu`)
}

function resetter(){
    rectNodeList.forEach((rectNode)=>{
        rectNode.style.setProperty("fill",baseColor, "important")
    })
}

function setter(data){
    let letterWidth = data[data.length-1][0]-data[0][0]+1;
    data.forEach((datum)=>{
        document.querySelector(`#ID_${(datum[0]+leftPadding)%xMax}-${datum[1]}`).style.setProperty("fill",colorSelection('randomFancy'), "important");
    });
    leftPadding+=letterWidth+interLetterSpace;

}

function writer(payload){
    let letters = payload.word.split('');
    if(letters.length<1){
        letters = profileName.toUpperCase().split('');
    }
    let extra = 0;
    resetter();
    // calculate word total length with interletterspaces
    let lettersLength = letters.length;
    letters.forEach((letter)=>{
        let orderedLetterData = alphabet[letter].sort();
        let letterLength = orderedLetterData[orderedLetterData.length-1][0]-orderedLetterData[0][0]+1;
        console.log(`${letter}:${letterLength}`);
        totalWordLength+= letterLength;
    }) ;
    totalWordLength+= ((lettersLength-1)*interLetterSpace); // added spaces

    console.log(`totalwordlength:${totalWordLength}`);
    console.log(`xMax:${xMax}`);
    if(totalWordLength>xMax-1){
        m2p({value:`Word ${payload.word} length is too long, shorten your word and try again!`});
        console.log(`Word ${payload.word} length is too long, shorten your word and try again!`);
        totalWordLength=0;
        return false;
    }

    //- animated or not
    console.log(payload.animate.switch);
    console.log(animationStatus);
    if(payload.animate.switch===true && animationStatus){
        let animationTimer = window.setInterval(()=>{
            resetter();
            letters.forEach((letter)=>{
                let lData = alphabet[letter];
                lData.sort();
                setter(lData);
            });
            animIterator++;
            leftPadding=animIterator;
        },200)
    }else{
        letters.forEach((letter)=>{
            let lData = alphabet[letter];
            lData.sort();
            let letterWidth = lData[lData.length-1][0]-lData[0][0]+1;
            setter(lData);
        })
    }
}


//Sending message to popup side
function m2p(outgoingMessage){
    chrome.runtime.sendMessage(outgoingMessage);
}
//AND Listener
// expected full message structure is:
// {value:'', action:'runRequest', payload:{}, callBack:null ,echo:true} // if echo is true so give the just ran functions name as callback
//gelen
//{value:words, action:'runRequest', payload:{}, callBack:{callBackName:null, echo:false}}
chrome.runtime.onMessage.addListener(  (request)=>{
    switch (request.action) {
        case 'runRequest':
            let results={};
            if(typeof request.payload ==='object' && request.payload.constructor===Object && Object.keys(request.payload).length>0){
                results = window[request.value](request.payload);
            }else{
                results = window[request.value]();
            }
            if(request.callBack && request.callBack.callBackName){
                m2p({value:request.callBack.callBackName, action:'runRequest',payload: results,})
            }

            break;
        default:
            console.log(request.value);
            break;
    }
    return true;
});
