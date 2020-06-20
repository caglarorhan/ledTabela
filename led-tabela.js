let i=0;
let xMax=0;
let yMax=0;
let interLetterSpace=1;
let newLetterRecord = [];
let leftMargin = 0;
let leftPadding=0;
let animationDirection = 'Right';
let animationSpeed = 500;
let rectNodeList=null;
let animationStatus=true;
let baseColor='#ebedf0';
let profileName=null;
let totalWordLength=0;
let wLS = window.localStorage;
wLS.setItem('alphabet',JSON.stringify({}));
//-----------------------------------------------------------------------------
window.addEventListener('load',  ()=>{
    console.log('test yuklendik...');
    let curURL = window.location.href;
    profileName = curURL.split('github.com')[1].split('/')[1];

    // TODO: alphabet.js verisi wLS ye aktarilacak
    // TODO: draw dugmesi yapistirilmis datayi tabloya aktaracak
    // TODO: wLS deki alphabet keyleri fihrist gibi gosterilip tiklandiginda data bolmesine verisini aktaracak
    // TODO: colorChartlar wLS ye aktarilacak, kendi cahartlarini olusturmalari saglanacak
    // TODO: schedule edilen (reminder) noktalarin tarihlerinde uyari mesaji/email/sms gibi secenekelr olacak
    // TODO: Animasyonlu colorchart ve colorpicker verisi olan payload da wLS ye saklanabilecek
    // TODO: wLS export edilebilecek ve import edilebilecek
    // TODO: nokta render fonksiyonunda color noktada varsa degilde animasyondaki color pick type oncelikli secilecek!

    // data boxes added
    let liClassList = "col-12 col-md-6 col-lg-6 mb-3 d-flex flex-content-stretch".split(" ");
    let divClassList = "Box pinned-item-list-item d-flex p-3 width-full public fork text-gray".split(" ");
    let boxContainerOl = document.querySelector('.d-flex.flex-wrap.list-style-none.gutter-condensed.mb-4');
    let boxLi = document.createElement('li'); boxContainerOl.append(boxLi); boxLi.classList.add(...liClassList);
    let boxDiv = document.createElement('div');  boxDiv.classList.add(...divClassList); boxDiv.id = 'dataCumulative';
    boxLi.append(boxDiv);
    boxDiv.innerHTML=`<div id="dataDiv" style="width:100%">
                        <button class="btn mt-1 mb-1" type="button" id="save2LSAlphabetButton">Save2 LS Alphabet</button>
                        <button class="btn mt-1 mb-1" type="button">Draw</button>
                        <br>Written Data:
                            <textarea id="dataP" class="text-gray text-small mb-2" style="height:200px; width:100%"></textarea></div>`;

    let boxLi2 = document.createElement('li'); boxContainerOl.append(boxLi2); boxLi2.classList.add(...liClassList);
    let boxDiv2 = document.createElement('div'); boxLi2.append(boxDiv2); boxDiv2.classList.add(...divClassList); boxDiv2.id = 'remindersList';
    boxDiv2.innerHTML = '<div>Saved Push/Commit Reminders Schedule</div>';


    document.querySelector('div.contrib-footer.clearfix.mt-1.mx-3.px-3.pb-1').innerHTML+='<select  id="processSelection"><option value="">Select a process</option></select><span style="color:red; font-weight: bold">&#8592; Pattern Creation Options</span><span style="margin-left: 10px;"><input type="color" value="#ff0000" id="selectedColor"> </span>';
    let processSelection = document.querySelector('#processSelection');
    processSelection.addEventListener('change',(e)=>{processSelect(e.target.value)});
    let clearTheDataButton = document.createElement('option'); clearTheDataButton.textContent='Clear The Data'; clearTheDataButton.value='clearTheDataButton';processSelection.append(clearTheDataButton);
    let clearTheTableButton = document.createElement('option'); clearTheTableButton.textContent='Clear The Table'; clearTheTableButton.value='clearTheTableButton';processSelection.append(clearTheTableButton);
    let writeData2TableButton = document.createElement('option'); writeData2TableButton.textContent='Write Data To Table'; writeData2TableButton.value='writeData2TableButton';processSelection.append(writeData2TableButton);

    function processSelect(processName){
        switch(processName){
            case 'clearTheDataButton' :
                newLetterRecord=[];
                document.querySelector('#dataP').value= `${JSON.stringify(newLetterRecord)}`;
                break;
            case 'clearTheTableButton' :
                resetter();
                leftPadding=0;
                break;
            case 'writeData2TableButton' :
                setter(newLetterRecord,{});
                break;
            default:

        }
    }

    //
    rectNodeList = document.querySelectorAll('svg.js-calendar-graph-svg g > g > rect');
    rectNodeList.forEach((rectNode)=>{

        let x=Math.floor(i/7);
        let y = i%7;
        rectNode.setAttribute("id", `ID_${x}-${y}`);
        rectNode.addEventListener('click',(e)=>{
            // 3. parametre color pickerdan alinacak
            let selectedColor = document.querySelector('#selectedColor').value;
            newLetterRecord.push([x,y,selectedColor]);
            document.querySelector('#dataP').value= `${JSON.stringify(newLetterRecord)}`;
            e.target.style.setProperty("fill",selectedColor, "important");
        });
        xMax = x;
        yMax = y;
        i++;
    });

    //TODO: Selecting original github contribution colors
// default colors (contribution colors) to color selector
//     let liler = document.querySelectorAll('.legend li');
//     liler.forEach((i)=>{
//         i.addEventListener('click',(e)=>{
//             document.querySelector('#selectedColor').value=e.target.style.backgroundColor;
//         })
//     })

//save2LSAlphabetButton
    document.querySelector('#save2LSAlphabetButton').addEventListener('click',()=>{
        let alphabetElementName = prompt('Please write a name for your data to insert into your local storage alphabet.');
        let dataP = document.querySelector('#dataP').value;
        let lsAlphabet = JSON.parse(wLS.getItem('alphabet'));
        lsAlphabet[alphabetElementName] = dataP;
        wLS.setItem('alphabet',JSON.stringify(lsAlphabet));
    })

//--<
});
//-------------------------------------------------------------------------------------------------------------------

function getColorChartData(){
    //console.log('getColorchartData cagirildi');
    let colorOptions ={};
    colorOptions.colorChartNameList = Object.keys(colorCharts);
    colorOptions.colorPickingTypeList = colorPickingTypes;
    //console.log(`colorOptions: ${JSON.stringify(colorOptions)}`);
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

function animationModifier(payload){
    //console.log(payload);
    if(payload.animationDirection){animationDirection= payload.animationDirection}
    if(payload.animationSpeed){animationSpeed=payload.animationSpeed}
    if(payload.baseColor){baseColor=payload.baseColor}
}

function resetProcess(){
    animationStatus=false;
    resetter();
    leftPadding=0;
    leftMargin=0;
    totalWordLength=0;
}

function resetter(){
    rectNodeList.forEach((rectNode)=>{
        rectNode.style.setProperty("fill", baseColor, "important");
    })
}

function setter(letter, payload){
    let lData = typeof letter==='string'? alphabet[letter]: letter;
    //console.log(`leftMargin:${leftMargin}`);
    lData.sort();
    let letterWidth = lData[lData.length-1][0]-lData[0][0]+1;
    lData.forEach((datum)=>{
        let dotColor=baseColor;
        let xPos = datum[0]+leftPadding+leftMargin;
        let yPos = datum[1];

        //-------------------------------------
        if(animationStatus){//animasyon acik
            if(payload.animate.switch){// animasyon switch true gelmis
                if(payload.animate.animationDirection!=='Right'){// animasyon yonu saga dogruysa
                    //console.log(leftMargin);
                    xPos = (xMax+(xPos%xMax))%xMax;
                    //console.log(xPos);
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
        if(datum.length>2){
            dotColor = datum[2];
        }else{
            dotColor = colorSelection({color:payload.color, order: datum[1]});
        }
            document.querySelector(`#ID_${xPos}-${yPos}`).style.setProperty("fill", dotColor, "important");

    });
    leftPadding+=letterWidth+1;
}


function writer(payload){
    animationStatus=true;
    baseColor = payload.color.bgColor;
    resetter();
    leftPadding=0;
    leftMargin=0;
    totalWordLength=0;
    let letters = payload.word.split('');
    animationDirection = payload.animate.animationDirection;


    let lettersLength = letters.length;
    letters.forEach((letter)=>{
        if(alphabet[letter]){
            let orderedLetterData = alphabet[letter].sort();
            let letterLength = orderedLetterData[orderedLetterData.length-1][0]-orderedLetterData[0][0]+1;
           // console.log(`${letter}:${letterLength}`);
            totalWordLength+= letterLength;
        }
    }) ;
    totalWordLength+= ((lettersLength-1)*interLetterSpace); // added spaces

    //console.log(`totalwordlength:${totalWordLength}`);
    //console.log(`xMax:${xMax}`);
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

        let animateIt = ()=>{
            let animationTimer = window.setTimeout(()=>{
                resetter();
                //console.log(animationStatus);
                if(animationStatus!==true){clearTimeout(animationTimer); return false;}
                letters.forEach((letter)=>{
                    setter(letter, payload);
                });
                animationDirection==='Right'?leftMargin++:leftMargin--;
                leftPadding=0;
                clearTimeout(animationTimer);
                animateIt();
            },animationSpeed);
            //console.log('Fonksiyon bitti')
        };
        animateIt();


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
