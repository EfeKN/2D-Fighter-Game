const canv = document.querySelector('canvas') 

//Query Selector lets you find the first element that matches the CSS Selector

/*
The HTML DOM Document Object
The document object represents your web page.

If you want to access any element in an HTML page, you always start with accessing the document object.

Below are some examples of how you can use the document object to access and manipulate HTML.
*/

//Adjust resolution | 16:9
canv.width = 1024;
canv.height = 576;

const c = canv.getContext('2d');
c.fillRect(0,0,1024,576)
