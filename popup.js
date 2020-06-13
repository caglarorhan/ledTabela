window.addEventListener('load',()=>{

    document.querySelector('#sendWordsButton').addEventListener('click',()=>{
        let words = document.querySelector('#words').value;
        alert(words);
    })

});


//
// class BridgeCxP {
//     constructor() {
//         if(browser.tabs){
//             browser.tabs.query({active: true, currentWindow: true}, function (tabs) {
//                 browser.tabs.sendMessage(tabs[0].id, messageToContentSide, function (response) {
//                 });
//             });
//         }else{
//             this.send = browser.runtime.sendMessage({v:'', action:null, callbackName:null, actionPayLoad:{}}={},()=>{});
//         }
//
//         this.recieve=browser.runtime.onMessage.addListener((r,s,sR)=>{
//             switch (r.action) {
//                 case 'run':
//                     let res = window[r.v]();
//                     if(r.callbackName){
//                         this.send({v:res, action:'run'})
//
//                     }
//                     break;
//                 case 'test':
//                     break;
//                 default:
//                     this.msgs.push({v:r.v, read:false});
//                     break;
//             }
//         });
//         this.msgs = []; // [{v:'message', read:false}]
//     }
//     get msg(){
//         return this.msgs[this.msgs.length-1].v;
//     }
//
//     get test(){
//         return this.payload;
//     }
// }
//
// let b= new BridgeCxP();
// b.test();
