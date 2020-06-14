let i=0;
let defaultColors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
let xMax=0;
let yMax=0;
let interLetterSpace=1;
let newLetterRecord = [];
let leftPadding = 0;
let animIterator=0;
let rectNodeList=null;
//-----------------------------------------------------------------------------
window.addEventListener('load',  ()=>{
    console.log('test yuklendik...');
    document.querySelector('div.contrib-footer.clearfix.mt-1.mx-3.px-3.pb-1').innerHTML+='<button id="letterRecordDataButton">Show Data</button>';
    document.querySelector('#letterRecordDataButton').addEventListener('click',()=>{
        document.querySelector('div.js-yearly-contributions h2.f4').textContent= `DATA: ${JSON.stringify(newLetterRecord)}`;
    });

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

function resetter(){
    rectNodeList.forEach((rectNode)=>{
        rectNode.style.setProperty("fill","#ebedf0", "important")
    })
}

function setter(data, letterWidth, totalWordLength){
    data.forEach((datum)=>{
        console.log(`Total length: ${datum[0]+leftPadding} xMax: ${xMax}`);
        if(datum[0]+leftPadding>=xMax) return;
        console.log(`leftPadding: ${leftPadding}`);
        document.querySelector(`#ID_${datum[0]+leftPadding}-${datum[1]}`).style.setProperty("fill",defaultColors[4], "important");
    });
    leftPadding+=letterWidth+interLetterSpace;
}

function writer(payload){
    let letters = payload.word.split('');
    let extra = 0;
    resetter();
    // calculate word total length with interletterspaces
    let totalWordLength = letters.reduce((acc,cur)=>{
        let orderedLetterData = alphabet[cur].sort();
        let letterLength = orderedLetterData[orderedLetterData.length-1][0]-orderedLetterData[0][0]+1;
        return acc+letterLength;
    }) + ((letters.length-1)*interLetterSpace); // added spaces

    //- animated or not
    if(payload.animate.switch===1){
        let animationTimer = window.setInterval(()=>{
            resetter();
            letters.forEach((letter)=>{
                let lData = alphabet[letter];
                lData.sort();
                let letterWidth = lData[lData.length-1][0]-lData[0][0]+1;
                setter(lData,letterWidth, totalWordLength);
                console.log(`extra degeri: ${extra}`);
                if(xMax===extra) clearInterval(animationTimer);

            });
            animIterator++;
            leftPadding=animIterator;
        },200)
    }else{
        letters.forEach((letter)=>{
            let lData = alphabet[letter];
            lData.sort();
            let letterWidth = lData[lData.length-1][0]-lData[0][0]+1;
            setter(lData,letterWidth,0);
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
