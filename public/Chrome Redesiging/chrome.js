const btn1 = document.querySelector(".search-btn");
const btn2 = document.querySelector(".mic-btn");
const search = document.querySelector(".data")
const yourtext = document.querySelector(".your-text")
const box = document.querySelector(".your-data");

var textvalue ;



const editableText= document.getElementById('editable-text');   //here we are selecting the editable text

if(localStorage.getItem('savedText')){                                    //If there is a value stored in the local storage under the key 'savedText', we assign that value to        
  editableText.textContent=localStorage.getItem('savedText');             //textContent property of the editableText element. This ensures that the previously saved text is 
}                                                                         //displayed when the page is loaded. 




editableText.addEventListener('input', function(){                  //here when ever the user changes the input the eventlistner get triggred

  localStorage.setItem('savedText',this.textContent);               //and the current value of the input will be saved to the localstorage 
})



btn1.addEventListener("click",() =>{

    googleSearch();   //we have created an function to search for the value on google      //function call 

})

function googleSearch(){
  textvalue = search.value;         //storing the input value in the var textvalue
  console.log(textvalue);
 
  var searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(textvalue);

  //The encodeURIComponent() function is a built-in JavaScript function that encodes a Uniform Resource Identifier (URI) component by replacing special characters with their percent-encoded counterparts. It ensures that the user's input is properly encoded and can be used within a URL.
  
  window.open(searchUrl, "_blank");

}


