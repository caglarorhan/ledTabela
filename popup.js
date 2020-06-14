window.addEventListener('load',()=>{

    document.querySelector('#sendWordsButton').addEventListener('click',()=>{
        let words = document.querySelector('#words').value;
        //m2c({value:words, action:'runRequest', payload:{}, callBack:{callBackName:null, echo:true},});
        m2c({value:'writer', action:'runRequest', payload:{word:words, animate:{switch:1}}, callBack:{callBackName:null, echo:false}});

    });

});


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
            window[request.value]();
            break;
        default:
            M.toast({html:`<b>${request.value}</b>`});
            break;
    }
    return true;
});
