window.addEventListener('load',()=>{
    // colorChart and picking type selections
    m2c({value:'getColorChartData', action:'runRequest', callBack: {callBackName: 'setColorSelectionOptions', echo:true}});

    // run process
    document.querySelector('#sendWordsButton').addEventListener('click',(e)=>{
        let words = document.querySelector('#words').value;
        let animationSwitch = document.querySelector('#animationSwitch').checked;
        //m2c({value:words, action:'runRequest', payload:{}, callBack:{callBackName:null, echo:true}});
        let bgColor = document.querySelector('#bgColor').value;
        let selectedChartName = document.querySelector('#colorChartSelection').value;
        if(selectedChartName===''){alert('Pick a color chart!'); return false;}
        let selectedColorPickingType = document.querySelector('#colorPickingTypeSelection').value;
        if(selectedColorPickingType===''){alert('Pick a color picking type!'); return false;}
        let animationDirection='Left';
        if(document.querySelector('#animationDirection2Right').checked){animationDirection='Right'}
        m2c({value:'writer', action:'runRequest', payload:{word:words, animate:{switch:animationSwitch, animationDirection: animationDirection}, color:{chartName:selectedChartName, colorPickingType: selectedColorPickingType, set:[], bgColor:bgColor}}, callBack:{callBackName:null, echo:false}});
    });

    //reset proces
    document.querySelector('#resetButton').addEventListener('click',()=>{
        m2c({value:'resetProcess',action:'runRequest'});
    });

    //animationDirectionModifier
    document.querySelector('#animationDirection2Left').addEventListener('click',()=>{
        m2c({value:'animationModifier', action:'runRequest', payload: {animationDirection:'Left'}})
    });
    document.querySelector('#animationDirection2Right').addEventListener('click',()=>{
        m2c({value:'animationModifier', action:'runRequest', payload: {animationDirection:'Right'}})
    });

// animation speed range input
    document.querySelector('#animationSpeed').addEventListener('change',(e)=>{
        m2c({value:'animationModifier', action:'runRequest', payload: {animationSpeed:e.target.value}})
    });
// animation speed range input
    document.querySelector('#animationSpeedData').addEventListener('input',(e)=>{
        m2c({value:'animationModifier', action:'runRequest', payload: {animationSpeed:e.target.value}})
    });

    // board bgColor
    document.querySelector('#bgColor').addEventListener('change',(e)=>{
       m2c({value:'animationModifier', action:'runRequest', payload:{baseColor:e.target.value}})
    })


    //--<
});

function setColorSelectionOptions(data){
    //alert('Veri geldi mi:'+data);
    let colorChartNameList = data.colorChartNameList;
    let colorPickingTypeList = data.colorPickingTypeList;
    colorChartNameList.forEach((chartName)=>{
        let option = document.createElement('option');
        option.value = chartName;
        option.textContent = chartName;
        document.querySelector('#colorChartSelection').append(option);
    });
    colorPickingTypeList.forEach((pickingType)=>{
        let option = document.createElement('option');
        option.value = pickingType;
        option.textContent =pickingType;
        document.querySelector('#colorPickingTypeSelection').append(option);
    });
}


// in minimal usage just value is enough, but if you are request to run some functions (action is runRequest) so value is the function name you want to run and parameters are in payload object.
// Also if you want some feedback from this function or any result sen a callBack name to be return as new messages value with action:runRequest. I there are parameters need to be send back put them into payload object again.

//Sending message to content side
function m2c(messageToContentSide){
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, messageToContentSide);
    });
}
//Receiving message from the content side
chrome.runtime.onMessage.addListener((request)=>{
    switch(request.action){
        case "runRequest":
            if(request.payload){
                window[request.value](request.payload);
            }else{
                window[request.value]();
            }
            break;
        default:
            alert(request.value);
            break;
    }
    return true;
});
