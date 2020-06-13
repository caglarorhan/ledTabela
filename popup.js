window.addEventListener('load',()=>{

    document.querySelector('#sendWordsButton').addEventListener('click',()=>{
        let words = document.querySelector('#words').value;
        alert(words);
    })

});
