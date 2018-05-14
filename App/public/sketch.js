var socket;

//record to hold information about the major when the server sends it
let globalMajorRecord = {};

//holds a list of divs so that the connectClasses function can use their offsets to connect them
let divs = [];
//holds the elective divs
let elecDivs = [];


// Start a socket connection to the server
//change this when we host it somewhere else?
socket = io.connect('http://localhost:3000');//io.connect('http://cslab1.bc.edu:8150'); //http://cslab1.bc.edu/~phelpsh/
//socket = io.connect('10.0.0.32:3000'); //change this to switcht the host


//***************socket events --- receiving stuff from the server
//recieved when they go back from class choices
socket.on('chooseMajor',
  function(majorsList){
    console.log("Majors: " + majorsList);
    majorsArray = majorsList;
    view('chooseMajors', majorsList);
  }
);
//recieved when the user gets the list of classes after they select their major
socket.on('receivedClasses',
  function(majorRecord){
    //console.log("classes received! ", majorRecord); //maybe receive a record that has classlist as well as the tree... then we don't have to communicate with the server again...
    globalMajorRecord.name = majorRecord.name;
    globalMajorRecord.classes = majorRecord.classes;
    globalMajorRecord.tree = majorRecord.tree.core;
    globalMajorRecord.electives1000 = majorRecord.tree.electives1000;
    //console.log(globalMajorRecord.electives1000);
    globalMajorRecord.electives2000 = majorRecord.tree.electives2000;
    globalMajorRecord.electives3000 = majorRecord.tree.electives3000;
    globalMajorRecord.descriptions = majorRecord.descriptions;
    console.log(globalMajorRecord.descriptions);
    view('classPick', globalMajorRecord.classes);
  }
);

//*********************************************

//view function that takes a page string that decides which render function to use
function view(page, data){

  //remove all elements from the screen
  let container = document.getElementById('container');
  while(container.firstChild){ //clear the container
    container.removeChild(container.firstChild);
  }

  //determine which "page" to render
  switch (page) {
    case 'chooseMajors': //render the initial page where the user chooses their major
      renderMajorPick(data);
      break;
    case 'classPick': //render the page where the user selects their classes
      renderFrames(data);
      break;
    case 'viewTree': //render the page where the tree appears
      let container = document.getElementById('container');
      let backButton = document.createElement('div');
      backButton.classList.add("otherbutton");
      backButton.innerHTML = 'Back';
      backButton.style.marginLeft = '40%';
      backButton.addEventListener('click', function(event){
        view('classPick', globalMajorRecord.classes);
      });
      backButton.addEventListener('mouseover', function(event){
        backButton.style.background = shadeColor("#8a1a1a", 35);
      });
      backButton.addEventListener('mouseout', function(event){
        backButton.style.background = '#8a1a1a';
      });
      let menu = document.createElement('div');
      container.appendChild(backButton);
      generateTree(globalMajorRecord.tree);
      generateElectives(globalMajorRecord.electives3000);
      generateOffsets(divs);
      generateOffsets(elecDivs);
      connectClasses(globalMajorRecord.tree);
      //unvisit(globalMajorRecord.tree); //have to use the tree field ... not used???
      break;
    default:
      console.log("default... should not see this ever");
      renderMajorPick(majorsArray);
  }
}

//function that takes a list of majors and makes a selector with them
function renderMajorPick(majors){
  let container = document.getElementById('container');
  let menu = document.createElement('div');
  menu.classList.add('menu');
  let span = document.createElement('span');
  span.classList.add("custom-dropdown")
  let select = document.createElement('select');
  //select.classList.add("custom-dropdown");
  span.appendChild(select);
  majors.forEach(function(item){
    let option = document.createElement('option');
    option.value = item;
    option.text = item;
    select.appendChild(option);
  });
  let submit = document.createElement('div');
  submit.classList.add('submitbutton');
  submit.innerHTML = "Submit";
  submit.addEventListener('click', function(event){
    sendMajor(select.value);
  });
  submit.addEventListener('mouseover', function(event){
    submit.style.background = shadeColor("#8a1a1a", 35);
  });

  submit.addEventListener('mouseout', function(event){
    submit.style.background = '#8a1a1a';
  });
  menu.appendChild(span);
  menu.appendChild(submit);
  container.appendChild(menu);
  /*
  container.appendChild(select);
  container.appendChild(submit);*/
}

//function that takes a list of class records and renders them
function renderFrames(classlist){
  let container = document.getElementById('container');
  //renderFrames(model.electives, "Electives");
  //submit
  let submit = document.createElement('div');
  //let submit = document.getElementById('submitbutton');
  submit.classList.add("otherbutton");
  submit.innerHTML = 'Submit';
  submit.addEventListener('click', function(event){ //wait maybe get the tree when you choose your major then you don't have to communicate with the server twice...
    //sendClasses(classlist);
    //console.log(classlist);
    //console.log(globalMajorRecord);
    view('viewTree', globalMajorRecord);
  });

  submit.addEventListener('mouseover', function(event){
    submit.style.background = shadeColor("#8a1a1a", 35);
  });

  submit.addEventListener('mouseout', function(event){
    submit.style.background = '#8a1a1a';
  });

  //back -- sends the user back to the major select page
  let backButton = document.createElement('div');
  backButton.classList.add("otherbutton");
  backButton.innerHTML = 'Back';
  backButton.addEventListener('click', function(event){
    view('chooseMajors', majorsArray);
  });
  backButton.addEventListener('mouseover', function(event){
    backButton.style.background = shadeColor("#8a1a1a", 35);
  });

  backButton.addEventListener('mouseout', function(event){
    backButton.style.background = '#8a1a1a';
  });

  let text = document.createElement('div');
  text.innerHTML = "Select the classes you have taken..."
  text.classList.add("help");
  container.appendChild(text);

  //classpanel -- creates a panel to hold all of the classes
  let classPanel = document.createElement('div');
  classPanel.classList.add("classPanel");
  classlist.forEach(function(item){
    var classButton = document.createElement('div');
    classButton.innerHTML = item.name;
    if(item.taken==1){classButton.classList.add("classFrameTaken");}
    else{classButton.classList.add("classFrame");}

    classButton.addEventListener('click', function (event) { //seems to work now!!!
      updateTaken(classlist, item.name); //make it modular
    });

    classButton.addEventListener('mouseover', function(event){
      if(!item.taken){
        classButton.style.background = shadeColor("#8a1a1a", 35);
        classButton.style.border = 'solid 5px' + shadeColor('#8a1a1a',35);
      }
      else{
        classButton.style.background = shadeColor("#560b0b", 35);
        classButton.style.border = 'solid 5px' + shadeColor('#560b0b',35);
      }
    });

    classButton.addEventListener('mouseout', function(event){
      if(!item.taken){
        classButton.style.background = '#8a1a1a';
        classButton.style.border = 'solid 5px #8a1a1a';
      }
      else{
        classButton.style.background = '#560b0b';
        classButton.style.border = 'solid 5px #560b0b';
      }
    });

    classPanel.appendChild(classButton);
  });
  let buttonMenu = document.createElement('div');
  buttonMenu.classList.add('buttonMenu');
  buttonMenu.style.width = "100%";
  buttonMenu.style.display = "flex";
  buttonMenu.appendChild(backButton);
  buttonMenu.appendChild(submit);
  container.appendChild(buttonMenu);
  container.appendChild(classPanel);
}


//toggles the taken field
function toggle(taken){
  if(taken==1){return 0;}
  return 1;
}

//whenever a classButton is clicked, this function is called to update the classlist and the tree
function updateTaken(model, classname){
  model.forEach(function(item){
    if(item.name == classname){item.taken = toggle(item.taken);}
  });
  markTaken(classname, globalMajorRecord.tree);
  /*model.electives.forEach(function(item){
    if(item.name == classname){item.taken = toggle(item.taken);}
  });*/
  //console.log(globalMajorRecord.tree);
  view('classPick', model);
}

//finds a node in the tree and marks it as taken
function markTaken(classname, node){
  let root = node;
  var q = [];
  q.push(node);
  while(q.length!=0){
    node = q.pop();
    if(node.name == classname){
      if(node.taken == 0){node.taken =1;}
      else{node.taken = 0;}
      //the below part marks the prereqs as taken
      //node.prereqs.forEach(function(item){markTaken(item.name, item);});
    }
    node.prereqs.forEach(function(item){
      q.unshift(item);
    });
  }
  console.log(root);
  globalMajorRecord.tree = root;
}

//not used?
/*function visit(tree){
  let root = tree;
  var q = [];
  q.push(tree);
  while(q.length!=0){
    //console.log("looping");
    tree = q.pop();
    tree.visited = 1;
    tree.prereqs.forEach(function(item){
      q.unshift(item);
    });
  }
  globalMajorRecord.tree = root;
}

//not used?
function unvisit(tree){
  let root = tree;
  var q = [];
  q.push(tree);
  while(q.length!=0){
    tree = q.pop();
    tree.visited = 0;
    tree.prereqs.forEach(function(item){
      q.unshift(item);
    });
  }
  globalMajorRecord.tree = root;
}*/

//used to lighten on mouseover
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

//function to generate the divs for the tree -- takes globalMajorRecord.tree
function generateTree(tree){
  console.log("generating tree...");
  let container = document.getElementById('container');
  let treeHolder = document.createElement('div');
  let level1 = document.createElement('div');
  let level2 = document.createElement('div');
  let level3 = document.createElement('div');
  level1.classList.add('level');
  level2.classList.add('level');
  level3.classList.add('level');
  //level1.style.background = '#292f36';
  //level2.style.background = '#292f36'
  //level3.style.background = '#292f36';
  treeHolder.classList.add('treeHolder');
  container.appendChild(treeHolder);
  let fn = function(node){ //creates a new div to represent the class and pushes it to the correct level
    if(node.taken == 0 && node.name!="Core"){
      //console.log(node.level);
      var item = document.createElement('div');
      item.classList.add("node");
      item.innerHTML = node.name;

      item.addEventListener("click", function(event){
        console.log(node.name);
        //alert("class description");
        renderDescription(node);
      });

      item.addEventListener("mouseover", function(event){
        item.style.background = shadeColor(node.color, 50);
        item.style.border = 'solid 5px ' + shadeColor(node.color, 50);
        //item.style.border = "solid 4px " + shadeColor(node.color, -100);
      });

      item.addEventListener("mouseout", function(event){
        item.style.background = node.color;
        item.style.border = 'solid 5px' + node.color;
        //item.style.border = "solid 4px " + node.color;
        //console.log("back");
      });

      //item.style.background = node.color;
      item.style.background = node.color;
      item.style.color = '#3c4047';
      item.style.border = 'solid 5px ' + node.color;
      //item.style.border = 'solid 4px ' + node.color;
      if(node.level == 1000){level1.appendChild(item);}
      else if(node.level == 2000){level2.appendChild(item);}
      else{level3.appendChild(item);}
      //container.appendChild(item);
      divs.push({name: node.name, div:item, color:node.color});
    }
  }
  var q = [];
  var root = tree;
  var visited = [];
  q.push(tree);
  while(q.length!=0){ //instead, make a list of classes, and every time you visit one check if its name is in this list, if not, add it to this list and render it
    node = q.pop();
    fn(node);
    node.prereqs.forEach(function(item){
      if(!visited.includes(item.name)){ //do if visitedList.contains(item.name)...
        visited.push(item.name);
        //item.visited = 1; //do visitedList.push(item.name);
        //console.log(item.visited);
        q.unshift(item);
      }
    });
    globalMajorRecord.tree = root;
  }
  treeHolder.appendChild(level3);
  treeHolder.appendChild(level2);
  treeHolder.appendChild(level1);
  //console.log(tree);
  //unvisit(tree);
  //console.log(tree);
}

function addElectives(electives){
  elecDivs = [];
  let electivesHolder = document.getElementById('electivesHolder');
  console.log(electivesHolder);
  while(electivesHolder.firstChild){ //clear the container
    electivesHolder.removeChild(electivesHolder.firstChild);
  }
  electives.prereqs.forEach(function(elective){
    let node = document.createElement('div');
    node.classList.add('electiveNode');
    node.innerHTML = elective.name;
    node.style.background = elective.color;
    node.style.border = 'solid 2px ' + elective.color;

    node.addEventListener('click', function(event){
      renderDescription(elective);
    });

    node.addEventListener("mouseover", function(event){
      //console.log(divs);
      node.style.background = shadeColor(elective.color, 50);
      node.style.border = 'solid 2px ' + shadeColor(elective.color, 50);
      elective.prereqs.forEach(function(prereq){
        for(var i = 0; i<divs.length; i++){
          if(divs[i].name == prereq.name){
            //console.log(divs[i].name);
            //divs[i].div.style.background = shadeColor(elective.color, 50);
            //divs[i].div.style.background = '#e83a3a';//shadeColor(elective.color, 50);
            divs[i].div.style.border = 'solid 5px black';
            //div[i].div.style.color = 'white';
          }
          /*else{
            console.log(divs[i].name);
            divs[i].div.style.background = shadeColor(divs[i].color, -30);
          }*/
        }
        for(var j = 0; j<elecDivs.length; j++){
          if(elecDivs[j].name == prereq.name){
            //elecDivs[j].div.style.background = shadeColor(elective.color, 50);
            elecDivs[j].div.style.border ='solid 2px black';
            //elecDivs[j].div.style.color = 'white';
          }
          /*else{
            if(elecDivs[j].name!=elective.name){
              elecDivs[j].div.style.background = shadeColor(elecDivs[j].color, -30);
            }
          }*/
        }
      });
    });

    node.addEventListener("mouseout", function(event){
      console.log("mouseout");
      node.style.background = elective.color;
      elective.prereqs.forEach(function(prereq){
        for(var i = 0; i<divs.length; i++){
            divs[i].div.style.background = divs[i].color;
            divs[i].div.style.border = 'solid 5px ' + divs[i].color;
            //div[i].div.style.color = '#3c4047';
        }
      });
      for(var j = 0; j<elecDivs.length; j++){
        //console.log("hello?");
          //console.log(elecDivs[j].name);
          elecDivs[j].div.style.background = elecDivs[j].color;
          elecDivs[j].div.style.border = 'solid 2px ' + elecDivs[j].color;
          //elecDivs[j].div.style.color = '#3c4047';
      }
    });
    electivesHolder.appendChild(node);
    elecDivs.push({name: elective.name, div:node, color:elective.color});
  });
}

function generateElectives(electives){ //dont draw lines, just light up its prereqs while darkening everything else
  console.log("adding electives...");
  let electivesHolder = document.createElement('div');
  electivesHolder.id = 'electivesHolder';
  electivesHolder.classList.add('electivesHolder');
  //electivesHolder.innerHTML = "ELECTIVES GO HERE";
  let tab1 = document.createElement('div');
  tab1.innerHTML = '1000 Level Electives';
  tab1.classList.add('electiveTab1');
  let tab2 = document.createElement('div');
  tab2.innerHTML = '2000 Level Electives';
  tab2.classList.add('electiveTab2');
  let tab3 = document.createElement('div');
  tab3.innerHTML = '3000 Level Electives';
  tab3.classList.add('electiveTab3');

  tab1.style.background = '#560b0b';
  tab2.style.background = '#560b0b';
  tab3.style.background = '#8a1a1a';

  tab1.addEventListener('click', function(event){
    console.log("tab1");
    tab2.style.background = '#560b0b';
    tab1.style.background = '#8a1a1a';
    tab3.style.background = '#560b0b';
    addElectives(globalMajorRecord.electives1000);
  });
  tab2.addEventListener('click', function(event){
    console.log("tab2");
    tab1.style.background = '#560b0b';
    tab2.style.background = '#8a1a1a';
    tab3.style.background = '#560b0b';
    addElectives(globalMajorRecord.electives2000);
  });
  tab3.addEventListener('click', function(event){
    console.log("tab3");
    tab1.style.background = '#560b0b';
    tab2.style.background = '#560b0b'
    tab3.style.background = '#8a1a1a';
    addElectives(globalMajorRecord.electives3000);
  });

  container.appendChild(tab1);
  container.appendChild(tab2);
  container.appendChild(tab3);
  container.appendChild(electivesHolder);
  addElectives(electives);
}

//finds the position of an element
function getOffset( el ) {
    //console.log(el);
    let rect = el.getBoundingClientRect();
    //console.log("rect:");
    //console.log(rect);
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        width: rect.width || el.offsetWidth,
        height: rect.height || el.offsetHeight
    };
}

//stores the offsets of each div to be used for connecting the classes
function generateOffsets(divs){ //adds offset fields to each div
  divs.forEach(function(item){
    item.off = getOffset(item.div);
    //console.log(item.off);
  });
}

//draws the lines for each div using their offsets
function connectClasses(tree){
  let off1 = null;
  let off2 = null;
  //connects the current node to all of its prereqs
  let fn = function(node){
    if(node.taken == 0 && node.name!="Core" && node.prereqs.length != 0){
      for(let i = 0; i < divs.length; i++){
        if(divs[i].name == node.name){off1 = divs[i].off;}
      }
      //console.log("div1:");
      //console.log(div1);
      //console.log("div2s:")
      //console.log(node.name);
      //console.log(node.prereqs);
      //console.log("-----");
      node.prereqs.forEach(function(item){
        //console.log(item);
        if(item.taken == 0){
          for(let j = 0; j < divs.length; j++){
            if(divs[j].name == item.name){off2 = divs[j].off;}
          }
          //console.log(div2);
          //if(div1 != null && div2 != null){
            //console.log("connecting...");
            connect(off1,off2,item.color,'3');
          //}
        }
      });
    }
  }
  //breadth first traversal of the tree
  var q = [];
  console.log('tree');
  console.log(tree);
  q.push(tree);
  while(q.length!=0){
    node = q.pop();
    fn(node);
    node.prereqs.forEach(function(item){
      //if(item.visited == 0){
        //item.visited = 1;
        q.unshift(item);
      //}
    });
  }
  //unvisit(tree); //reset all the visited nodes -- maybe just do tree.prototype.visited = 0???
}

//draws a line between two offsets
function connect(off1, off2, color, thickness) { // draw a line connecting elements http://stackoverflow.com/questions/8672369/how-to-draw-a-line-between-two-divs
    console.log('connecting');
    let container = document.getElementById('container');
    //var off1 = getOffset(div1);

    //var off2 = getOffset(div2);

    // bottom right
    var x1 = off1.left;
    var y1 = off1.top + off1.height/2;
    // top left
    var x2 = off2.left + off1.width;
    var y2 = off2.top + off2.height/2;

    if(off1.left == off2.left){
      x2 = off2.left + off1.width/2;
      x1 = off1.left + off1.width/2;
      y2 = off2.top;
      y1 = off1.top+off1.height;
    }
    // distance
    var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
    // make hr
    var htmlLine = "<div style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
    //container.innerHTML += htmlLine;
    //document.body.innerHTML += htmlLine;
    container.insertAdjacentHTML('beforeend', htmlLine);
    //container.innterHTML+=htmlLine;
    //console.log('drawn!');
    //var htmlLine = null;
}

//this function should be called when a class node in the tree is clicked
//it should display information about that class and have a button to close it
function renderDescription(node){
  console.log("RENDERING Description");
  let container = document.getElementById('body');
  let desc = document.createElement('div');
  desc.classList.add('description');
  desc.style.background = node.color;
  let nameDiv = document.createElement('div');
  nameDiv.innerHTML = node.name;
  nameDiv.classList.add('nameDiv');
  let codeDiv = document.createElement('div');
  codeDiv.innerHTML = node.code;
  codeDiv.classList.add('codeDiv');
  desc.appendChild(nameDiv);
  desc.appendChild(codeDiv);

  let text = document.createElement('div');
  text.classList.add('text');
  //text.classList.add('codeDiv');
  let d = 'no description available';
  globalMajorRecord.descriptions.forEach(function(item){
    //console.log(node.name + " " + item.name);
    if(item.name == node.name){
      d = item.desc;
      //break;
    }
  });
  text.innerHTML = d;
  desc.appendChild(text);

  let exitButton = document.createElement('div');
  exitButton.innerHTML = 'x';
  exitButton.classList.add('exitButton');
  desc.appendChild(exitButton);

  exitButton.addEventListener('click', function(event){
    container.removeChild(desc);
    container.removeChild(shade);
    //view('viewTree', globalMajorRecord);
  });

  let shade = document.createElement('div');
  shade.classList.add('shade');

  container.appendChild(shade);

  container.appendChild(desc);
}

//***********************************



//sending stuff to the server

//called when the user selects their major and presses the submit button
//emits chooseClasses to the server and just sends the major choice so the server can respond
//server responds with a majorRecord -- a record holding the name of the major, a list of its classes, and a tree of its classes
function sendMajor(choice){
  socket.emit('chooseClasses', choice);
}
