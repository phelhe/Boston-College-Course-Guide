//use express
var express = require('express');
//create app
var app = express();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

// Set up the server
var server = app.listen(3000, listen); //8150 -- phelpsh@cslab1.bc.edu with Eagle ID as pw

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


// WebSocket Portion
var io = require('socket.io')(server);


let colors2 = ["#7AD334", "#88aaff", "#F0A000", "#DAD320", "#dd9999", "#ffaa88", "#ddaacc", "#62f79b", "#ff5151", "#a975ff"];

//list of majors
let majors = ["Computer Science B.A.", "Computer Science B.S.", "Economics"];

//major trees
let csciBSCore = new csciBS();
let csciBACore = new csciBA();
let economicsCore = new econCore();
//****************************

//major classlists
let csciClassesBS = [{name: "Calculus I", taken: 0}, {name: "Computer Science I", taken: 0},{name: "Computer Science II", taken: 0},{name: "Technology and Culture", taken:0},{name: "Calculus II", taken: 0}, {name: "Computer Organization", taken: 0}, {name: "Computer Systems", taken: 0},{name: "Logic and Computation", taken: 0},{name: "Randomness and Computation", taken: 0}, {name: "Linear Algebra", taken:0}, {name: "Computer Architecture", taken:0},{name: "Multivariable Calculus", taken:0},{name: "Algorithms", taken: 0}];
let csciClassesBA = [{name: "Calculus I", taken: 0}, {name: "Computer Science I", taken: 0},{name: "Computer Science II", taken: 0},{name: "Calculus II", taken: 0}, {name: "Computer Organization", taken: 0}, {name: "Computer Systems", taken: 0},{name: "Logic and Computation", taken: 0},{name: "Randomness and Computation", taken: 0}, {name: "Algorithms", taken: 0}];
let econClasses = [{name: "Principles of Microeconomics", taken: 0}, {name: "Principles of Macroeconomics", taken: 0}, {name: "Calculus I", taken: 0},{name: "Economic Statistics", taken: 0},{name: "Econometrics", taken: 0}, {name: "Macroeconomic Theory", taken: 0}, {name: "Microeconomic Theory", taken:0}];
//****************************

let CSCId = new CSCIdescriptions();
let econD = new econDescriptions();

//new itp-networked-media
let computerScienceBA = {name: "Computer Science B.A.", classes: csciClassesBA, tree:csciBACore, descriptions:CSCId};
let computerScienceBS = {name: "Computer Science B.S.", classes: csciClassesBS, tree:csciBSCore, descriptions:CSCId};
let Economics = {name: "Economics", classes: econClasses, tree: economicsCore, descriptions:econD};

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id); //USE THIS SOCKET ID TO EMIT A MESSAGE BACK!!

    //socket.broadcast.to(socket.id).emit('chooseMajor', 'hello');
    io.to(socket.id).emit('chooseMajor', majors);

    //should emit the choosmajor event to the client!!!

    //need to figure out how to submit to just one user

    //should emit chooseMajor to the client
    //should be recieved when the user goes back from the class choice part
    socket.on('chooseMaj',
      function() {
        console.log("choose major page");
        io.to(socket.id).emit('chooseMajor', majors); //send them back to the choose major page
    });

    //should emit displayClasses to the client
    //should be recieved when the user clicks submit on their major
    socket.on('chooseClasses',
      function(major) {
        console.log(socket.id + " chose: " + major);
        switch (major) {
          case "Computer Science B.S.":
            io.to(socket.id).emit('receivedClasses', computerScienceBS);
            break;
          case "Computer Science B.A.":
            io.to(socket.id).emit('receivedClasses', computerScienceBA);
            break;
          case "Economics":
            io.to(socket.id).emit('receivedClasses', Economics);
            break;
          default:

        }
      }
    );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);


//class tree functions

function chooseColor(){
  //console.log("choosing a color...");
  var index = Math.floor(Math.random()*colors2.length);
  var choice = colors2[index];
  //colors.splice(index,1);
  //console.log(choice);
  return choice;
}

function classNode(name, code, prereqs, level){
  this.name = name;
  this.code = code;
  this.prereqs = prereqs;
  this.taken = 0;
  //this.visited = 0;
  this.level = level;
  this.color = chooseColor();
  //colors[Math.floor(Math.random()*colors.length)];
  //'#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

function econCore(){
  this.ECON1131 = new classNode("Principles of Macroeconomics", "ECON1131", [], 1000);
  this.ECON1132 = new classNode("Principles of Microeconomics", "ECON1131", [], 1000);
  this.MATH1100 = new classNode("Calculus I", "MATH1100", [], 1000);
  this.ECON1151 = new classNode("Economic Statistics", "ECON1151", [], 1000);
  this.ECON2201 = new classNode("Microeconomic Theory", "ECON2201", [this.ECON1131, this.MATH1100], 2000);
  this.ECON2202 = new classNode("Macroeconomic Theory", "ECON2202", [this.ECON1132, this.MATH1100], 2000);
  this.ECON2228 = new classNode("Econometrics", "ECON2228", [this.ECON1151, this.MATH1100], 2000);
  this.core = new classNode("Core", "ECON complete", [this.ECON2201, this.ECON2202, this.ECON2228], 3000);
  //electives
  this.electives1000 = new classNode("Electives", "Econ Electives 1000", []);

  this.ECON2206 = new classNode("Real Estate and Urban Action", "ECON2206", []);
  this.ECON2207 = new classNode("The Global Economy", "ECON2207", [this.ECON1131, this.ECON1132]);
  this.ECON2209 = new classNode("Sports Economics", "ECON2209", [this.ECON1131, this.ECON1151]);
  this.ECON2212 = new classNode("Geographic Info Sys for Planning, Decision Making", "ECON2212", []);
  this.ECON2228 = new classNode("Econometric Methods", "ECON2228", [this.ECON1151, this.MATH1100]);
  this.ECON2242 = new classNode("Public Policy in an Aging Society", "ECON2242", [this.ECON1131]);
  this.ECON2230 = new classNode("Economics of Health Care and Social Security", "ECON2230", [this.ECON1131, this.ECON1132]);
  this.ECON2261 = new classNode("Money, Banking, and Financial Markets", "ECON2261", [this.ECON1131, this.ECON1132]);
  this.ECON2277 = new classNode("Environmental Economics and Policy", "ECON2277", [this.ECON1131, this.ECON1132]);
  this.electives2000 = new classNode("Electives", "Econ Electives 2000", [this.ECON2206, this.ECON2207, this.ECON2209, this.ECON2212, this.ECON2228, this.ECON2242,this.ECON2230,this.ECON2261,this.ECON2277]);

  this.ECON3305 = new classNode("Market Design", "ECON3305", [this.ECON2201, this.MATH1100]);
  this.ECON3308 = new classNode("Game Theory in Economics", "ECON3308", [this.ECON2201]);
  this.ECON3312 = new classNode("Evolutionary Economics", "ECON3312", [this.ECON2201, this.ECON2228]);
  this.ECON3315 = new classNode("Economics of Immigration", "ECON3315", [this.ECON2201]);
  this.ECON3317 = new classNode("Economics of Inequality", "ECON3317", [this.ECON2201]);
  this.ECON3327 = new classNode("Financial Econometrics", "ECON3327", [this.ECON2228, this.MATH1100]);
  this.ECON3331 = new classNode("Distributive Justice", "ECON3331", [this.ECON2201, this.MATH1100]);
  this.ECON3340 = new classNode("Labor Economics", "ECON3340", [this.ECON2201]);
  this.ECON3354 = new classNode("Advertising/Media Mkts: Advanced Research Methods", "ECON3354", [this.ECON2201, this.ECON1151, this.ECON2228]);
  this.ECON3356 = new classNode("Industrial Organization for Business Decisions", "ECON3356", [this.ECON2201]);
  this.ECON3361 = new classNode("Monetary Theory and Policy", "ECON3361", [this.ECON2202, this.ECON2228]);
  this.ECON3363 = new classNode("Micro Public Policy Issues", "ECON3363", [this.ECON2201]);
  this.ECON3365 = new classNode("Public Finance", "ECON3365", [this.ECON2201]);
  this.ECON3367 = new classNode("American Economic Policy", "ECON3367", [this.ECON2201, this.ECON2202]);
  this.ECON3371 = new classNode("International Trade", "ECON3371", [this.ECON2201]);
  this.ECON3372 = new classNode("International Finance", "ECON3372", [this.ECON2201]);
  this.ECON3373 = new classNode("Impact Evaluation in Developing Countries", "ECON3373", [this.ECON2201, this.ECON2228]);
  this.ECON3374 = new classNode("Development Economics and Policy", "ECON3374", [this.ECON2201, this.ECON1151]);
  this.ECON3379 = new classNode("Financial Economics", "ECON3379", [this.MATH1100, this.ECON2201, this.ECON1151, this.ECON2228]);
  this.ECON3382 = new classNode("Introduction to Computational Investing", "ECON3382", [this.ECON2201, this.ECON2202, this.ECON2228]);
  this.ECON3384 = new classNode("Prin & Theory of Medical & Health ", "ECON3384", [this.ECON2201, this.ECON2202]);
  this.electives3000 = new classNode("Electives", "Econ Electives 1000", [this.ECON3305, this.ECON3308, this.ECON3312, this.ECON3315, this.ECON3317, this.ECON3327, this.ECON3331, this.ECON3340, this.ECON3354, this.ECON3356, this.ECON3361, this.ECON3363, this.ECON3365, this.ECON3367, this.ECON3371, this.ECON3372, this.ECON3373, this.ECON3373, this.ECON3374, this.ECON3379, this.ECON3382, this.ECON3384]);
}

function csciBA(){ //just has CSCI elective requirements
  this.CSCI1101 = new classNode("Computer Science I", "CSCI1101", [], 1000);
  this.CSCI1102 = new classNode("Computer Science II", "CSCI1102", [this.CSCI1101], 1000);
  this.MATH1100 = new classNode("Calculus I", "MATH1100", [], 1000);
  this.CSCI2272 = new classNode("Computer Organization", "CSCI2272", [this.CSCI1102], 2000);
  this.CSCI2271 = new classNode("Computer Systems", "CSCI2271", [this.CSCI1102], 2000);
  this.CSCI2243 = new classNode("Logic and Computation", "CSCI2243", [this.CSCI1101], 2000);
  this.CSCI2244 = new classNode("Randomness and Computation", "CSCI2244", [this.CSCI1101, this.MATH1100], 2000);
  this.MATH1101 = new classNode("Calculus II", "MATH1101", [this.MATH1100], 2000);
  this.CSCI3383 = new classNode("Algorithms", "CSCI3383", [this.CSCI2243, this.CSCI2244], 3000);
  this.core = new classNode("Core", "CSCIBA complete", [this.CSCI3383, this.MATH1101, this.CSCI2272, this.CSCI2271], 4000);

  //electives1000
  this.CSCI1021 = new classNode("Computers in Management", "CSCI1021", []);
  this.CSCI1074 = new classNode("The Digital World", "CSCI1074", []);
  this.CSCI1075 = new classNode("The Digital World of Robots", "CSCI1075", []);
  this.CSCI1154 = new classNode("Intro to Programming and Web Apps", "CSCI1154", []);
  this.electives1000 = new classNode("Electives", "CS Electives 1000", [this.CSCI1021, this.CSCI1074, this.CSCI1075, this.CSCI1154]);

  //electives2000
  this.CSCI2201 = new classNode("Computer Security", "CSCI2201", []);
  this.CSCI2227 = new classNode("Intro to Scientific Computation", "CSCI2227", [this.MATH1101]);
  this.CSCI2254 = new classNode("Web Application Development", "CSCI2254", [this.CSCI1101]);
  this.CSCI2257 = new classNode("Database Systems and Applications", "CSCI2257", [this.CSCI1101]);
  this.CSCI2258 = new classNode("Systems Analysis and Design", "CSCI2258", [this.CSCI1101]);
  this.CSCI2267 = new classNode("Technology and Culture", "CSCI2267", []);
  this.electives2000 = new classNode("Electives", "CS Electives 2000", [this.CSCI2201, this.CSCI2227, this.CSCI2254, this.CSCI2257, this.CSCI2258,this.CSCI2267]);
  //electives3000
  this.CSCI3333 = new classNode("Computer Graphics", "CSCI3333", [this.CSCI1102]);
  this.CSCI3335 = new classNode("Principles of Multimedia Systems", "CSCI3335", []);
  this.CSCI3341 = new classNode("Artificial Intelligence", "CSCI3341", [this.CSCI1102, this.CSCI2244]);
  this.CSCI3343 = new classNode("Computer Vision", "CSCI3343", [this.CSCI1102, this.CSCI2244]);
  this.CSCI3344 = new classNode("Mobile Application Development", "CSCI3344", [this.CSCI1102]);
  this.CSCI3345 = new classNode("Machine Learning", "CSCI3345", [this.CSCI1101, this.CSCI2244]);
  this.CSCI3346 = new classNode("Data Mining", "CSCI3346", [this.CSCI1102, this.CSCI2244]);
  this.CSCI3347 = new classNode("Robotics", "CSCI3347", [this.CSCI1101]);
  this.CSCI3353 = new classNode("Object Oriented Design", "CSCI3353", [this.CSCI1102]);
  this.CSCI3356 = new classNode("Software Engineering", "CSCI3356", [this.CSCI3353]);
  this.CSCI3357 = new classNode("Database System Implementation", "CSCI3357", [this.CSCI1101]);
  this.CSCI3359 = new classNode("Distributed Systems", "CSCI3359", [this.CSCI1102]);
  this.CSCI3362 = new classNode("Operating Systems", "CSCI3362", [this.CSCI2271]);
  this.CSCI3363 = new classNode("Computer Networks", "CSCI3363", [this.CSCI2271]);
  this.CSCI3366 = new classNode("Principles of Programming Languages", "CSCI3366", [this.CSCI2271]);
  this.CSCI3367 = new classNode("Compilers", "CSCI3367", [this.CSCI2271]);
  this.CSCI3381 = new classNode("Cryptography", "CSCI3381", [this.CSCI2243]);
  this.electives3000 = new classNode("Electives", "CS Electives 3000", [this.CSCI3341,this.CSCI3333, this.CSCI3335, this.CSCI3343, this.CSCI3344, this.CSCI3345, this.CSCI3346, this.CSCI3347, this.CSCI3353, this.CSCI3356, this.CSCI3357, this.CSCI3359, this.CSCI3362, this.CSCI3363, this.CSCI3366, this.CSCI3367, this.CSCI3381]);
}

function csciBS(){ //has math33xx elective requirement as well as CSCI elective requirements and thesis? can do 3397 thesis research in place of 33xx level elective
  this.CSCI1101 = new classNode("Computer Science I", "CSCI1101", [], 1000);
  this.CSCI1102 = new classNode("Computer Science II", "CSCI1102", [this.CSCI1101], 1000);
  this.MATH1100 = new classNode("Calculus I", "MATH1100", [], 1000);
  this.CSCI2267 = new classNode("Technology and Culture", "CSCI2267", [], 3000);
  this.CSCI2272 = new classNode("Computer Organization", "CSCI2272", [this.CSCI1102], 2000);
  this.CSCI2271 = new classNode("Computer Systems", "CSCI2271", [this.CSCI1102], 2000);
  this.CSCI2243 = new classNode("Logic and Computation", "CSCI2243", [this.CSCI1101], 2000);
  this.CSCI2244 = new classNode("Randomness and Computation", "CSCI2244", [this.CSCI1101, this.MATH1100], 2000);
  this.MATH1101 = new classNode("Calculus II", "MATH1101", [this.MATH1100], 2000);
  this.MATH2202 = new classNode("Multivariable Calculus", "MATH2202", [this.MATH1101], 3000);
  this.MATH2210 = new classNode("Linear Algebra", "MATH2210", [], 2000);
  this.CSCI2267 = new classNode("Technology and Culture", "CSCI2267", [], 2000);
  this.CSCI3383 = new classNode("Algorithms", "CSCI3383", [this.CSCI2243, this.CSCI2244], 3000);
  this.CSCI3372 = new classNode("Computer Architecture", "CSCI3372", [this.CSCI2272], 3000);
  this.core = new classNode("Core", "CSCIBA complete", [this.CSCI3383, this.MATH2202, this.MATH2210, this.CSCI3372, this.CSCI2272, this.CSCI2271, this.CSCI2267], 4000);

  //electives1000
  this.CSCI1021 = new classNode("Computers in Management", "CSCI1021", []);
  this.CSCI1074 = new classNode("The Digital World", "CSCI1074", []);
  this.CSCI1075 = new classNode("The Digital World of Robots", "CSCI1075", []);
  this.CSCI1154 = new classNode("Intro to Programming and Web Apps", "CSCI1154", []);
  this.electives1000 = new classNode("Electives", "CS Electives 1000", [this.CSCI1021, this.CSCI1074, this.CSCI1075, this.CSCI1154]);

  //electives2000
  this.CSCI2201 = new classNode("Computer Security", "CSCI2201", []);
  this.CSCI2227 = new classNode("Intro to Scientific Computation", "CSCI2227", [this.MATH1101]);
  this.CSCI2254 = new classNode("Web Application Development", "CSCI2254", [this.CSCI1101]);
  this.CSCI2257 = new classNode("Database Systems and Applications", "CSCI2257", [this.CSCI1101]);
  this.CSCI2258 = new classNode("Systems and Analysis and Design", "CSCI2258", [this.CSCI1101]);
  this.electives2000 = new classNode("Electives", "CS Electives 2000", [this.CSCI2201, this.CSCI2227, this.CSCI2254, this.CSCI2257, this.CSCI2258]);

  //electives 3000
  this.CSCI3333 = new classNode("Computer Graphics", "CSCI3333", [this.CSCI1102]);
  this.CSCI3335 = new classNode("Principles of Multimedia Systems", "CSCI3335", []);
  this.CSCI3341 = new classNode("Artificial Intelligence", "CSCI3341", [this.CSCI1102, this.CSCI2244]);
  this.CSCI3343 = new classNode("Computer Vision", "CSCI3343", [this.CSCI1102, this.CSCI2244]);
  this.CSCI3344 = new classNode("Mobile Application Development", "CSCI3344", [this.CSCI1102]);
  this.CSCI3345 = new classNode("Machine Learning", "CSCI3345", [this.CSCI1101, this.CSCI2244]);
  this.CSCI3346 = new classNode("Data Mining", "CSCI3346", [this.CSCI1102, this.CSCI2244]);
  this.CSCI3347 = new classNode("Robotics", "CSCI3347", [this.CSCI1101]);
  this.CSCI3353 = new classNode("Object Oriented Design", "CSCI3353", [this.CSCI1102]);
  this.CSCI3356 = new classNode("Software Engineering", "CSCI3356", [this.CSCI3353]);
  this.CSCI3357 = new classNode("Database System Implementation", "CSCI3357", [this.CSCI1101]);
  this.CSCI3359 = new classNode("Distributed Systems", "CSCI3359", [this.CSCI1102]);
  this.CSCI3362 = new classNode("Operating Systems", "CSCI3362", [this.CSCI2271]);
  this.CSCI3363 = new classNode("Computer Networks", "CSCI3363", [this.CSCI2271]);
  this.CSCI3366 = new classNode("Principles of Programming Languages", "CSCI3366", [this.CSCI2271]);
  this.CSCI3367 = new classNode("Compilers", "CSCI3367", [this.CSCI2271]);
  this.CSCI3381 = new classNode("Cryptography", "CSCI3381", [this.CSCI2243]);
  this.electives3000 = new classNode("Electives", "CS Electives", [this.CSCI3341,this.CSCI3333, this.CSCI3335, this.CSCI3343, this.CSCI3344, this.CSCI3345, this.CSCI3346, this.CSCI3347, this.CSCI3353, this.CSCI3356, this.CSCI3357, this.CSCI3359, this.CSCI3362, this.CSCI3363, this.CSCI3366, this.CSCI3367, this.CSCI3381]);
}


function CSCIdescriptions(){
  return [
  //core
  {
    name: "Computer Science I",
    code: "CSCI1101",
    desc: " This course is an introduction to the art and science of computer programming and to some of the fundamental concepts of computer science. Students will write programs in the Python programming language. Good program design methodology will be stressed throughout. There will also be a study of some of the basic notions of computer science, including computer systems organization, files and some algorithms of fundamental importance."
  },

  {
    name: "Computer Science II",
    code: "CSCI1102",
    desc:"  In this course the student will write programs that employ more sophisticated and efficient means of representing and manipulating information. Part of the course is devoted to a continued study of programming. The principal emphasis, however, is on the study of the fundamental data structures of computer science (lists, stacks, queues, trees, etc.). Both their abstract properties and their implementations in computer programs and the study of the fundamental algorithms for manipulating these structures. Students will use Java for programming."
  },

  {
    name: "Logic and Computation",
    code: "CSCI2243",
    desc: " A course in the mathematical foundations of Computer Science, illustrated throughout with applications such as sets and functions, propositional and predicate logic, induction and recursion, basic number theory and mathematical models of computation such as formal languages, finite state machines, and Turing machines."
  },

  {
    name: "Randomness and Computation",
    code: "CSCI 2244",
    desc: " This course presents the mathematical and computational tools needed to solve problems that involve randomness. For example, an understanding of random variables allows us to efficiently generate the enormous prime numbers needed for information security, and to quantify the expected performance of a machine learning algorithm beyond a small data sample. An understanding of covariance allows high quality compression of audio and video. Topics include combinatorics and counting, random experiments and probability, random variables and distributions, computational modeling of randomness, Bayes' rule, laws of large numbers, vectors and matrices, covariance and principal axes, and Markov chains."
  },

  {
    name: "Computer Systems",
    code: "CSCI2271",
    desc: " This course is concerned with machine-level program and data representation on modern computer systems and on some of the trade-offs that must be considered when selecting one representation (or programming paradigm) over another. We consider how various representations can affect the efficiency, reliability, and security of computing systems. This is a hands-on course; programming will be comped in the procedural language C with comparisons to object-oriented languages such as Java."
  },

  {
    name: "Computer Organization",
    code: "CSCI2272",
    desc: " This course studies the internal organization of computers and the processing of machine instructions. Topics include computer representation of numbers, combinational circuit design (decoders, multiplexers), sequential circuit design and analysis, memory design (registers and main memory), and simple processors including datapaths, instruction formats, and control units. In the laboratory-based portion of course students design and build digital circuits related to lecture. Exercises include hardware description languages, combinational and sequential circuits, arithmetic and logic units, and simple datapath and control units."
  },

  {
    name: "Algorithms",
    code: "CSCI3383",
    desc: " This course is a study of algorithms for, among other things, sorting, searching, pattern matching, and manipulation of graphs and trees. Emphasis is placed on the mathematical analysis of the time and memory requirements of such algorithms and on general techniques for improving their performance."
  },

  {
    name: "Computer Architecture",
    code: "CSCI3372",
    desc: "In this course we investigate how computer hardware works and considerations for design of a computer. Topics include instruction programming and control, computer arithmetic, processor design, pipelining, memory hierarchy, input/output, and advanced architecture topics. CSCI 3373 is a laboratory-based study of computer hardware in which students design and build digital circuits related to the topics in CSCI 3372. Topics include hardware description languages, combinational and sequential circuits, arithmetic and logic units, input/output circuits, data paths, control, pipelining, and system design."
  },

  {
    name: "Calculus I",
    code: "MATH1100",
    desc: " MATH1100 is a first course in the calculus of one variable intended for biology, computer science, economics, management, and premedical students. It is open to others who are qualified and desire a more rigorous mathematics course at the core level. Topics include a brief review of polynomials and trigonometric, exponential, and logarithmic functions, followed by discussion of limits, derivatives, and applications of differential calculus to real-world problem areas. The course concludes with an introduction to integration."
  },

  {
    name: "Calculus II",
    code: "MATH1101",
    desc: " MATH1101 is a second course in the calculus of one variable intended for biology, computer science, economics, management, and premedical students. It is open to others who are qualified and desire a more rigorous mathematics course at the core level. Topics include an overview of integration, basic techniques for integration, a variety of applications of integration, and an introduction to (systems of) differential equations."
  },

  {
    name: "Linear Algebra",
    code: "MATH2210",
    desc: " This course is an introduction to the techniques of linear algebra in Euclidean space. Topics covered include matrices, determinants, systems of linear equations, vectors in n-dimensional space, complex numbers, and eigenvalues. The course is required of mathematics majors but is also suitable for students in the social sciences, natural sciences, and management."
  },

  {
    name: "Multivariable Calculus",
    code: "MATH2202",
    desc: " Topics in this course include vectors in two and three dimensions, analytic geometry of three dimensions, parametric curves, partial derivatives, the gradient, optimization in several variables, multiple integration with change of variables across different coordinate systems, line integrals, and Green's Theorem."
  },

  // electives
  {
    name: "Intro to Scientific Computation",
    code: "CSCI2227",
    desc: "This is an introductory course in computer programming for students interested numerical and scientific computation. Emphasis will be placed on problems drawn from the sciences. Many problems, such as the behavior of complex physical systems, have no closed-form solution, and computational modeling is needed to obtain an approximate solution. The course discusses different approximation methods, how to implement them as computer programs, and the factors that determine the accuracy. Topics include solutions of nonlinear equations, numerical integration, solving systems of linear equations, error optimization, and data visualization. Students will write programs in the MATLAB or Python programming language."
  },

  {
    name: "Computers in Management",
    code: "CSCI1021",
    desc: "Information systems play a vital and varying role in management. This course approaches the subject in two ways. In one module students learn to use technology as a tool for solving business problems, by developing increasingly sophisticated models in Excel. The other module provides an introduction to management viewed through the lens of technology. Students examine the role of technology in promoting innovation and organizational competitiveness across a variety of functional areas of the firm (e.g., marketing, finance, operations)."
  },

  {
    name: "The Digital World",
    code: "CSCI1074",
    desc: "This course is an introductory-level survey of computer science for non-majors. Students study the historical and intellectual sources of the discipline, examine important problems and the techniques used to solve them, and consider their social impact. Example problems include the representation of information (such as text, images, audio and video), how computer hardware and networks work, computer vision, machine learning, and cryptography. In order to enhance their understanding of these topics, students will also be given a gentle introduction to computer programming."
  },

  {
    name: "The Digital World of Robots",
    code: "CSCI1075",
    desc: "This course is a gentle introduction to computer programming for non-majors. Students will learn about computers and computer software by working with a small personal robot. Students will learn the Python programming language, and write Python programs to control their robot's behavior, explore its environment, and perform various tasks. As we get our robots to do more and more, we learn how software is designed and written to solve real problems."
  },

  {
    name: "Intro to Programming and Web Apps",
    code: "CSCI1154",
    desc: "In this course, students create interactive web-based applications. We begin by learning how to use HTML and CSS to create simple web pages. Topics include basic databases, SQL queries, and client-side scripts. Sample projects may include shopping-cart based sales, student registration systems, etc. The course is currently taught using JavaScript and MySQL. No prior programming experience is required."
  },

  {
    name: "Web Application Development",
    code: "CSCI2254",
    desc: "In this course, students create interactive web-based applications. We begin by learning how to use HTML and CSS to create simple web pages. Emphasis then shifts to creating pages that access databases over the web. Topics include basic database design, SQL queries, and client and server-side scripts. Sample projects may include shopping-cart based sales, student registration systems, etc. The course is currently taught using JavaScript and MySQL. Programming experience required."
  },

  {
    name: "Systems Analysis and Design",
    code: "CSCI2258",
    desc: "This course studies the process of information systems development including requirements, analysis, design and implementation phases and workflows. You will learn about major methods and tools used in the systems development process. We also investigate how systems analysts serve as intermediaries between users, managers, and implementers, helping each to understand the needs and problems of others."
  },

  {
    name: "Distributed Systems",
    code: "CSCI3359",
    desc: " Students will learn the major paradigms of distributed computing including client-server and peer-to-peer models. Topics studied in these models include communication, synchronization, performance, fault-tolerance and security. Students will learn how to analyze the correctness of distributed protocols and will be required to build distributed applications."
  },

  {
    name: "Machine Learning",
    code: "CSCI3345",
    desc: "This course provides an introduction to computational mechanisms that improve their performance based on experience. Machine learning can be used in engineered systems for a wide variety of tasks in personalized information filtering, health care, security, games, computer vision, and human-computer interaction, and can provide computational models of information processing in biological systems. Supervised, unsupervised, and reinforcement learning will be discussed, including sample applications, as well as specific learning paradigms such as decision trees, instance-based learning, neural networks and deep learning, Bayesian approaches, meta-learning, clustering, and Q learning. General concepts to be described include feature space representations, inductive bias, overfitting, and fundamental tradeoffs."
  },

  {
    name: "Topics in Computer Science",
    code: "CSCI3390",
    desc: " Everyone should know how to think Parallel. Even a laptop or cellphone has multiple CPU cores at our disposal these days. In this hands-on, project oriented class you will learn the main ideas of parallel computing with GPU. Our focus will be on the CUDA programming language. You will learn about GPU architectures, about parallel algorithms, CUDA libraries and GPU computing applications. The prerequisite for this class are C programming language, multivariate calculus, linear algebra and algorithms and randomness and computation. If you do not have all of these prerequisites and want to take the class, please talk with me. There is a limited number of spots available."
  },

  {
    name: "Technology and Culture",
    code: "CSCI2267",
    desc: " This interdisciplinary course will first investigate the social, political, psychological, ethical, and spiritual aspects of the Western cultural development with a special emphasis on scientific and technological metaphors and narratives. We will then focus on the contemporary world, examining the impact of our various technological creations on cultural directions, democratic process, the world of work, quality of life, and especially on the emergent meanings for the terms citizen and ethics in contemporary society. Students will explore technologies in four broad and interrelated domains: (1) computer, media, communications, and information technologies, (2) biotechnology, (3) globalization, and (4) environmental issues."
  },

  {
    name: "Database Systems and Applications",
    code: "CSCI2257",
    desc: " This course provides in-depth coverage of database systems and their uses. Topics include database architecture, design strategies, SQL queries, security, performance, and using database tools and scripting languages to create sophisticated forms and applications, including web applications. The goal of the course is to give students the knowledge and skills to use databases effectively in any business situation."
  },

  {
    name: "Computer Security",
    code: "CSCI2201",
    desc: " In a world of ever-increasing dependence on technology, news stories about data breaches and other types of cyber attacks seem to happen on a daily basis. These breaches have real consequences that can cost a company millions of dollars and damage to its reputation. Today's business system managers need to understand these threats and know how to protect their digital assets. This course provides a strong starting foundation for understanding the complex threats system managers face today and what they need to do to harden their systems against attack. Students in this course will look at computer security through a variety of lenses. Specific topics will include: the drivers for information security, how hackers hack, how to build a security plan for your organization, how to protect the physical infrastructure, tools used by security professionals, system design considerations, and the various laws, regulations and standards related to information security."
  },

  {
    name: "Artificial Intelligence",
    code: "CSCI3341",
    desc: " This course covers the basic ideas developed in computer science to model an intelligent agent. We will discuss perception and action, knowledge and reasoning, learning and planning. Topics include: adversarial search, computational game theory, logical inference, Bayesian inference, Hidden Markov Models, and various clustering and classification algorithms."
  },

  {
    name: "Computer Graphics",
    code: "CSCI3333",
    desc: "This course introduces algorithms and techniques involved in representing, animating, and interacting with three-dimensional objects on a computer screen. The course will involve significant programming in Java and OpenGL."
  },

  {
    name: "Computer Vision",
    code: "CSCI3343",
    desc: "Computers are gaining abilities to “see” things just like our vision system. Face recognition has been embedded in almost all the digital cameras. Car detection and tracking have been used in self-driving vehicles. Modern search engines are not only able to find similar text patterns but also able to search for similar objects in huge image databases. This course introduces principles and computational methods of obtaining information from images and videos. Topics include image processing, shape analysis, image matching, segmentation, 3D projective geometry, object tracking, human pose and action, image retrieval, and object recognition."
  },

  {
    name: "Data Mining",
    code: "CSCI3346",
    desc: "The goal of data mining is to discover patterns in data that are informative and useful. This course provides an overview of the field of knowledge discovery and data mining, which deals with the semi-automated analysis of large collections of data that arise in contexts ranging from medical informatics and bioinformatics to e-commerce and security. The course will cover fundamental data mining tasks, relevant concepts and techniques from machine learning and statistics and data mining applications to real-world domains such as e-mail filtering, gene expression, analysis of biomedical signals, and fraud detection."
  },

  {
    name: "Robotics",
    code: "CSCI3347",
    desc: "This is a hands-on laboratory course about the programming of robots. Topics covered include locomotion, steering, moving an “arm” and “hand,” dealing with sensory input, voice synthesis, and planning. Students will complete several projects using the robots in the Boston College Robotics Laboratory."
  },

  {
    name: "Object Oriented Design",
    code: "CSCI3353",
    desc: "CSCI 1102 introduced you to the basic concepts of object-oriented programming: classes, inheritance, and polymorphism. In this course, we look at object-oriented programming from a higher level, and focus on the design of object-oriented software. As an analogy, consider a list—it is a lot easier to understand its operations by drawing pictures than by looking at code. Similarly, you will learn how to draw pictures to describe the design of an object-oriented program. And from these pictures we can develop design rules, such as separate the model from the view and program to interfaces. We will also go over fundamental design patterns that give us a simple way to talk about complex interactions of classes. Another analogy is the difference between an architect and a building contractor. An architect designs the building, and is responsible for its usability, aesthetics, and feasibility. The contractor follows the plan, making low-level decisions about each component. Both are professionals, but the architect gets to be more creative and is often more highly valued. This course teaches you how to be a software architect. Homework assignments will involve the design of inter-related classes and their implementation in Java."
  },

  {
    name: "Operating Systems",
    code: "CSCI3362",
    desc: " This course will provide a broad introduction to software systems with emphasis on operating system design and implementation. Its objective is to introduce students to operating systems with main focus on resource management and interfacing issues with hardware layers. Particular emphasis will be given to process management (processes, threads, CPU scheduling, synchronization, and deadlock), (virtual) memory management (segmentation, paging, swapping, caching) with focus on the interplay between architectural components and software layers. If there is time, we will investigate and discuss these same issues for distributed systems. The course programming assignments will be in Java/C."
  },

  {
    name: "Software Engineering",
    code: "CSCI3356",
    desc: "This course covers industrial system development using object-oriented techniques. Students will learn a methodical approach to the development of software and will use this methodology to design, implement, test and evolve Java applications. Students will work in teams to develop applications, experiencing the different roles that are required on projects in industry."
  },

  {
    name: "Database System Implementation",
    code: "CSCI3357",
    desc: "A database system is an amazingly sophisticated piece of software. It contains (1) a language interpreter, for processing user queries; (2) query rewrite strategies, for transforming inefficient queries into more efficient ones; (3) complex algorithms for indexing data, to support fast access; (4) a separate file system from that of the operating system, for managing the disk efficiently; (5) recovery mechanisms, for ensuring database integrity when the system crashes; and (6) an ability to handle concurrent accesses from multiple users. In this course we examine the various algorithms, data structures, and techniques for implementing these features. And to make these theoretical ideas concrete, we will also examine the Java source code for a real-life database system – first to see how it works, and then to write our own additions and improvements to it. The goals of this course go beyond the study of database systems principles. The algorithms you learn can be used in many other systems and applications. And you get to see how a large software system is structured. The course requires extensive Java programming. You do not need experience using a commercial database system; you will learn all necessary database concepts during the course."
  },

  {
    name: "Principles of Programming Languages",
    code: "CSCI3366",
    desc: "Starting with a simple language of expressions, this course develops a sequence of progressively more expressive programming languages keeping in mind the conflicting constraints between the expressiveness of the language and the requirement that it be reliably and efficiently implemented. The course focuses on these essential concepts and the run-time behavior of programs. Type systems play an essential role. By understanding the concepts the student will be able to evaluate the advantages and disadvantages of a language for a given application."
  },

  {
    name: "Compilers",
    code: "CSCI3367",
    desc: "Compilers are programs that implement high level programming languages by translating programs in such languages into machine code or some other easy to process representation. This course deals with the principles and techniques used in the design of compilers. Topics include parsing, static analysis, translation, memory management, and code optimization. This course includes a significant programming project."
  },

  {
    name: "Cryptography",
    code: "CSCI3381",
    desc: "When you log onto a secure web site, for example to pay a bill from your bank account, you need to be assured of certain things: Is your communication private? An eavesdropper should not be able to determine what information you and the bank are exchanging. Does the website you are communicating with really belong to the bank? A third party should not be able to successfully impersonate the bank. Are you you? A third party should not be able to impersonate you and make payments from your account. Are the messages you and the bank receive from each other the same ones that were sent? No one should be able to alter the messages in transit without this being detected. Behind the scenes, an extraordinary series of computations takes place to ensure that these security requirements are met. This course some sophisticated ideas from both mathematics and computer science that make it all work. We will begin the course with a look at some classical cryptographic systems that were in use before the advent of computers, then study modern block ciphers, both the general principles behind their construction and use, and some details about widely-used systems: the Data Encryption Standard (DES) and Advanced Encryption Standard (AES). These are symmetric systems in which the parties share some secret information (a key) used for both encryption and decryption. Cryptography was profoundly changed by the invention, in the late 1970's, of asymmetric, or public-key cryptosystems, in which the two parties do not need to share a secret in order to communicate securely. We will study public-key cryptosystems like RSA, cryptographic hash functions, schemes for digital signatures, and zero-knowledge identification schemes. We'll finish the course looking at some real-world cryptographic protocols (for example, SSL), more speculative protocols (electronic elections or digital cash), and some different ideas for the construction of cryptosystems (quantum cryptography)."
  },

  {
    name: "Mobile Application Development",
    code: "CSCI3344",
    desc: "This is a project-oriented course focusing on the development of applications for smart phones and tablets. The course is currently taught using Google’s Android platform. The course will focus on software and user interface design, emphasizing best practices. The course examines issues arising from the unique characteristics of mobile input devices including touch and gesture input, access to a microphone, camera, and orientation and location awareness. We will also explore engineering aspects of targeting small memory platforms and small screens. Students will be required to design and develop substantial projects by the end of the course."
  },

  {
    name: "Principles of Multimedia Systems",
    code: "CSCI3335",
    desc: "This course introduces principles and current technologies of multimedia systems. Topics include multimedia systems design, multimedia hardware and software, issues in effectively representing, processing, and transmitting multimedia data including text, graphics, sound and music, image, and video. Image, video, and audio standards such as JPEG, MPEG, H.26x, Dolby Digital, and AAC will be reviewed. Applications such as video conferencing, video streaming, multimedia data indexing, and retrieval will also be introduced."
  },

  {
    name: "Computer Networks",
    code: "CSCI3363",
    desc: " This course studies computer networks and the services built on top of them. Topics include packet-switch and multi-access networks, routing and flow control, congestion control and quality-of-service, resource sharing, Internet protocols (IP, TCP, BGP), the client-server model and RPC, elements of distributed systems (naming, security, caching, consistency) and the design of network services (peer-to-peer networks, file and web servers, content distribution networks). Coursework involves a significant amount of Java/C programming."
  }];
}


function econDescriptions(){
return [{
  name: "Principles of Macroeconomics",
  code:'ECON1132',
  desc:'Open to freshmen, sophomores and juniors. Course is open to seniors by department permission.This course is an analysis of national income and employment, economic fluctuations, monetary and fiscal policy, inflation, growth, and international aspects of macroeconomic policy. This course is an analysis of prices, output, and income distribution through the interaction of households and business firms in a modern Western economy. The appropriate role of government intervention is examined, and basic analytical tools are applied to current economic problems. Open to freshmen, sophomores and juniors. Course is open to seniors by department permission. Satisfies Core requirement for: Social Science'
},
{
  name:"Principles of Microeconomics",
  code:'ECON1132',
  desc:'This course is an analysis of prices, output, and income distribution through the interaction of households and business firms in a modern Western economy. The appropriate role of government intervention is examined, and basic analytical tools are applied to current economic problems. Open to freshmen, sophomores and juniors. Course is open to seniors by department permission. Satisfies Core requirement for: Social Science'
},
{
  name:"Calculus I",
  code:'MATH1100',
  desc:"MATH 1100 is a first course in the calculus of one variable intended for biology, computer science, economics, management, and premedical students. It is open to others who are qualified and desire a more rigorous mathematics course at the core level. Topics include a brief review of polynomials, trigonometric, exponential, and logarithmic functions, followed by discussion of limits, derivatives, and applications of differential calculus to real-world problem areas. An introduction to integration concludes the course."
},
{
  name:"Economic Statistics",
  code:'ECON1151',
  desc:'This course is focused on probability, random variables, sampling distributions, estimation of parameters, tests of hypotheses, regression, and forecasting.'
},
{
  name:"Microeconomic Theory",
  code:'ECON2201',
  desc:'This course develops a theoretical framework with which to analyze consumer and producer behavior. This analysis is then employed to investigate the determination of prices and output in various market situations, the implications for welfare, and the appropriate role for government intervention.'
},
{
  name:"Macroeconomic Theory",
  code:'ECON2202',
  desc:'This course is intended to equip the student for the analysis of the determination of employment and national income. Emphasis will be placed on the Keynesian theory of employment, interest, and money and on post-Keynesian macroeconomic models.'
},
{
  name:"Econometrics",
  code:'ECON2228',
  desc:'This course focuses on testing the predictions of economic theory. Topics covered include simple and multiple regression, multicollinearity, heteroskedasticity, serial correlation, specification errors, errors in variables, and an introduction to simultaneous equation estimation.'
},
{
  name:"Market Design",
  code:'ECON3305',
  desc:'This is an introductory-level course on market design. It aims to provide students with fundamental concepts of matching and allocation problems without money as well as auctions. The focus of the course is both introducing students to the market design theory as well as exploring real-life applications such on-campus housing, school choice, kidney exchange, search engine auctions, and spectrum auctions. Some knowledge of statistics and calculus is required for the theoretical part. Students will be required to write a final paper and do an in-class presentation.'
},
{
  name:"Game Theory in Economics",
  code:'ECON3308',
  desc:'This course is an introduction to game theory. Game theory consists of a coherent set of concepts and analytical tools to examine interactive or strategic situations between people, that is, situations where the well being of one actor depends not only what s/he does but also on what others do. Hence in deciding how best to act, each person needs to consider how others are likely to act as well. Game theory has become a widely used tool of analysis in a wide range of disciplines, including economics, business, political science, law and international relations.'
},
{
  name:"Evolutionary Economics",
  code:'ECON3312',
  desc:'This course uses evolutionary biology to better understand the psychology of preferences, a central concept in economics. Why are people risk averse? Impatient? What explains novelty seeking, habits, addictions? What makes parents provide for children? We will use evolutionary thinking to explore these and a host of other diverse topics: violence, adolescent risk taking, sexual behavior, mating preferences, marriage and divorce, rearing and investing in children, extended families, trade and specialization, cooperation and conflict, cults and gangs, religion, and interactions between genetic and cultural forces. This course has an intensive research and writing requirement and enrollment is limited. You should be comfortable using stata. Prerequisites: Micro theory and econometrics.'
},
{
  name:"Economics of Immigration",
  code:'ECON3315',
  desc:'This course is an upper level elective. A basic understanding of statistics and econometrics will be helpful, but is not required. This course will examine the economic decisions of migrants and their impacts on both destination and origin economies. It will emphasize the effect of immigration on wage distribution, labor market efficiency, and innovation, and will consider current public policy issues such as border control, visa allocation, and refugee admission.'
},
{
  name:"Economics of Inequality",
  code:'ECON3317',
  desc:"The course will provide both a theoretical and empirical analysis of economic inequality. This will include analysis and discussion of recent trends in inequality and an examination of the economic causes and consequences of inequality. Specific attention will be paid to the difference between inequality of economic outcomes (e.g., employment status, earnings, and occupation) and inequality of economic opportunity. The course will also touch on economic policy, including discussions of programs designed to combat inequality of outcomes, like welfare and food stamps, as well as those designed to combat inequality of opportunity, like Head Start."
},
{
  name:"Financial Econometrics",
  code:'ECON3327',
  desc:'This course extends ECON2228 to present panel data models, selected topics in time series analysis, and limited dependent variable models. Methods used in financial econometrics, such as rolling CAPM estimation, volatility estimation and event studies will be stressed. Examples and datasets are drawn from financial economics.'
},
{
  name:"Distributive Justice",
  code:'ECON3331',
  desc:'The course will analyze modern analysis of justice and fairness. We will discuss bargaining situations and social choice questions. Part of the course will be devoted to the recent experimental literature regarding fairness. Limited enrollment (12). Significant writing/research component. This course requires a strong conceptual understanding of Micro Theory.'
},
{
  name:"Labor Economics",
  code:'ECON3340',
  desc:'This course will introduce students to the methodology of labor economics from both institutional and neoclassical perspectives. The principal emphasis will be on neoclassical theory and empirical work dealing with the supply and demand for labor; the operation of the labor market; the determination of wages; and the impact of trade unions and collective bargaining. Special emphasis will be placed on applications of theory and empirical findings to policy questions.'
},
{
  name:"Advertising/Media Mkts: Advanced Research Methods",
  code:'ECON3354',
  desc:'This course develops advanced research methods to study the advertising and media markets. The goal of the course is to provide hands-on experience with advanced research methods, including the ability to analyze and critique previous research and to identify important research questions. The course is designed primarily for junior economics majors who are interested in writing a senior thesis, or for junior and senior economics majors anticipating quantitative work in economics or marketing after graduation. Methods that are taught include theoretical tools from industrial organization, such as game theoretic models of imperfect competition, pricing, and entry, as well as statistical and empirical methods of analysis using data on advertising and media programming choices. Questions addressed in the course include the following: What is the impact of advertising on product markets? How do advertisers compete for air time, both across and within industries?'
},
{
  name:"Industrial Organization for Business Decisions",
  code:'ECON3356',
  desc:'We study the behavior of firms and the structure of industries, applying game theory to understand the strategic interaction of firms when the assumptions of perfect competition break down. The course combines theoretical micro-economic analyses with studies of actual firm behavior in individual industries. Topics include pricing, game theory, collusion, outsourcing, auctions, and adverse selection. The course will incorporate insights from developments in behavioral economics and consider regulation for consumer protection.'
},
{
  name:"Monetary Theory and Policy",
  code:'ECON3361',
  desc:'An analysis of the operation and behavior of financial markets and financial institutions. Emphasis is placed on financial intermediaries, including commercial banks and the central bank. The money supply process and alternative theories of the demand for money are considered, as well as their implications for monetary policy and macroeconomic performance.'
},
{
  name: "Micro Public Policy Issues",
  code:'ECON3363',
  desc:"This is a course in the microeconomics of the public sector. We will discuss the rationale for the government's role in a market economy, major expenditure programs, and the theory and structure of the tax system. The focus will be on the federal (as opposed to state and local) government's expenditure and tax programs, with special attention given to topics of current concern."
},
{
  name:"Public Finance",
  code:'ECON3365',
  desc:"This is a course in the microeconomics of the public sector. We will discuss the rationale for the government's role in a market economy, major expenditure programs, and the theory and structure of the tax system. The focus will be on the federal (as opposed to state and local) government's expenditure and tax programs, with special attention given to topics of current concern."
},
{
  name:"American Economic Policy",
  code:'ECON3367',
  desc:"This course allows students the opportunity to apply macroeconomic and microeconomic techniques and models to issues of current importance. Although the choice of topics is based on the interests of the students present, typically the course covers the economic effects of immigration, changes in the minimum wage, negative interest rate policies, fiscal challenges of the federal government, Social Security reform, income inequality, and trade."
},
{
  name:"International Trade",
  code:'ECON3371',
  desc:"This course is an analysis of the foundations of trade and the principle of comparative advantage leading to a sophisticated study of protectionism. Current U.S. protectionist issues will be illuminated, as well as economic warfare, control of international factor movements, and interaction of trade and economic development."
},
{
  name:"International Finance",
  code:'ECON3372',
  desc:"International financial markets, international trade and balance of payments issues will be studied by using analytical models of the open economy. Topics of particular interests are exchange rate determination, capital flows, trade flows, and other international linkages between economies. The course will apply the analytical tools of international economics to address macroeconomic aspects of current policy issues such as the global impact of the financial crisis, exchange rate policy, sovereign debt crises, and persistent trade deficits and international indebtedness."
},
{
  name:"Impact Evaluation in Developing Countries",
  code:'ECON3373',
  desc:"This course reviews advanced econometric techniques and research designs used to estimate the causal effect of programs or policies implemented in developing countries. Fixed effects, difference-in-difference, instrumental variable, and propensity score methods are discussed as are regression discontinuity, natural experiment, and randomized experiment designs. The economic rationale for such programs is also addressed. Topic areas include health, education, service delivery, insurance, and micro-finance."
},
{
  name:"Development Economics and Policy",
  code:'ECON3374',
  desc:"This course examines development economics and development policy. The purpose is to understand the lives of the poor and the economies of poor countries in order to decipher what?if anything?can be done to improve their lives. We will consider what might be holding the poor back including population growth, lack of education, poor health, corruption, and institutional impediments. We will examine different empirical methods to evaluate the effects of a policy or program, and what we do, and do not, know about poverty. Students will write a paper which considers the research and economic reasoning for a particular program to help the poor by a government giving foreign aid, a developing country government, or an NGO. This course is appropriate for economics majors as well as for majors in international studies with the appropriate prerequisites. Satisfies Core requirement for: Cultural Diversity"
},
{
  name:"Financial Economics",
  code:'ECON3379',
  desc:"This undergraduate elective focuses on financial economics, with specific emphasis on asset pricing and the valuation of risky cash flows. After developing and studying the details of consumer decision-making under uncertainty, it uses that general framework as a basis for understanding both equilibrium and no-arbitrage theories of securities pricing, including the capital asset pricing model (CAPM), the consumption capital asset pricing model (CCAPM), Arrow-Debreu theories, martingale pricing methods, and the arbitrage pricing theory (APT)."
},
{
  name:"Introduction to Computational Investing",
  code:'ECON3382',
  desc:"In this course, students develop skills automate an investment strategy. The first third of the course covers programming skills (Python), market structure, and portfolio evaluation. The second third covers optimization and commonly used strategies. In the final third, we cross-evaluate student projects and discuss theory behind applications. Students work on a group project after the first third of the course. By the end of the course, successful students are able to write and evaluate fully functional programs on an online trading platform. Please show up in class if you are interested but cannot register or do not meet the requirements. Traditionally, all interested students have been able to eventually register. This is not a course that promotes quantitative investing. It is an immersion to acquire the universally useful skills required to automate investments. The lab session is mandatory. Juniors encouraged to enroll. Course offered in the Fall only."
},
{
  name:"Prin & Theory of Medical & Health ",
  code:'ECON3384',
  desc:'The course is designed to teach students how to use basic principles and theories of microeconomics and statistics when thinking about medical and health care issues. In the course, we will use these concepts to understand the demand for health care, the supply of health care, the health insurance market, and the role of the government in health policy. We will focus on the U.S. health care industry. The market structure and the conduct and performance of the sub-sectors that compose this industry will be covered. Private insurance, pharmaceuticals, physician services, hospital service, and medical markets will be evaluated. Alternative health care systems will also be studied.'
},
{
  name: "Real Estate and Urban Action",
  code: "ECON2206",
  desc: "Real Estate and Urban Action is a class in which students explore the interdisciplinary fields that are engaged in neighborhood revitalization. The course uses the transformation of the failed Columbia Point housing project (Dorchester, MA) into Harbor Point, a successful mixed income neighborhood, as a core teaching case study, highlighting how successful redevelopment addresses the social and economic needs of community residents. Classes include guest lectures from developers, public planning officials, and supportive services experts on the social, cultural, and political factors critical to transforming distressed neighborhoods into safe and economically viable neighborhoods. It is a practical course, in which students gain experience through field trips and interactions with real estate and supportive services professionals, culminating in a team neighborhood transformation proposal."
},
{
  name: "The Global Economy",
  code: "ECON2207",
  desc:"This course aims to deepen your understanding of real world economic issues, while providing you with a stronger analytical base. We will focus on international trade theory and policy, and issues in international finance."
},
{
  name: "Sports Economics",
  code: "ECON2209",
  desc: "This course will develop fundamental economic concepts in the context of the sports industry. Students will apply economic theory to various aspects of both collegiate and professional sports. Topics include (but are not limited to) wage discrimination in sports, alumni giving and collegiate athletics, academics and collegiate athletics, sports rights and broadcasting, sports and gambling, salary caps, revenue sharing, insurance contracts, expansion, and stadium/arena financing."
},
{
  name: "Geographic Info Sys for Planning, Descision Making",
  code: "ECON2212",
  desc: "Large quantities of information are available to describe our social and physical environment with high detail, but making sense of this data requires specialized skill sets. Geographic Information Systems (GIS) is a general approach to analysis and is a powerful set of tools for understanding complex problems or for making a compelling argument about issues grounded in the physical or social environment. It is widely used in the public and private sectors. This course will introduce students to the use of GIS and representation as a means of looking at and representing spatial data. Students will learn how to perform the three broad steps of spatial analysis: 1) collecting and organizing data, 2) analyzing this data for appropriate patterns, and 3) using software to represent data on maps to support decision making."
},
{
  name: "Econometric Methods",
  code: "ECON2228",
  desc: "This course focuses on testing the predictions of economic theory. Topics covered include simple and multiple regression, multicollinearity, heteroskedasticity, serial correlation, specification errors, errors in variables, and an introduction to simultaneous equation estimation."
},
{
  name: "Public Policy in an Aging Society",
  code: "ECON2242",
  desc: "We live in a rapidly aging nation. In two decades, the age distribution of the U.S. will look like that of Florida today. We will analyze the underlying demographic trends, the economic status of the aged, the fiscal challenge of an aging society, public policies (especially social insurance) designed to assist older Americans, the impact of public policy on individual behavior, and proposals for reform."
},
{
  name: "Economics of Health Care and Social Security",
  code: "ECON2230",
  desc: "This course provides the core theories and concepts needed to understand health care issues in the developed world. It describes how the markets for health and health services are different from other goods, with a particular emphasis on the role of government and market failure. In addition it discusses the theoretical and empirical aspects of key health economics issues, including the demand for health and health services, supply side concerns, health insurance, and other possible related topics. The course encourages students examine the role of the market for the provision of health and health services and how public policy can influence these markets."
},
{
  name: "Money, Banking, and Financial Markets",
  code: "ECON2261",
  desc: "This course deals with topics such as significance and functions of money in the economy, behavior of interest rates, banking and management of financial institutions, central banking and the conduct of monetary policy, the Federal Reserve System, financial derivatives, money market, foreign exchange market, and the international financial system."
},
{
  name: "Environmental Economics and Policy",
  code: "ECON2277",
  desc: "This course provides an introduction to the economics of environmental policy. We begin by examining market failures from externalities and public goods. We then discuss public policy options to correct these failures, and develop tools to assess the costs and benefits of each approach. With this framework in place, the remainder of the course is spent evaluating past efforts to conserve land and improve air and water quality, before concluding with an extensive discussion about global climate change policy."
}

];
}
