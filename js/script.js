/*
 * Version: v1.1
 * Author:  Luis Rojas
 * Created on: May 5, 2016
 * Last Modified: May 9, 2016
 * Description: Pure Javascript code to handle Smokehouse functionality
 */

 (function() {
     
     'use strict';

     //Constants
     var DELIVERY_COST = 1.3,
         MODIFIER_COST = 0.33,
         count = 0,
         valClick,
         priceP = 0,
         total = 0,
         subTotal = 0,
         taxVal,
         counter = 0;

     function loadJSON(callback){
         var xhr = new XMLHttpRequest();
         xhr.open("GET", "js/menu/menu.json", true);
         xhr.onreadystatechange = function() {
           if (xhr.readyState == 4 && xhr.status == "200") {
             callback(xhr.responseText);
           }
         };
         xhr.send();
     }

     //loadJSON creates HTML elements based on JSON data(callback)
     loadJSON(function(response){
        var menuObj = JSON.parse(response),
            divIdContent = document.getElementById("content");

        //This cycles builds the entire product list from the JSON file
        for(var i=0;i<menuObj.length;i++){
           var obj = menuObj[i];

           divIdContent.innerHTML += "<div class='product' id='product-" + i + "'><p class='title'>" + obj.title + "</p><p class='description'>" +
           obj.description + "</p><a onclick='addCart(this)' id='btn-" + i + "' class='add-btn btn btn-success'>Add</a>" + "<span><strong>Price: </strong></span><span id='price' class='price'>"+ obj.price +"</span></div>";

           if( !arrayIsEmpty(obj.modifiers) ){
               document.getElementById("product-" + i).innerHTML += "<div class='modifiers' id='modifiers'></div>";
               for(var y=0;y<obj.modifiers.length;y++){
                   var modif = obj.modifiers[y];
                   document.getElementById("modifiers").innerHTML += "<div>" + modif.title + "</div>";
                   for(var z=0;z<modif.mods.length;z++){
                       var mods = modif.mods[z];
                       document.getElementById("modifiers").innerHTML += "<input type='checkbox' onclick='OnChangeCheckbox (this)'><label>" + mods.title + "</label></input>";
                   }
               }
           }
        }
    });//end loadJSON
     
    //Check if product has modifiers
    function arrayIsEmpty(object) {
      for(var key in object) {  
        if(object.hasOwnProperty(key)){
          return false;
        }
      }
      return true;
    }

    //Get siblings of the element passed by, Used for getting the price of the products
    function getSiblings(el, filter) {
        var siblings = [];
        el = el.parentNode.firstChild;
        do { if (!filter || filter(el)) siblings.push(el); } while (el = el.nextSibling);
        return siblings;
    }
    
    //Add the quantity, product, price and final total of the product 
    window.addCart = function(valA){
        var sibs  = getSiblings(valA),
            dataA;

        priceP = parseFloat(sibs[4].innerText);
        subTotal += priceP;
        dataA = parseInt(valA.dataset.clicked) + 1;

        if( !valA.hasAttribute("data-clicked") ){
            document.getElementById("product-list").innerHTML += "<tr class='" + valA.id + "'><td id='quantity-" + valA.id + "'>" + 1 + "</td> <td>" + sibs[0].innerText +
            "</td><td id='price-" + valA.id + "'>" + priceP + "</td></tr>";
        }else{
            document.getElementById("quantity-" + valA.id).innerHTML = dataA;
        }

        //Calculates the taxes, subtotal and total 
        valClick = valA.id;
        count = parseInt(count) + 1;
        taxVal = subTotal * 0.15;
        total = subTotal + taxVal + DELIVERY_COST;

        document.getElementById("delivery").innerHTML = DELIVERY_COST;
        document.getElementById("taxes").innerHTML = "$" + taxVal.toFixed(2);
        document.getElementById("total").innerHTML = "$" + total.toFixed(2);
    };//end window.addCart 
     
     
    window.onload = function(){
        var anchors = document.querySelectorAll('.add-btn'),
            payment,
            addModifier = 0,
            resultModifier = 0,
            innerPrice;

        for (var i=0; i<anchors.length; i++) {
            anchors[i].addEventListener('click', handler, false);
            document.getElementsByClassName("quantity-btn-" + i).innerHTML = 0;
        }
        
        //each time any "Add" button is clicked
        function handler() {
            var defaultlist = document.getElementById("default-list");
            
            //If default-list element exists then remove it
            if(defaultlist){
                //Remove default table row
                defaultlist.parentNode.removeChild(defaultlist);
            } 
            
            if( this.hasAttribute("data-clicked") ){
                counter += 1;
                this.setAttribute("data-clicked", counter);
            }else{
                counter = 1;
                this.setAttribute("data-clicked", counter);
            }  

            //Checkout functionality
            if( parseFloat(document.getElementById("total").innerHTML) !== 0){
                document.getElementById("checkout").style.display = "block";
                window.placeOrder = function(){
                    if(document.getElementById("payment").value){
                        payment = parseFloat(document.getElementById("payment").value);
                        document.getElementById("yourChange").innerHTML += total.toFixed(2) - payment.toFixed(2);
                        document.getElementById("error").style.display = "none";
                    }else{
                        document.getElementById("error").innerHTML = "Please add an invalid amount.";
                    }
                };
            }
        }
        
        //On click on the modifiers checkbox it add the cost to the final price
        window.OnChangeCheckbox = function(checkbox) {
           if (checkbox.checked) {
               resultModifier += parseFloat(addModifier) + parseFloat(MODIFIER_COST);
               console.log("modifier: " + resultModifier.toFixed(2));
               innerPrice = document.getElementById("price-btn-0").innerHTML;
               innerPrice = parseFloat(innerPrice) + resultModifier;
           }else{
               resultModifier = parseFloat(resultModifier) - parseFloat(MODIFIER_COST);
               console.log("modifier: " + resultModifier.toFixed(2));
               innerPrice = parseFloat(innerPrice) - resultModifier;
           }
           document.getElementById("price-btn-0").innerHTML = innerPrice.toFixed(2);
        };
    };//end window.onload()

 })();
