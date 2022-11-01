/////////////////////////////////////////////////////////////////////////////////////////
//IIFE....for data privacy

//BUDGET CONTROLLER
var budgetcontroller = (function(){
  //No use...example
  // var x = 23
  // //Can't access this directly
  // var add = function(a){
  //   return x+a;
  // }
  // //Declare an object and add to it the things which can be accesessed from outside
  // return{
  //   publictest: function(b){
  //     return add(b)
  //   }
  // }
  var Expense = function(id,desc,val){
    this.id = id;
    this.desc = desc;
    this.val = val;
    this.percentage = -1;
  };

  Expense.prototype.calcpercentage = function(totalincome){
    if(totalincome > 0){
        this.percentage = Math.round((this.val/totalincome)*100);
    }
    else{
      this.percentage = -1;
    }
  };

  Expense.prototype.getpercentage = function(){
    return this.percentage;
  };

  var Income = function(id,desc,val){
    this.id = id;
    this.desc = desc;
    this.val = val;
  };

  var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(cur){
    sum = sum + cur.val;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems:{
      exp : [],
      inc : []
    },
    totals:{
      exp : 0,
      inc : 0
    },
    budget : 0,
    percentage : -1
  };

    return{
      additem:function(type,des,value){

        var newitem,ID;

        //ID for unique identification of each new item
        if(data.allItems[type].length > 0){
          ID = data.allItems[type][data.allItems[type].length-1].id;
          ID = ID + 1;
        }
        else{
          ID = 0;
        }

        //Create new item based on inc or exp
        if(type === 'exp'){
          newItem = new Expense(ID,des,value);
        }
        else if(type === 'inc'){
          newItem = new Income(ID,des,value);
        }

        //Push in onto the arrays
        data.allItems[type].push(newItem);

        //Return the new Element
        return newItem;
      },

      deleteitem:function(type,id){
        var ids = data.allItems[type].map(function(current){
          return current.id;
        });
        index = ids.indexOf(id);
        if(index !== -1){
          data.allItems[type].splice(index,1);
        }
      },

      calculatebudget: function(){
        //Calculate the total income and total budget
        calculateTotal('exp');
        calculateTotal('inc');

        //Calculate budget = income - expenses
        data.budget = data.totals.inc - data.totals.exp;

        //Calculate the % of income that we spent
        if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
        }
        else{
          data.percentage = -1;
        }
      },

      calculatepercentages: function(){
        data.allItems.exp.forEach(function(cur){
          cur.calcpercentage(data.totals.inc);
        });
      },

      getpercentages: function(){
        var allperc = data.allItems.exp.map(function(cur){
          return cur.getpercentage();
        });
        return allperc;
      },

      getBudget: function(){
        return {
         budget: data.budget,
         totalinc: data.totals.inc,
         totalexp: data.totals.exp,
         percent: data.percentage
       };
     },

       testing: function(){
         console.log(data);
      }
    };

})();

//////////////////////////////////////////////////////////////////////////////////////////

//UI CONTROL
var uicontroller = (function(){

//Can generalize classnames...easier to  change
var DOMstring = {
  inputtype : '.add__type',
  inputdesc : '.add__description',
  inputval : '.add__value',
  inputbtn : '.add__btn',
  incomeContainer: '.income__list',
  expensesContainer: '.expenses__list',
  budgetlabel: '.budget__value',
  incomelabel: '.budget__income--value',
  expenseslabel: '.budget__expenses--value',
  percentagelabel: '.budget__expenses--percentage',
  container: '.container',
  expensesperc:'.item__percentage',
  datelabel:'.budget__title--month'

};

var formatnumber = function(num,type){
   var numSplit,int,dec;
   num = Math.abs(num);
   num = num.toFixed(2);

  numSplit = num.split('.');
  int = numSplit[0];
   if(int.length>3){
     int = int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
   }
  dec = numSplit[1];

  return (type==='exp'?'-':'+')+int+'.'+dec;
};

var nodelistforeach = function(list,callback){
  for(var i = 0;i < list.length;i++){
    callback(list[i],i);
  }
};

  return{

      getinput:function(){
      return{
      type : document.querySelector(DOMstring.inputtype).value, //inc or exp
      description : document.querySelector(DOMstring.inputdesc).value,
      value : parseFloat(document.querySelector(DOMstring.inputval).value)  //make it float
            };
                         },

     addListItem: function(obj,type){
       //Create HTML string with placeholders
       var HTML,newHTML,element;
       if(type === 'inc'){
         element = DOMstring.incomeContainer;
          HTML = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
       }
       else if(type === 'exp'){
         element = DOMstring.expensesContainer;
         HTML = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
       }

       //Replace placeholder with data
       newHTML = HTML.replace('%id%',obj.id);
       newHTML = newHTML.replace('%description%',obj.desc);
       newHTML = newHTML.replace('%value%',formatnumber(obj.val,type));

       //Insert HTML into DOM
       document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);

     },

     deleteListItem: function(SelectID){
       document.getElementById(SelectID).parentNode.removeChild(document.getElementById(SelectID));
     },

     clearfield: function(){
       var field,fieldArr;
       field = document.querySelectorAll(DOMstring.inputdesc+','+DOMstring.inputval);
       fieldArr = Array.prototype.slice.call(field);
       fieldArr.forEach(function(current,index,array){
         current.value = "";
       });
       fieldArr[0].focus();
     },

     displaybudget: function(obj){
       document.querySelector(DOMstring.budgetlabel).textContent = obj.budget;
       document.querySelector(DOMstring.incomelabel).textContent = obj.totalinc;
       document.querySelector(DOMstring.expenseslabel).textContent = obj.totalexp;
       if(obj.percent >= 0){
         document.querySelector(DOMstring.percentagelabel).textContent = obj.percent+'%';
       }
       else
       {
         document.querySelector(DOMstring.percentagelabel).textContent = '###';
       }

     },

     displaypercentages: function(perc){
       var fields = document.querySelectorAll(DOMstring.expensesperc);

       nodelistforeach(fields,function(current,index){
         if(perc[index] > 0){
            current.textContent = perc[index] + '%';
         }
         else{
           current.textContent = '###';
         }

       });
     },

     displayMonth: function(){
       var now,year,month;
       months = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
       now = new Date();
       year = now.getFullYear();
       month = now.getMonth();
       document.querySelector(DOMstring.datelabel).textContent = months[month] + ',' + year;
     },

     changetype: function(){
       var fields = document.querySelectorAll(DOMstring.inputtype + ',' + DOMstring.inputdesc + ',' + DOMstring.inputval);
       nodelistforeach(fields,function(cur){
         cur.classList.toggle('red-focus');
       });
       document.querySelector(DOMstring.inputbtn).classList.toggle('red');
     },

      getDomstring:function(){
        return DOMstring;
      }

        };
})();

///////////////////////////////////////////////////////////////////////////////////////////

//GLOBAL APP CONTROL
//should have access to other
var controller = (function(budgetctrl,uictrl){

//No use...example
// var z = budgetctrl.publictest(5);
//
// return{
//   public:function(){
//     console.log(z)
//   }
// }

  var setupeventlisteners = function(){

  //Get Domstring
  var DOM = uictrl.getDomstring();

  //Adding click and keypress event(Enter key)
  document.querySelector(DOM.inputbtn).addEventListener('click',ctrladditem);

  //pass event parameter for Enter
  document.addEventListener('keypress',function(event){

    if(event.keycode === 13 || event.which === 13){
      ctrladditem();
    }
   });

   //Click on delete buttons
   document.querySelector(DOM.container).addEventListener('click',ctrldeleteitem);

   //Toggle color of input box
   document.querySelector(DOM.inputtype).addEventListener('change',uictrl.changetype);

};

  var updatebudget = function(){

  //Calc budget
  budgetctrl.calculatebudget();

  //Return budeget
  var budget = budgetctrl.getBudget();

  //Display budget on UI
  //console.log(budget);
  uictrl.displaybudget(budget);

};

  var updatepercent = function(){

  // Calculate Percent
  budgetctrl.calculatepercentages();

  //Read percent from Budget Contoller
  var x = budgetctrl.getpercentages();

  //Update UI
  uictrl.displaypercentages(x);

};

  //A general function to be called when click or Enter pressed
  var ctrladditem = function(){
  var input,newitem;

  //Get the input data
  input = uictrl.getinput();
  //console.log(input);

  //Validate input
  if(input.description !=="" && !isNaN(input.value) && input.value >0){

      //Add item to budgetcontroller
      newitem = budgetctrl.additem(input.type,input.description,input.value);

      //Add item to UI
      uictrl.addListItem(newitem,input.type);

      //Clear fields
      uictrl.clearfield();

      //calc budget
      updatebudget();

      //Calc and update percentages
      updatepercent();

  }
};

var ctrldeleteitem = function(event){
  var itemID,splitID,type,ID;
  //Move up the DOM structure
  itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
  if(itemID){
    splitID = itemID.split('-');
    type = splitID[0];
    ID = parseInt(splitID[1]);

    //Delete item from data structure
    budgetctrl.deleteitem(type,ID);

    //Delete item from UI
    uictrl.deleteListItem(itemID);

    //Update and show new budget
    updatebudget();

    //Calc and update percentages
    updatepercent();

  }
};

return{
  init:function(){
    uictrl.displayMonth();
    uictrl.displaybudget({
      budget : 0,
      totalinc : 0,
      totalexp : 0,
      percent : -1
    });
    setupeventlisteners();


  }
};
})(budgetcontroller,uicontroller);

//To initialize
controller.init();
