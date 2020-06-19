let i=0;
let xMax=0;
let yMax=0;
let interLetterSpace=1;
let newLetterRecord = [];
let leftMargin = 0;
let leftPadding=0;
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
       setter(newLetterRecord,{word:'', animate:{switch:false, animationDirection: null}, color:{chartName:'defaultColors', colorPickingType: 'Lineer', set:[]}});
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

function getColorChartData(){
    console.log('getColorchartData cagirildi');
    let colorOptions ={};
    colorOptions.colorChartNameList = Object.keys(colorCharts);
    colorOptions.colorPickingTypeList = colorPickingTypes;
    console.log(`colorOptions: ${JSON.stringify(colorOptions)}`);
    return colorOptions;
}




function colorSelection(options){
        let selectedColor = baseColor;
        let colorChart= colorCharts[options.color.chartName];
        let colorPickingType = options.color.colorPickingType;
        switch(colorPickingType){
            case 'Random':
                let fcl= colorChart.length-1;
                let rndOrder = Math.floor(Math.random()*fcl);
                selectedColor = colorChart[rndOrder];
                break;
            case 'Lineer':
                selectedColor = colorChart[options.order];
                break;
            default:
                break;
        }
    return selectedColor;
}

function resetter(){
    rectNodeList.forEach((rectNode)=>{
        rectNode.style.setProperty("fill", baseColor, "important");
    })
}

function setter(letter, payload){
    let lData = typeof letter==='string'? alphabet[letter]: letter;
    console.log(`leftMargin:${leftMargin}`);
    lData.sort();
    let letterWidth = lData[lData.length-1][0]-lData[0][0]+1;
    lData.forEach((datum)=>{
        let xPos = datum[0]+leftPadding+leftMargin;
        let yPos = datum[1];
        //-------------------------------------
        if(animationStatus){//animasyon acik
            if(payload.animate.switch){// animasyon switch true gelmis
                if(payload.animate.animationDirection!=='Right'){// animasyon yonu saga dogruysa
                    //console.log(leftMargin);
                    xPos = (xMax+(xPos%xMax))%xMax;
                    console.log(xPos);
                }else{
                    xPos = xPos%xMax;
                }
            }else{
                xPos = xPos%xMax;
            }
        }else{
            xPos = xPos%xMax;

        }
        //------------------------------------

            document.querySelector(`#ID_${xPos}-${yPos}`).style.setProperty("fill",colorSelection({color:payload.color, order: datum[1]}), "important");

    });
    leftPadding+=letterWidth+1;
}


function writer(payload){
    baseColor = payload.color.bgColor;
    resetter();
    leftPadding=0;
    leftMargin=0;
    totalWordLength=0;
    let letters = payload.word.split('');
    let animationDirection = payload.animate.animationDirection;


    let lettersLength = letters.length;
    letters.forEach((letter)=>{
        if(alphabet[letter]){
            let orderedLetterData = alphabet[letter].sort();
            let letterLength = orderedLetterData[orderedLetterData.length-1][0]-orderedLetterData[0][0]+1;
            console.log(`${letter}:${letterLength}`);
            totalWordLength+= letterLength;
        }
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
    //console.log(payload.animate.switch);
    //console.log(animationStatus);
    if(payload.animate.switch===true && animationStatus){
        let animationTimer = window.setInterval(()=>{
            resetter();
            letters.forEach((letter)=>{
                setter(letter, payload);
            });
            animationDirection==='Right'?leftMargin++:leftMargin--;
            leftPadding=0;
        },500);

    }else{
        letters.forEach((letter)=>{
            setter(letter,payload);
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
chrome.runtime.onMessage.addListener(  async (request)=>{
    switch (request.action) {
        case 'runRequest':
            let results={};
            if(typeof request.payload ==='object' && request.payload.constructor===Object && Object.keys(request.payload).length>0){
                results = await window[request.value](request.payload);
            }else{
                results = await window[request.value]();
            }
            if(request.callBack && request.callBack.callBackName){
                console.log(`result gonderilecek: ${results}`)
                m2p({value:request.callBack.callBackName, action:'runRequest',payload: results,})
            }

            break;
        default:
            console.log(request.value);
            break;
    }
    return true;
});
