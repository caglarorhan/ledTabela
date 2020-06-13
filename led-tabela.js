let i=0;
let defaultColors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
let alphabet = {
    A:[[0,6],[0,5],[0,4],[0,3],[0,2],[1,1],[2,0],[3,1],[4,2],[4,3],[4,4],[4,5],[4,6],[3,3],[2,3],[1,3]],
    B:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,6],[2,6],[3,5],[3,4],[2,3],[1,3],[3,2],[3,1],[2,0],[1,0]],
    C:[[0,2],[0,3],[0,4],[1,1],[1,5],[2,0],[2,6],[3,0],[3,6],[4,0],[4,6]],
    D:[[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[0,0],[1,0],[2,0],[3,1],[4,2],[4,3],[4,4],[3,5],[2,6],[1,6]],
    E:[[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[0,0],[1,0],[2,0],[3,0],[1,6],[2,6],[3,6],[1,3],[2,3],[3,3]],
    F:[[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[0,0],[1,0],[2,0],[3,0],[1,3],[2,3],[3,3]],
    G:[[2,6],[3,6],[1,5],[0,4],[0,3],[0,2],[1,1],[2,0],[3,0],[4,1],[4,2],[4,5],[4,4],[3,4],[2,4]]
};
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
    resetter();
    writer("ABCDEFG",{switch:1});

});
//-------------------------------------------------------------------------------------------------------------------


function resetter(){
    rectNodeList.forEach((rectNode)=>{
        rectNode.style.setProperty("fill","#ebedf0", "important")
    })
}

function setter(data, letterWidth){
    data.forEach((datum)=>{
        console.log(`Total length: ${datum[0]+leftPadding} xMax: ${xMax}`)
        if(datum[0]+leftPadding>=xMax) return;
        console.log(`leftPadding: ${leftPadding}`);
        document.querySelector(`#ID_${datum[0]+leftPadding}-${datum[1]}`).style.setProperty("fill",defaultColors[4], "important");
    });
    leftPadding+=letterWidth+interLetterSpace;
}

function writer(word,animate){
    let letters = word.split('');
    let extra = 0;
    //- animated or not
    if(animate.switch===1){
        let animationTimer = window.setInterval(()=>{
            resetter();
            letters.forEach((letter)=>{
                let lData = alphabet[letter];
                lData.sort();
                let letterWidth = lData[lData.length-1][0]-lData[0][0]+1;
                setter(lData,letterWidth);
                console.log(`extra degeri: ${extra}`);
                if(xMax===extra) clearInterval(animationTimer);
                
            });
            animIterator++;
            leftPadding=animIterator;
        },500)
    }else{
        letters.forEach((letter)=>{
            let lData = alphabet[letter];
            lData.sort();
            let letterWidth = lData[lData.length-1][0]-lData[0][0]+1;
            setter(lData,letterWidth,0);
        })
    }
}

