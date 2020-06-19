// version 2019.2.1
window.addEventListener('load',function(){totalLoad();});

function totalLoad(){
    // change .itrs class selector below with your own target input class
    const controlsRange = document.querySelectorAll('input[type="range"][class="itrs"]');

    controlsRange.forEach(input => {
        event_attacher(input);
        //two way binding
        if(input.dataset.twoWayBind){
            let syncTarget = document.querySelector('#'+input.dataset.syncTo);
            syncTarget.setAttribute('data-sync-to', input.id);
            event_attacher(syncTarget);

        }



    });
    function event_attacher(syncTarget){
        syncTarget.addEventListener('mousedown',sync,true);
        syncTarget.addEventListener('click',detector,true);
        syncTarget.addEventListener('mouseup',unsync,true);
        syncTarget.setAttribute('data-current-value',0);
    }

    function sync(event){
        let targetInput = event.target;
        //console.log(`Syncing... Last value is ${targetInput.value}`);
        targetInput.addEventListener('mousemove',detector,true) ;
    }


    function detector(event){
        let targetTagTypes = ["input"]
        let targetInput = event.target;
        //console.log('sysnc done:'+ targetInput.value);
        targetInput.dataset.currentValue = targetInput.value;

            if(document.querySelector('#'+targetInput.dataset.syncTo)){ // this is a HTML element
                let tag_name = document.querySelector('#'+targetInput.dataset.syncTo).tagName;

                if(targetTagTypes.includes(tag_name)>-1){
                    document.querySelector('#'+targetInput.dataset.syncTo).value = targetInput.value;
                }else{
                    document.querySelector('#'+targetInput.dataset.syncTo).innerText = targetInput.value;
                }
            }else{ // this may be a function
                window[targetInput.dataset.syncTo](targetInput.value);
            }
        }



    function unsync(event){
        let targetInput = event.target;
        //console.log(`Unsyncing... Last value is ${targetInput.value}`);
        targetInput.removeEventListener('mousemove',detector,true);

    }



}



//for example -sample function-- you should use your own functions
function whatsTheValue(currentVal){
    document.querySelector('#input_3_sync').value=currentVal
}





