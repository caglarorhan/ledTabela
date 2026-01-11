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
if(!wLS.getItem('alphabet')){
    wLS.setItem('alphabet',JSON.stringify({}));
}

//-----------------------------------------------------------------------------
window.addEventListener('load',  ()=>{
    console.log('test yuklendik...');
    let curURL = window.location.href;
    profileName = curURL.split('github.com')[1].split('/')[1];

    // TODO: alphabet.js verisi wLS ye aktarilacak
    let alpha = JSON.parse(wLS.getItem('alphabet'));
    Object.keys(alphabet).forEach((key)=>{if(!alpha[key]){alpha[key]=alphabet[key];}});
    wLS.setItem('alphabet',JSON.stringify(alpha));
    console.log(`Alphabet loaded with ${Object.keys(alpha).length} letters:`, Object.keys(alpha).join(', '));


    // TODO: draw dugmesi yapistirilmis datayi tabloya aktaracak
    // TODO: wLS deki alphabet keyleri fihrist gibi gosterilip tiklandiginda data bolmesine verisini aktaracak
    // TODO: colorChartlar wLS ye aktarilacak, kendi cahartlarini olusturmalari saglanacak
    // TODO: schedule edilen (reminder) noktalarin tarihlerinde uyari mesaji/email/sms gibi secenekelr olacak
    // TODO: Animasyonlu colorchart ve colorpicker verisi olan payload da wLS ye saklanabilecek
    // TODO: wLS export edilebilecek ve import edilebilecek
    // TODO: nokta render fonksiyonunda color noktada varsa degilde animasyondaki color pick type oncelikli secilecek!
    
    function initDataBoxes() {
        // Create drawing grid box
        let boxContainerOl = document.querySelector('ol.d-flex.flex-wrap.list-style-none.gutter-condensed.mb-4');
    
        if (boxContainerOl) {
            let boxLi = document.createElement('li');
            boxLi.style.width = '100%';
            boxLi.style.marginBottom = '20px';
            boxContainerOl.append(boxLi);
            
            let boxDiv = document.createElement('div');
            boxDiv.style.border = '1px solid #30363d';
            boxDiv.style.borderRadius = '6px';
            boxDiv.style.padding = '16px';
            boxDiv.style.backgroundColor = '#0d1117';
            boxDiv.id = 'patternDrawingBox';
            boxLi.append(boxDiv);
            
            boxDiv.innerHTML = `
                <div style="margin-bottom: 12px;">
                    <h3 style="color: #c9d1d9; margin: 0 0 12px 0; font-size: 16px;">Pattern Editor</h3>
                    <input type="text" id="patternName" placeholder="Pattern name" title="Enter a name for your pattern before saving" style="padding: 5px; margin-right: 8px; background: #161b22; border: 1px solid #30363d; color: #c9d1d9; border-radius: 6px;">
                    <input type="color" id="drawColor" value="#40c463" title="Select drawing color" style="margin-right: 8px;">
                    <label style="color: #c9d1d9; margin-right: 8px;" title="Enable to erase cells by dragging over them"><input type="checkbox" id="eraserMode" style="margin-right: 4px;">🧹 Eraser</label>
                    <button id="savePattern" title="Save current pattern to local storage" style="padding: 5px 12px; background: #238636; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 8px;">Save Pattern</button>
                    <button id="clearGrid" title="Clear all cells in the drawing grid" style="padding: 5px 12px; background: #da3633; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 8px;">Clear</button>
                    <button id="applyToChart" title="Apply current pattern directly to GitHub chart" style="padding: 5px 12px; background: #1f6feb; color: white; border: none; border-radius: 6px; cursor: pointer;">Apply to Chart</button>
                </div>
                <div style="margin-bottom: 12px;">
                    <select id="loadPattern" title="Load a previously saved pattern" style="padding: 5px; background: #161b22; border: 1px solid #30363d; color: #c9d1d9; border-radius: 6px; width: 200px;">
                        <option value="">Load saved pattern...</option>
                    </select>
                </div>
                <div id="drawingGrid" style="display: inline-block; background: #161b22; padding: 8px; border-radius: 6px; overflow: auto; max-width: 100%;"></div>
            `;
        }
        
        // Wait for grid size to be calculated, then build the drawing grid
        setTimeout(() => {
            buildDrawingGrid();
        }, 100);
    
    } // Close initDataBoxes function
    
    let currentPattern = [];
    let isDrawing = false;
    
    function buildDrawingGrid() {
        let gridContainer = document.querySelector('#drawingGrid');
        if (!gridContainer || xMax === 0) {
            console.log('Grid container not ready or xMax is 0');
            return;
        }
        
        gridContainer.innerHTML = '';
        
        // Calculate cell size to match real chart width
        let realChart = document.querySelector('table.ContributionCalendar-grid');
        let targetWidth = realChart ? realChart.offsetWidth : 800;
        let cellSize = Math.floor((targetWidth - (xMax + 1) * 2) / (xMax + 1));
        cellSize = Math.max(cellSize, 8); // Minimum 8px
        
        let gap = 2;
        
        gridContainer.style.width = targetWidth + 'px';
        
        // Create grid with same dimensions as GitHub chart
        for (let y = 0; y <= yMax; y++) {
            let row = document.createElement('div');
            row.style.display = 'flex';
            row.style.gap = gap + 'px';
            row.style.marginBottom = gap + 'px';
            
            for (let x = 0; x <= xMax; x++) {
                let cell = document.createElement('div');
                cell.style.width = cellSize + 'px';
                cell.style.height = cellSize + 'px';
                cell.style.backgroundColor = '#0d1117';
                cell.style.border = '1px solid #30363d';
                cell.style.borderRadius = '2px';
                cell.style.cursor = 'crosshair';
                cell.classList.add('drawing-cell');
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                cell.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    isDrawing = true;
                    paintCell(this);
                });
                
                cell.addEventListener('mouseenter', function() {
                    if (isDrawing) {
                        paintCell(this);
                    }
                });
                
                row.appendChild(cell);
            }
            gridContainer.appendChild(row);
        }
        
        // Stop drawing when mouse is released anywhere
        document.addEventListener('mouseup', function() {
            isDrawing = false;
        });
        
        // Setup buttons
        document.querySelector('#savePattern').addEventListener('click', savePattern);
        document.querySelector('#clearGrid').addEventListener('click', clearGrid);
        document.querySelector('#applyToChart').addEventListener('click', applyPattern);
        document.querySelector('#loadPattern').addEventListener('change', loadPattern);
        
        // Eraser mode toggle
        document.querySelector('#eraserMode').addEventListener('change', function() {
            let cells = document.querySelectorAll('.drawing-cell');
            cells.forEach(cell => {
                cell.style.cursor = this.checked ? 'not-allowed' : 'crosshair';
            });
        });
        
        loadPatternList();
        initEmojiPatterns();
    }
    
    function initEmojiPatterns() {
        let patterns = JSON.parse(localStorage.getItem('ledTabelaPatterns') || '{}');
        
        // Only add if not already present
        if (!patterns['Heart']) {
            patterns['Heart'] = [[2,1,'#ff0000'],[1,2,'#ff0000'],[3,2,'#ff0000'],[0,3,'#ff0000'],[1,3,'#ff0000'],[2,3,'#ff0000'],[3,3,'#ff0000'],[4,3,'#ff0000'],[1,4,'#ff0000'],[2,4,'#ff0000'],[3,4,'#ff0000'],[2,5,'#ff0000']];
        }
        if (!patterns['Smiley']) {
            patterns['Smiley'] = [[1,1,'#ffd700'],[2,1,'#ffd700'],[3,1,'#ffd700'],[4,1,'#ffd700'],[0,2,'#ffd700'],[5,2,'#ffd700'],[0,3,'#ffd700'],[1,3,'#000000'],[4,3,'#000000'],[5,3,'#ffd700'],[0,4,'#ffd700'],[1,4,'#ffd700'],[2,4,'#ffd700'],[3,4,'#ffd700'],[4,4,'#ffd700'],[5,4,'#ffd700'],[1,5,'#ffd700'],[4,5,'#ffd700']];
        }
        if (!patterns['Star']) {
            patterns['Star'] = [[2,0,'#ffd700'],[1,1,'#ffd700'],[2,1,'#ffd700'],[3,1,'#ffd700'],[0,2,'#ffd700'],[2,2,'#ffd700'],[4,2,'#ffd700'],[1,3,'#ffd700'],[3,3,'#ffd700'],[2,4,'#ffd700']];
        }
        if (!patterns['Check']) {
            patterns['Check'] = [[4,1,'#10b981'],[3,2,'#10b981'],[4,2,'#10b981'],[2,3,'#10b981'],[3,3,'#10b981'],[0,4,'#10b981'],[1,4,'#10b981'],[2,4,'#10b981']];
        }
        if (!patterns['Coffee']) {
            patterns['Coffee'] = [[1,0,'#8b4513'],[2,0,'#8b4513'],[3,0,'#8b4513'],[1,1,'#8b4513'],[3,1,'#8b4513'],[1,2,'#6f3709'],[2,2,'#6f3709'],[3,2,'#6f3709'],[0,3,'#8b4513'],[1,3,'#6f3709'],[2,3,'#6f3709'],[3,3,'#6f3709'],[4,3,'#8b4513'],[0,4,'#8b4513'],[1,4,'#6f3709'],[2,4,'#6f3709'],[3,4,'#6f3709'],[4,4,'#8b4513'],[1,5,'#8b4513'],[2,5,'#8b4513'],[3,5,'#8b4513']];
        }
        if (!patterns['Rocket']) {
            patterns['Rocket'] = [[2,0,'#ff0000'],[1,1,'#ff0000'],[2,1,'#cccccc'],[3,1,'#ff0000'],[2,2,'#cccccc'],[2,3,'#cccccc'],[1,4,'#ff6600'],[2,4,'#ff0000'],[3,4,'#ff6600'],[0,5,'#ffcc00'],[2,5,'#ff0000'],[4,5,'#ffcc00']];
        }
        
        localStorage.setItem('ledTabelaPatterns', JSON.stringify(patterns));
    }
    
    function paintCell(cell) {
        let eraserMode = document.querySelector('#eraserMode')?.checked || false;
        let x = parseInt(cell.dataset.x);
        let y = parseInt(cell.dataset.y);
        
        if (eraserMode) {
            // Erase mode - remove color and from pattern
            cell.style.backgroundColor = '#0d1117';
            currentPattern = currentPattern.filter(p => !(p[0] === x && p[1] === y));
        } else {
            // Draw mode - add color
            let color = document.querySelector('#drawColor').value;
            let isAlreadyPainted = cell.style.backgroundColor !== 'rgb(13, 17, 23)' && cell.style.backgroundColor !== '#0d1117';
            
            if (!isAlreadyPainted) {
                cell.style.backgroundColor = color;
                currentPattern.push([x, y, color]);
            }
        }
    }
    
    function savePattern() {
        let patternName = document.querySelector('#patternName').value.trim();
        if (!patternName) {
            alert('Please enter a pattern name');
            return;
        }
        
        let patterns = JSON.parse(localStorage.getItem('ledTabelaPatterns') || '{}');
        patterns[patternName] = currentPattern;
        localStorage.setItem('ledTabelaPatterns', JSON.stringify(patterns));
        
        document.querySelector('#patternName').value = '';
        loadPatternList();
        alert('Pattern saved: ' + patternName);
    }
    
    function loadPatternList() {
        let select = document.querySelector('#loadPattern');
        if (!select) return;
        
        let patterns = JSON.parse(localStorage.getItem('ledTabelaPatterns') || '{}');
        select.innerHTML = '<option value="">Load saved pattern...</option>';
        
        for (let name in patterns) {
            let option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        }
    }
    
    function loadPattern(e) {
        let patternName = e.target.value;
        if (!patternName) return;
        
        let patterns = JSON.parse(localStorage.getItem('ledTabelaPatterns') || '{}');
        let pattern = patterns[patternName];
        
        if (pattern) {
            clearGrid();
            currentPattern = JSON.parse(JSON.stringify(pattern)); // Deep copy
            
            // Apply to grid
            pattern.forEach(([x, y, color]) => {
                let cell = document.querySelector(`#drawingGrid [data-x="${x}"][data-y="${y}"]`);
                if (cell) {
                    cell.style.backgroundColor = color;
                }
            });
        }
    }
    
    function clearGrid() {
        currentPattern = [];
        let cells = document.querySelectorAll('#drawingGrid > div > div');
        cells.forEach(cell => {
            cell.style.backgroundColor = '#0d1117';
        });
    }
    
    function applyPattern() {
        if (currentPattern.length === 0) {
            alert('No pattern to apply');
            return;
        }
        
        // Clear chart first
        resetter();
        leftPadding = 0;
        
        // Apply pattern
        currentPattern.forEach(([x, y, color]) => {
            let targetCell = document.querySelector(`#ID_${x}-${y}`);
            if(targetCell) {
                targetCell.style.setProperty('background-color', color, 'important');
            }
        });
        
        alert('Pattern applied to chart!');
    }

    //
    // GitHub changed from SVG to TABLE structure
    // New selector: td.ContributionCalendar-day
    // Wait for calendar to load
    let initCalendar = () => {
        rectNodeList = document.querySelectorAll('td.ContributionCalendar-day');
        if(rectNodeList.length === 0) {
            console.log('Calendar not found yet, retrying...');
            setTimeout(initCalendar, 500);
            return;
        }
        
        console.log(`Found ${rectNodeList.length} calendar cells`);
        
        // Build a 2D grid based on actual DOM table structure
        // Find the parent table structure
        let rows = document.querySelectorAll('table.ContributionCalendar-grid tbody tr');
        
        if(rows.length > 0) {
            console.log(`Found ${rows.length} rows in calendar table`);
            
            rows.forEach((row, rowIndex) => {
                let cells = row.querySelectorAll('td.ContributionCalendar-day');
                cells.forEach((cell, colIndex) => {
                    let x = colIndex;  // column position
                    let y = rowIndex;  // row position
                    
                    if(i < 14) console.log(`Cell ${i}: x=${x}, y=${y}`);
                    
                    cell.setAttribute("id", `ID_${x}-${y}`);
                    cell.addEventListener('click',(e)=>{
                        let selectedColorInput = document.querySelector('#selectedColor');
                        if(selectedColorInput) {
                            let selectedColor = selectedColorInput.value;
                            newLetterRecord.push([x,y,selectedColor]);
                            let dataP = document.querySelector('#dataP');
                            if(dataP) {
                                dataP.value = `${JSON.stringify(newLetterRecord)}`;
                            }
                            e.target.style.setProperty("background-color",selectedColor, "important");
                        }
                    });
                    xMax = Math.max(xMax, x);
                    yMax = Math.max(yMax, y);
                    i++;
                });
            });
        } else {
            // Fallback if table structure not found
            console.log('Table structure not found, using fallback');
            rectNodeList.forEach((rectNode)=>{
                let x = Math.floor(i / 7);
                let y = i % 7;
                
                rectNode.setAttribute("id", `ID_${x}-${y}`);
            rectNode.addEventListener('click',(e)=>{
                // 3. parametre color pickerdan alinacak
                let selectedColorInput = document.querySelector('#selectedColor');
                if(selectedColorInput) {
                    let selectedColor = selectedColorInput.value;
                    newLetterRecord.push([x,y,selectedColor]);
                    let dataP = document.querySelector('#dataP');
                    if(dataP) {
                        dataP.value = `${JSON.stringify(newLetterRecord)}`;
                    }
                    // Use backgroundColor for TD elements instead of fill for SVG
                    e.target.style.setProperty("background-color",selectedColor, "important");
                }
            });
            xMax = Math.max(xMax, x);
            yMax = Math.max(yMax, y);
            i++;
        });
        }
    console.log(`Calendar grid size: xMax=${xMax}, yMax=${yMax}`);
    
    // Now initialize data boxes and controls
    initDataBoxes();
    };
    
    // Start initialization
    initCalendar();

// github colors
    let gitHubColors = ['#EBEDF0','#9BE9A8','#40C463','#30A14E','#216E39'];
    document.querySelectorAll('ul.legend li').forEach((oLi,oIndex)=>{
        oLi.setAttribute('data-color',gitHubColors[oIndex]);
        oLi.style.cursor='pointer';
        oLi.title='Click to pick that color';
        oLi.addEventListener('click',(e)=>{
            document.getElementById('selectedColor').value = e.target.dataset['color'];
        })
    })


//--<
});
//-------------------------------------------------------------------------------------------------------------------
function wLSa(key) { // get data from alphabet in the localstorage with a key
    let lsAlphabet = JSON.parse(wLS.getItem('alphabet'));
    if(!lsAlphabet.hasOwnProperty(key)){return false}
    return JSON.parse(JSON.stringify(lsAlphabet[key]));
}

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
    // Stop animation
    animationStatus = false;
    clearTimeout(animationTimer);
    
    // Reset variables
    leftPadding = 0;
    leftMargin = 0;
    totalWordLength = 0;
    
    // Clear all cells - set to original empty color
    rectNodeList = document.querySelectorAll('td.ContributionCalendar-day');
    rectNodeList.forEach((rectNode)=>{
        rectNode.style.removeProperty("background-color");
    });
}

function resetter(){
    rectNodeList = document.querySelectorAll('td.ContributionCalendar-day');
    rectNodeList.forEach((rectNode)=>{
        // Use baseColor if set, otherwise remove style to show default GitHub color
        if(baseColor && baseColor !== '') {
            rectNode.style.setProperty("background-color", baseColor, "important");
        } else {
            rectNode.style.removeProperty("background-color");
        }
    })
}

function setter(letterData, payload){
    //console.log(`Setter called with ${letterData.length} data points`);
    //console.log(`setter fonksiyonuna gelen letterdata: ${JSON.stringify(letterData)}`);
    
    // Handle space character (empty array) - just add to padding
    if(letterData.length === 0){
        leftPadding += 1; // Space width
        return;
    }
    
    letterData.forEach((datum)=>{
        //console.log(datum);
        let dotColor=baseColor;
        let xPos = datum[0]+leftPadding+leftMargin;
        let yPos = datum[1];

        //-------------------------------------
        // For animation, only draw if pixel is within visible range
        if(animationStatus && payload && payload.animate.switch){
            // Skip pixels that are off-screen (don't wrap them)
            if(xPos < 0 || xPos >= xMax){
                return; // Skip this pixel
            }
        } else {
            // For static display, wrap positions
            xPos = xPos % xMax;
        }
        //------------------------------------
        if(datum.length>2){
            dotColor = datum[2];
        }else if(payload){
            dotColor = colorSelection({color:payload.color, order: datum[1]});
        }
        
        let targetCell = document.querySelector(`#ID_${xPos}-${yPos}`);
        if(targetCell){
            targetCell.style.setProperty("background-color", dotColor, "important");
        } else {
            console.error(`Cell not found: #ID_${xPos}-${yPos}`);
        }

    });
    letterData.sort();
    let letterWidth = letterData[letterData.length-1][0]-letterData[0][0]+1;
    leftPadding+=letterWidth+1;
}


function writer(payload){
    console.log('Writer called with payload:', payload);
    console.log(`Current xMax: ${xMax}, yMax: ${yMax}`);
    let letters = [];
    animationStatus=true;
    baseColor = payload.color.bgColor;
    resetter();
    leftPadding=0;
    leftMargin=0;
    totalWordLength=0;
    if(payload && !payload.word){
        console.error('Please give some input to render!');
        return false;
    }
    console.log(`Writing word: "${payload.word}"`);
    console.log(`Word length: ${payload.word.length} characters`);
    //console.log(`Payload icinde gonderilen metin: ${payload.word} dir.`);
    let isWord = wLSa(payload.word); //  false veya dogrudan data doner, false demek bu aranan kelime alphabet de yok demektir
    //console.log(`${payload.word} kelimesi alphabette var mi: ${isWord}`);
    //console.log('----------------------------------------');
    if(!isWord){
        //console.log('Bu bir harfler kumesidir');
        letters = payload.word.split('');
        console.log(`Split into ${letters.length} characters:`, letters);
    }else{
        //console.log('Bu bir tumlesik kelimedir');
        letters= wLSa(payload.word);
    }

    animationDirection = payload.animate.animationDirection;

    if(!isWord){
        let lettersLength = letters.length;
        let validLetters = [];
        letters.forEach((letter)=>{
            let letterData = wLSa(letter);
            // Handle space character (empty array)
            if(letterData && Array.isArray(letterData) && letterData.length === 0){
                validLetters.push(letter);
                console.log(`Letter "${letter}": SPACE (width=1)`);
                totalWordLength+= 1; // Space takes 1 column
            }
            // Handle normal letters
            else if(letterData && Array.isArray(letterData) && letterData.length > 0){
                validLetters.push(letter);
                let orderedLetterData = [...letterData].sort();
                let letterLength = orderedLetterData[orderedLetterData.length-1][0]-orderedLetterData[0][0]+1;
                console.log(`Letter "${letter}": width=${letterLength}`);
                totalWordLength+= letterLength;
            }
            // Invalid character
            else{
                console.warn(`Character "${letter}" not found in alphabet or has invalid data, skipping...`);
            }
        });
        letters = validLetters; // Update letters to only include valid ones
        totalWordLength+= ((letters.length-1)*interLetterSpace); // added spaces
        console.log(`Total word length: ${totalWordLength} (including ${letters.length-1} inter-letter spaces)`);
    }

    // Set initial leftMargin based on animation direction for proper scrolling
    if(payload.animate.switch){
        if(animationDirection === 'Right'){
            // Scrolling right to left: start off-screen to the left
            leftMargin = -totalWordLength;
        } else {
            // Scrolling left to right (default LED): start off-screen to the right
            leftMargin = xMax;
        }
        console.log(`Animation starting with leftMargin=${leftMargin} (direction: ${animationDirection})`);
    }

    if(totalWordLength>xMax-1 && !payload.animate.switch){
        // Only check length if animation is OFF
        console.log(`Word too long: totalWordLength=${totalWordLength}, xMax=${xMax}`);
        console.error(`Word "${payload.word}" is too long (${totalWordLength} cells), max is ${xMax}. Enable animation or try shortening it!`);
        totalWordLength=0;
        animationStatus = false; // Stop any animation
        resetter(); // Reset chart
        return false;
    }
    
    // For animation, allow any length - it will scroll
    if(totalWordLength>xMax-1 && payload.animate.switch){
        console.log(`Long message (${totalWordLength} cells) will scroll with animation`);
    }
    
    // Check if we have any valid letters to display
    if(!isWord && letters.length === 0){
        console.error('No valid characters to display!');
        animationStatus = false;
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
                if(!isWord){
                    letters.forEach((letter)=>{
                        let letterData = wLSa(letter);
                        // Check if letterData is valid (array with content or empty array for space)
                        if(letterData && Array.isArray(letterData)){
                            setter(letterData, payload);
                        }
                    });
                }else{
                    setter(letters, payload); //whole word data from alphabet
                }

                animationDirection==='Right'?leftMargin++:leftMargin--;
                
                // Loop animation: when text scrolls completely off screen, wrap around
                if(animationDirection === 'Right'){
                    // Scrolling left to right: if text scrolls off right edge, start from left
                    if(leftMargin > xMax + totalWordLength){
                        leftMargin = -totalWordLength;
                    }
                } else {
                    // Scrolling right to left: if text scrolls off left edge, start from right
                    if(leftMargin < -totalWordLength){
                        leftMargin = xMax;
                    }
                }
                
                leftPadding=0;
                clearTimeout(animationTimer);
                animateIt();
            },animationSpeed);
            //console.log('Fonksiyon bitti')
        };
        animateIt();


    }else{
        if(!isWord){
            letters.forEach((letter)=>{
                let letterData = wLSa(letter);
                // Check if letterData is valid (array with content or empty array for space)
                if(letterData && Array.isArray(letterData)){
                    setter(letterData,payload);
                }
            })
        }else{
            //console.log(letters);
            setter(letters, payload); //whole word data from alphabet
        }

    }
}

function bgColorPainter(payload){
    let selectedColor = '#ebedf0'; // Default GitHub empty cell color
    
    if(payload && payload.color){
        selectedColor = payload.color;
    }
    
    rectNodeList = document.querySelectorAll('td.ContributionCalendar-day');
    rectNodeList.forEach((rectNode)=> {
        rectNode.style.setProperty("background-color", selectedColor, "important");
    })
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
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse)=>{
    switch (request.action) {
        case 'getSavedPatterns':
            let patterns = JSON.parse(localStorage.getItem('ledTabelaPatterns') || '{}');
            sendResponse({patterns: patterns});
            return true;
            
        case 'runPattern':
            let savedPatterns = JSON.parse(localStorage.getItem('ledTabelaPatterns') || '{}');
            let pattern = savedPatterns[request.patternName];
            if (pattern) {
                // Animate the pattern if animation is enabled
                if (request.animate && request.animate.switch) {
                    animationStatus = true;
                    baseColor = request.color.bgColor;
                    animationDirection = request.animate.animationDirection || 'Left';
                    animationSpeed = request.animate.animationSpeed || 500;
                    leftMargin = 0;
                    leftPadding = 0;
                    
                    resetter();
                    
                    let animatePattern = () => {
                        animationTimer = setTimeout(() => {
                            resetter();
                            
                            // Apply pattern with offset
                            pattern.forEach(([x, y, color]) => {
                                let xPos = x + leftMargin;
                                
                                // Wrap around logic
                                if (animationDirection === 'Right') {
                                    xPos = xPos % xMax;
                                } else {
                                    xPos = (xMax + (xPos % xMax)) % xMax;
                                }
                                
                                let targetCell = document.querySelector(`#ID_${xPos}-${y}`);
                                if(targetCell) {
                                    targetCell.style.setProperty('background-color', color, 'important');
                                }
                            });
                            
                            animationDirection === 'Right' ? leftMargin++ : leftMargin--;
                            clearTimeout(animationTimer);
                            animatePattern();
                        }, animationSpeed);
                    };
                    animatePattern();
                    
                } else {
                    // Static pattern without animation
                    resetter();
                    leftPadding = 0;
                    pattern.forEach(([x, y, color]) => {
                        let targetCell = document.querySelector(`#ID_${x}-${y}`);
                        if(targetCell) {
                            targetCell.style.setProperty('background-color', color, 'important');
                        }
                    });
                }
                sendResponse({success: true});
            } else {
                sendResponse({success: false});
            }
            return true;
            
        case 'runRequest':
            let results={};
            if(typeof request.payload ==='object' && request.payload.constructor===Object && Object.keys(request.payload).length>0){
                results = await window[request.value](request.payload);
            }else{
                results = await window[request.value]();
            }
            if(request.callBack && request.callBack.callBackName){
                //console.log(`result gonderilecek: ${results}`);
                m2p({value:request.callBack.callBackName, action:'runRequest',payload: results,})
            }

            break;
        default:
            console.log(request.value);
            break;
    }
    sendResponse({received: true});
    return true;
});
