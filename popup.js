// Settings persistence
async function saveSettings() {
    const settings = {
        colorChart: document.querySelector('#colorChartSelection').value,
        colorPickingType: document.querySelector('#colorPickingTypeSelection').value,
        words: document.querySelector('#words').value,
        animationSwitch: document.querySelector('#animationSwitch').checked,
        bgColor: document.querySelector('#bgColor').value,
        animationDirection: document.querySelector('#animationDirection2Right').checked ? 'Right' : 'Left',
        animationSpeed: document.querySelector('#animationSpeed').value
    };
    await chrome.storage.local.set({ ledTabelaSettings: settings });
}

async function loadSettings() {
    const result = await chrome.storage.local.get('ledTabelaSettings');
    if (result.ledTabelaSettings) {
        const settings = result.ledTabelaSettings;
        if (settings.words) document.querySelector('#words').value = settings.words;
        if (settings.animationSwitch !== undefined) document.querySelector('#animationSwitch').checked = settings.animationSwitch;
        if (settings.bgColor) document.querySelector('#bgColor').value = settings.bgColor;
        if (settings.animationSpeed) {
            document.querySelector('#animationSpeed').value = settings.animationSpeed;
            document.querySelector('#animationSpeedDisplay').textContent = settings.animationSpeed;
        }
        // Set dropdowns and direction after options are loaded
        setTimeout(() => {
            if (settings.colorChart) document.querySelector('#colorChartSelection').value = settings.colorChart;
            if (settings.colorPickingType) document.querySelector('#colorPickingTypeSelection').value = settings.colorPickingType;
            if (settings.animationDirection === 'Right') {
                document.querySelector('#animationDirection2Right').checked = true;
            } else {
                document.querySelector('#animationDirection2Left').checked = true;
            }
        }, 100);
    }
}

window.addEventListener('load',()=>{
    // Check if current tab is a GitHub profile page
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            let url = tabs[0].url;
            // Pattern: https://github.com/{username} (no more slashes after username)
            let githubProfilePattern = /^https:\/\/github\.com\/[^\/]+\/?$/;
            
            if (!githubProfilePattern.test(url)) {
                showError('⚠️ This extension only works on GitHub profile pages (e.g., github.com/username)');
            }
        }
    });
    
    // colorChart and picking type selections
    // Try to get from content script first
    m2c({value:'getColorChartData', action:'runRequest', callBack: {callBackName: 'setColorSelectionOptions', echo:true}});
    
    // Load saved patterns into dropdown
    loadSavedPatterns();
    
    // Fallback: populate dropdowns directly if colorCharts is available
    setTimeout(() => {
        const chartSelect = document.querySelector('#colorChartSelection');
        const pickingSelect = document.querySelector('#colorPickingTypeSelection');
        
        // Only populate if still empty and colorCharts is available
        if (chartSelect.options.length === 1 && typeof colorCharts !== 'undefined') {
            Object.keys(colorCharts).forEach((chartName)=>{
                let option = document.createElement('option');
                option.value = chartName;
                option.textContent = chartName;
                chartSelect.append(option);
            });
        }
        
        if (pickingSelect.options.length === 1 && typeof colorPickingTypes !== 'undefined') {
            colorPickingTypes.forEach((pickingType)=>{
                let option = document.createElement('option');
                option.value = pickingType;
                option.textContent = pickingType;
                pickingSelect.append(option);
            });
        }
    }, 200);
    
    // Load saved settings
    loadSettings();
    
    // Clear text when pattern is selected
    document.querySelector('#savedPatternSelection').addEventListener('change', function() {
        if (this.value) {
            document.querySelector('#words').value = '';
        }
    });
    
    // Clear pattern when text is entered
    document.querySelector('#words').addEventListener('input', function() {
        if (this.value) {
            document.querySelector('#savedPatternSelection').value = '';
        }
    });
    
    function loadSavedPatterns() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'getSavedPatterns'
            }, function(response) {
                if (response && response.patterns) {
                    const select = document.querySelector('#savedPatternSelection');
                    select.innerHTML = '<option value="">Choose a saved pattern...</option>';
                    
                    Object.keys(response.patterns).forEach(name => {
                        let option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        select.appendChild(option);
                    });
                }
            });
        });
    }

    // Helper functions for UI feedback
    function showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
    
    function showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 2000);
    }
    
    function setLoading(isLoading) {
        const button = document.querySelector('#sendWordsButton');
        const resetButton = document.querySelector('#resetButton');
        if (isLoading) {
            button.disabled = true;
            button.textContent = 'RUNNING...';
            resetButton.disabled = true;
        } else {
            button.disabled = false;
            button.textContent = 'RUN';
            resetButton.disabled = false;
        }
    }

    // run process
    document.querySelector('#sendWordsButton').addEventListener('click',async (e)=>{
        console.log('RUN button clicked');
        let words = document.querySelector('#words').value;
        let savedPattern = document.querySelector('#savedPatternSelection').value;
        
        // Check if using pattern or text
        if (savedPattern) {
            // Use saved pattern
            let animationSwitch = document.querySelector('#animationSwitch').checked;
            let bgColor = document.querySelector('#bgColor').value;
            let animationDirection = document.querySelector('#animationDirection2Right').checked ? 'Right' : 'Left';
            let animationSpeed = parseInt(document.querySelector('#animationSpeed').value);
            
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'runPattern',
                    patternName: savedPattern,
                    animate: {
                        switch: animationSwitch,
                        animationDirection: animationDirection,
                        animationSpeed: animationSpeed
                    },
                    color: {
                        bgColor: bgColor
                    }
                }, function(response) {
                    if (response && response.success) {
                        showSuccess(animationSwitch ? 'Pattern animating!' : 'Pattern applied!');
                    } else {
                        showError('Failed to apply pattern');
                    }
                });
            });
            return;
        }
        
        // Input validation for text
        if (!words || words.trim() === '') {
            showError('Please enter some text or select a pattern!');
            return false;
        }
        
        let animationSwitch = document.querySelector('#animationSwitch').checked;
        let bgColor = document.querySelector('#bgColor').value;
        let selectedChartName = document.querySelector('#colorChartSelection').value;
        
        if(selectedChartName===''){
            showError('Please select a color chart!');
            return false;
        }
        
        let selectedColorPickingType = document.querySelector('#colorPickingTypeSelection').value;
        if(selectedColorPickingType===''){
            showError('Please select a color picking type!');
            return false;
        }
        
        let animationDirection='Left';
        if(document.querySelector('#animationDirection2Right').checked){animationDirection='Right'}
        
        // Validate colors - get first color from selected chart
        let firstLetterColor = colorCharts[selectedChartName] ? colorCharts[selectedChartName][0] : null;
        if (firstLetterColor && firstLetterColor.toLowerCase() === bgColor.toLowerCase()) {
            showError('Background and letter colors cannot be the same! Please choose different colors.');
            return false;
        }
        
        // Show loading state
        setLoading(true);
        
        try {
            console.log('Sending to writer:', {word:words, chartName:selectedChartName, colorPickingType: selectedColorPickingType, bgColor:bgColor});
            m2c({value:'writer', action:'runRequest', payload:{word:words, animate:{switch:animationSwitch, animationDirection: animationDirection}, color:{chartName:selectedChartName, colorPickingType: selectedColorPickingType, set:[], bgColor:bgColor}}, callBack:{callBackName:null, echo:false}});
            
            // Save settings
            await saveSettings();
            
            showSuccess('Pattern applied successfully!');
        } catch (error) {
            showError('Failed to apply pattern. Please try again.');
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    });

    //reset proces
    document.querySelector('#resetButton').addEventListener('click',()=>{
        console.log('RESET button clicked');
        m2c({value:'resetProcess',action:'runRequest'});
        showSuccess('Table reset!');
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
        document.getElementById('animationSpeedDisplay').textContent = e.target.value;
        m2c({value:'animationModifier', action:'runRequest', payload: {animationSpeed:e.target.value}})
    });
    
    document.querySelector('#animationSpeed').addEventListener('input',(e)=>{
        document.getElementById('animationSpeedDisplay').textContent = e.target.value;
    });

    // board bgColor
    document.querySelector('#bgColor').addEventListener('change',(e)=>{
       m2c({value:'animationModifier', action:'runRequest', payload:{baseColor:e.target.value}})
    })

    //paintBGNowButton - bgColor painter
    document.querySelector('#paintBGNowButton').addEventListener('click',()=>{
        console.log('Apply BG Now button clicked');
        let bgColor = document.getElementById('bgColor').value;
        m2c({value:'bgColorPainter', action:'runRequest', payload:{color:bgColor}});
        showSuccess('Background color applied!');
    })

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter or Cmd+Enter: Run
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            document.querySelector('#sendWordsButton').click();
        }
        // Ctrl+R or Cmd+R: Reset (prevent default browser reload)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            document.querySelector('#resetButton').click();
        }
        // Escape: Clear error messages
        if (e.key === 'Escape') {
            document.getElementById('errorMessage').style.display = 'none';
            document.getElementById('successMessage').style.display = 'none';
        }
    });
    
    // Auto-save settings when changed
    ['colorChartSelection', 'colorPickingTypeSelection', 'words', 'animationSwitch', 'bgColor', 'animationSpeed'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', () => {
                saveSettings().catch(err => console.error('Failed to save settings:', err));
            });
        }
    });

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
chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    switch(request.action){
        case "runRequest":
            if(request.payload){
                window[request.value](request.payload);
            }else{
                window[request.value]();
            }
            break;
        default:
            // Log message instead of alert
            if(request.value){
                console.log('Message from content script:', request.value);
            }
            break;
    }
    sendResponse({received: true});
    return true;
});
