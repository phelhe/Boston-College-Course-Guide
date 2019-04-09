# Boston-College-Course-Guide

Often it is hard to visualize the order in which one should take classes to complete their major or meet prerequisites for a desired class.
This web app attempts to solve this problem by organizing computer science and economics classes into a tree, where each line in the 
tree diagram represents a prerequisite.
Users select their major (implemented for computer science and economics only), the courses they have already completed, and then
a tree is rendered that displays the remaining core courses required in order to complete their major. At the bottom of the page, the
electives for their major are rendered as well; if the user hovers over an elective, the prerequisites will be highlighted.
Finally, if a user clicks on a class, they can see more information about the class, such as the course description and title. 

Implemented using JavaScript, Node, Express, and Socket.IO. 

Boston College Course Guide:
•	Provided a solution to Boston College’s complex system of course requirements by 
creating a web application that displays a tree of a student’s remaining course 
requirements, tailored to the individual student’s course history, allowing students 
to more easily visualize the order in which they need to take classes 
•	Built a web application that helps students determine how to complete essential course requirements for their major
•	Implemented the web application using Node.js, Express, Socket.IO, and JavaScript
