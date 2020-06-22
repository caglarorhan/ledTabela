## Table of Contents
1. What is Led Tabela?
1. Installing and Usage
1. Working Logic
1. Project File Structure
1. TODOs
1. Licence




#### What is Led Tabela?

Led Tabela is a small 3-5 day **Chrome Extension** project to try to convert GitHub Profile page contributions table into a led sign, just for fun. **Led Tabela** is in Turkish and means "Led Sign".

I started to the project to see if I can convert this table into an equalizer or disco ball like colorful animated thing at the beginning. But I thought that writing some thing as a led panel/sign might be the first step to understand x:y coordinate system animation logic. Here is the working version of it.

Now and on, I will try to create a disco ball animation and if I could, get some input music player API  get some channels data to turn them into equalizer light graphic.

#### Installing and Usage

You can find this extension after couple of weeks in the Chrome Store or you can fork/pull git repo and run it from Chrome Developer mode as "Load unpacked" extension. After loading you can easily figure out how to use the interface. 
Write your own word. Choose color chart, color picking type and animations. Run. You can describe your own chart at alphabet.js file and you can describe your own color charts at colorCharts.js.   

#### Working Logic

Like other browser extensions do, Led Table injects a js file and run some scripts into clients side GitHub web page and make some html code manipulations. After making these changes it uses javascript to re-coloring svg rectangles. Create some animations and effects, etc.

- Steps
    - Add new ids to create x:y coordinates logic. 53 columns (last one is not complete) and 7 rows on every columns. Ever cell has unique id like "ID_5-50".
    ``` 
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
    ```
  There is also a mini tool to create date from rectangle click. Also, some of events added to these rectangles.
  
  - We are using two main functions. **writer** and **setter**. writer send words letters to setter, and setter paint the rectangles (from the x:y data). I any animation requested this function adjusts x data of the letters point data. The function adjust this positioning property with two variables **leftMargin** and **leftPadding**. Leftmargin calculated with animation process, left padding is calculated with previous letters width and interletterspace amount. 

#### Project File Structure

- **alphabet.js** includes data as arrays of [x,y] coordinates to create alphabet letters and other signs dot .
- **colorCharts.js** storing different colors data as arrays.
- **manifest.json** fundamental file of the browser extension.
- **popup.html** extension file user interface (pop ups when the icon of extension clicked)
- **popup.js** loaded from browser itself when extension icon clicked
- **led-tabela.js** injected into loaded/rendered GitHub html page. 
- **readme.md** this readme file.


 
#### TODOS (in Turkish) -dd: done and dust

    // dd TODO: draw dugmesi yapistirilmis datayi tabloya aktaracak
    // dd TODO: wLS deki alphabet keyleri fihrist gibi gosterilip tiklandiginda data bolmesine verisini aktaracak
    // TODO: colorChartlar wLS ye aktarilacak, kendi cahartlarini olusturmalari saglanacak
    // TODO: schedule edilen (reminder) noktalarin tarihlerinde uyari mesaji/email/sms gibi secenekelr olacak, boylece kullanici yil icinde herhangi bir tarih araliginda yazi gibi gorunmesini istedigi alanda uyarilar alarak commit push edip yaziyi olusturabilecek
    // TODO: Animasyonlu colorchart ve colorpicker verisi olan payload da wLS ye saklanabilecek
    // TODO: wLS export edilebilecek ve import edilebilecek
    // dd TODO: nokta render fonksiyonunda color noktada varsa degilde animasyondaki color pick type oncelikli secilecek!

#### Licence

MIT Licence as written GitHub page.
