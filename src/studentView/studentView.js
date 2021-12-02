import './studentView.css'
import './studentregister.css'
import { userData } from '../contexts/userProfile';
import { useState, useEffect, useRef } from 'react';
import React from 'react'
import { db } from "../firebase.js";
import { useHistory } from 'react-router-dom';
import emailjs from 'emailjs-com';
import Tabs from '../components/Tabs';
import { getDoc,collection,onSnapshot, setDoc,doc,addDoc, updateDoc, deleteDoc } from '@firebase/firestore';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
import { FaStar } from "react-icons/fa";
import ComplainPopup from './studentcomplainPopup';
import ComplaintPopup from './complainPopup';
import RatePopup from './ratePopus';

var instUid;
var course;
var InstructorTable;
var complainUiid;
var fetchedassignedclasses = [];
export default function StudentView() {
    const taboowords = ["shit","dang","damn"];
   const history = useHistory();
   const instname = useRef();
   const classname = useRef(); 
   const experience = useRef();  
   const complaint = useRef();
   const [Student, setStudent] = useState('');
   const [enrollcourses, setCourses] = useState([]);
   const [student, setStudent1] = useState([]);
   const [CurrentClasses, setCurrentClasses] = useState([]);
   const [StudentRecord, setStudentRecord] = useState([]);
   const [Instructor, setInstructor] = useState([]);
   const [CurrentClassesTimes, setCurrentClassesTimes] = useState([]);
   const [complainpopup, setIsOpen] = useState(false);
   const [complainpopup1, setIsOpen1] = useState(false);
   const [ratepopus, setrateIsOpen] = useState(false);
   const [Warnings, setWarnings] = useState([]);
   const [StudentsWarnings, setStudentsWarnings] = useState([]);
   const [ClassStudents, setClassStudents] = useState([]);
   const [Loading, setLoading] = useState(false);
   const [InputValue, setInputValue] = useState('');
   const [OptionSelected, setOptionSelected] = useState("schedule");
   const [CanceledCourses, setCanceledCourses] = useState(false);
   const instructorRef = useRef();
   const courseRef = useRef();
   const options = [{label: "Schedule", value: "schedule"}, {label:"Grades", value: "grades"}, {label: "Enroll", value: "enroll"}, 
                    {label: "Drop", value: "drop"}, {label: "Complaints", value: "complaints"}, 
                    {label: "Rate", value: "rate"}, {label: "Warning", value: "warning"}];

    const handleInputChange = value => {
      setInputValue(value);
  }

  const handleChange = value => {
    setOptionSelected(value);
  }
  // complainpopup
  const complainPopUp = () => {
    setIsOpen(!complainpopup);
    }
  async function complainclosePopUp () {
    setIsOpen(!complainpopup);
    }

    // complainpopup1
  const complainPopUp1 = () => {
    setIsOpen1(!complainpopup1);
    }
  async function complainclosePopUp1 () {
    setIsOpen1(!complainpopup1);
    }

    // ratepopup
  const ratePopup = (a,b) => {
    course = a;
    instUid = b; 
    setrateIsOpen(!ratepopus);
    }

  async function closeratePopup () {
    setrateIsOpen(!ratepopus);
    }

    // get the students records 
    async function getStudentRecords(db) {
        const recordCol = collection(db, 'Students', userData.getUd(),"Record");
        setLoading(true);
       onSnapshot(recordCol, (querySnapshot) => {
          const record = [];
          querySnapshot.forEach((doc) => {
              record.push(doc.data());
          });
          console.log(record)
          setStudentRecord(record);
        });
        setLoading(false);
      }

    async function getStudentCourses(db) {
        const coursesCol = collection(db, 'Students', userData.getUd(),"Courses");
        setLoading(true);
       onSnapshot(coursesCol, (querySnapshot) => {
          const student = [];
          querySnapshot.forEach((doc) => {
              student.push(doc.data());
          });
          setCurrentClasses(student);
        });
        setLoading(false);
      }
    
    async function getWarnings(db){
        const warnCol = collection(db, 'Students');
        setLoading(true);
       onSnapshot(warnCol, (querySnapshot) => {
          const warning = [];
          querySnapshot.forEach((doc) => {
              warning.push(doc.data());
          });
          setWarnings(warning);
        });
        setLoading(false);
     }

     async function getWarnings1(db){
        const getwarnCol = collection(db, 'Students',userData.getUd(),"Warnings");
        setLoading(true);
       onSnapshot(getwarnCol, (querySnapshot) => {
          const getwarning = [];
          querySnapshot.forEach((doc) => {
              getwarning.push(doc.data());
          });
          setStudentsWarnings(getwarning);
        });
        setLoading(false);
     }

     // Get Student Courses Day Time
    async function getStudentCoursesDayTime(db) {
        const coursesCol = collection(db, 'Students', userData.getUd(),"Courses");
        setLoading(true);
        onSnapshot(coursesCol, (querySnapshot) => {
            const student = [];
            querySnapshot.forEach((doc) => {
                student.push(doc.data().DayTime);
        });
        setCurrentClassesTimes(student);
        });
        setLoading(false);
    }

     async function getInstructor1(db) {
        const complainsCol = collection(db, 'Instructor');
        setLoading(true);
       onSnapshot(complainsCol, (querySnapshot) => {
          const complain = [];
          querySnapshot.forEach((doc) => {
              complain.push(doc.data());
          });
          console.log(complain);
          setInstructor(complain);
        });
        setLoading(false);
      }
    // put the enroll courses
    async function getCourses(db) {
        const assignedclassCol = collection(db, 'AssignedClasses');
        setLoading(true);
       onSnapshot(assignedclassCol, (querySnapshot) => {
          const course = [];
          querySnapshot.forEach((doc) => {
              course.push(doc.data());
          });
          setCourses(course);
        });
        setLoading(false);
      }
      // student drop course
      async function dropCourse(a,b) {
        // a== classname
        // b == instructor
      if(userData.getPeriod()>=1 && userData.getPeriod()<=3){
      await deleteDoc(doc(db, "Students", userData.getUd(),"Courses",a));
      // update the class size
      const assignedCol = collection(db, 'AssignedClasses');
        setLoading(true);
       onSnapshot(assignedCol, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            fetchedassignedclasses.push(doc.data());
          });
        });
        let classsize = 0;
        for(let i = 0; i<fetchedassignedclasses; i++){
            if(fetchedassignedclasses[i].Class === a){
                classsize = fetchedassignedclasses[i].Size;
                break;
            }
        }
      classsize+=1;
      // start updating the class size
      const washingtonRef = doc(db, "AssignedClasses", a);
        await updateDoc(washingtonRef, {
        Size: classsize
        });
      // setdoc to student record and add a grade W
      await setDoc(doc(db, "Students", userData.getUd(),"Record",a), {
        Class: a,
        Instructor: b,
        Grade: "W"
      });
      // done updating student record with a W
      // done updating the class size
      alert("Course has been dropped sucessfully!");
      if(CurrentClasses.length===1){
        // add the student to the suspended student doc
        let studentdata;
        for(let i = 0; i<Warnings.length; i++){
            if(Warnings[i].useruiid===userData.getUd()){
                studentdata = Warnings[i];
                break;
            }
        }
        // Add a new document in collection "cities"
        await setDoc(doc(db, "SuspendedStudents", userData.getUd()), studentdata);
        alert("You have dropped all courses, therefore you have been suspended!");
        userData.setRole(-1);
        userData.setStatus(false);
        await history.push('/');
        }
        else{
      await history.push('StudentView');
        }
    }
  }
      async function enrollCourse(classs,daytime,room,section,size,instructor,instructoruiid){
        // check if the student is already enrolled in the course
          // get the data for the students in the course 
          const studentCol = collection(db, "Instructor", instructoruiid,"Courses", classs, "Roster");
              onSnapshot(studentCol, (querySnapshot) => {
              const course = [];
              querySnapshot.forEach((doc) => {
                  course.push(doc.data());
              });
              // console.log("line 47 "+ course[0].Student);
              setStudent1(course);
              });
          // now we need to perfrom a query to see if the student is in the course
        
          /* This code isn't working*/
          for(let i = 0; i<student.length; i++){
              if(student[i].Student === userData.getUd()){
                console.log("hi")
                  alert("You have already enrolled in this course");
                  await history.push('StudentView');
                  break;
              }
          }
          

        // All this code makes sure that the courses time doesn't conflict with eachother
        let timeSegments =[];

        var timeSegments1 = function(time) {
            var timeArray = time.split("-");
            return timeArray;
        }
        console.log(CurrentClassesTimes);
        for(let i = 0; i<CurrentClassesTimes.length; i++){
            let timeValue = timeSegments1(CurrentClassesTimes[i]);
            timeSegments.push(timeValue);
        }

        let timeValue2 = timeSegments1(daytime);
        timeSegments.push(timeValue2);
        console.log(timeSegments);
            
        function getTime(time) {
            var array = time.split(":");
            var x = parseInt(array[0]);
            var u = parseInt(array[1]);
            return (x * 1000) + u;
        }
        
        // Sorts the courses's time
        function timesort(arr){
            for(let i = 0; i < arr.length; i++){
                let k = i;
                for (let j = i; j < arr.length; j++) {
                    if (arr[j][0] < arr[k][0]) {
                        k = j;
                    } else if (arr[j][0] === arr[k][0]) {
                        if (getTime(arr[j][2]) < getTime(arr[k][2])) {
                            k = j;
                        } else if (getTime(arr[j][3]) < getTime(arr[k][3])) {
                            k = j;
                        }
                      }
                    }

                    let temp = arr[k];
                    arr[k] = arr[i];
                    arr[i] = temp;    
                }
                return arr;
            }

            timeSegments = timesort(timeSegments);

            // Checks if the courses's time overlaps with one another
            const checkOverlap = (timeSegments) => {

                for (let i = 0; i < timeSegments.length - 1; i++) {
                    const currentEndTime = timeSegments[i][3];
                    const nextStartTime = timeSegments[i + 1][2];
                    const currentDay = timeSegments[i][0];
                    const nextDay = timeSegments[i+1][0];

                    if(currentDay === nextDay){
                        if (currentEndTime > nextStartTime) {    
                            return true;
                        }
                    }
                }
            
                return false;
            };

            if(checkOverlap(timeSegments) === true){
                alert("This course's time conflicts with your other classes's time.");
                await history.push('StudentView');
            }
            else {
                // first check size of class
                if(parseInt(size)===0){
                // put the guy/girl on waitlist
                    await setDoc(doc(db, "Waitlist", instructoruiid), {
                    Class: classs,
                    DayTime: daytime,
                    Room: room,
                    Secion: section,
                    Instructor: instructor,
                    Instructoruiid: instructoruiid,
                    Student: userData.getUd(),
                    StudentName: userData.getFirstname() + " " + userData.getLastname()
                    });
                    alert("Class is filled up, you have been placed on the wait list");
                }
                // if the class is not filled then...
                else {
                // put the student in the instrcutors roster
                    await addDoc(collection(db, "Instructor", instructoruiid,"Courses", classs, "Roster"), {
                    Student: userData.getUd()
                });        
          // await addDoc(doc(db, "Instructor", instructoruiid,"Courses", classs, "Roster"), {
          //     Student: userData.getUd()
          //   });
            // put the course in student database
            await setDoc(doc(db, "Students", userData.getUd(),"Courses", classs), {
                Class: classs,
                DayTime: daytime,
                Room: room,
                Secion: section,
                Instructor: instructor,
                Instructoruiid: instructoruiid
            });
            // constant used to updat the class size
            let updateclasssize = parseInt(size);
            --updateclasssize;
            alert("Enrolled in class sucessfully!");
            // then we want to update the size of the class 
            await updateDoc(doc(db, "AssignedClasses", classs), {
                Size: updateclasssize
            });
            }   
        }
    }


    async function Complain(a,b){
        // Get the Instructor
        const docRef = doc(db, "Instructor", b);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        InstructorTable = docSnap
        console.log("Document data:", docSnap.data());
        } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        }
        // Get the students in the class
        const stuCol = collection(db, 'Instructor',b,"Courses",a,"Roster");
        setLoading(true);
        onSnapshot(stuCol, (querySnapshot) => {
        const complain = [];
        querySnapshot.forEach((doc) => {
            complain.push(doc.data());
        });
        
        console.log(complain);
        for(let i = 0; i<complain.length; i++){
            for(let j = 0; j<Warnings.length; j++){
                if(complain[i].Student===Warnings[j].useruiid){
                    complain[i].StudentName = Warnings[j].firstname + " " + Warnings[j].lastname
                }
            }
        }
        setClassStudents(complain);
        });
        setLoading(false);
    complainPopUp();
}
    async function Complain1(a){
        // check
        if(a === userData.getUd()){
            alert("You cannot complain on yourself!")
            await history.push('StudentView')
        }
        else{
        complainUiid = a;
        for(let i = 0; i<Instructor.length; i++){
            if(Instructor[i].useruiid===a){
                complainUiid = Instructor[i].firstname + " " + Instructor[i].lastname;
            }
        }
        for(let i = 0; i<Warnings.length; i++){
            if(Warnings[i].useruiid===a){
                complainUiid = Warnings[i].firstname + " " + Warnings[i].lastname;
            }
        }
        complainPopUp1();
    }
}
    async function Rate(a,b){
        ratePopup(a,b);
    }
    async function submitreview(){
        // average formula 
        for(let i = 0; i<Instructor.length; i++){
            if(Instructor[i].useruiid === instUid){
                var fullname = Instructor[i].firstname + " " + Instructor[i].lastname;
                  let t_total = (Instructor[i].Review) * (Instructor[i].numReview);
                  let new_total = (t_total) + (currentValue);
                  var new_updated_total = (new_total)/((Instructor[i].numReview) + 1);
                  const updated_num_review = ((Instructor[i].numReview) + 1);
                  const washingtonRef = doc(db, "Instructor", Instructor[i].useruiid);
                  // Set the "capital" field of the city 'DC'
                  await updateDoc(washingtonRef, {
                  Review: new_updated_total,
                  numReview: updated_num_review
                  });
            }
        }
        // check for taboo words and give them a warning 
        let check = document.getElementById("input-details").value
        check = check.split(' ');
        let count = 0;
        console.log(check);
        for(let i = 0; i<check.length; i++){
            if(taboowords.includes(check[i])){
                check[i] = "*";
                ++count;
            }
        }
        check = check.join(" ");
        if(count<3){
            // author recieves one warning 
            for(let i = 0; i<Warnings.length; i++){
                if(Warnings[i].useruiid === userData.getUd()){
                    var warncount = Warnings[i].numWarn;
                    warncount += 1;
                    const washingtonRef = doc(db, "Students",userData.getUd());
                // Set the "capital" field of the city 'DC'
                await updateDoc(washingtonRef, {
                    numWarn: warncount
                });
              }
            }
            // add the doc to the warnings
            await addDoc(collection(db, "Students",userData.getUd(),"Warnings"), {
                Warn: "You have been given one warnings for taboo words",
                numofWarn: 1
              });              
            await addDoc(collection(db, "Reviews"), {
                SentByUIID: userData.getUd(),
                SentBy: userData.getFirstname()+ " "+ userData.getLastname(),
                Course: course,
                InstructorName: fullname,
                InstructorUiid: instUid,
                InstructoravgReview: (new_updated_total).toFixed(2),
                Rating: currentValue,
                Review: check 
              });
              alert("Review submitted, Thank you for your Feedback!");
              closeratePopup();
        }
        if (count>=3){
           // author recieves two warning 
           for(let i = 0; i<Warnings.length; i++){
            if(Warnings[i].useruiid === userData.getUd()){
                var warncount = Warnings[i].numWarn;
                warncount += 2;
                const washingtonRef = doc(db, "Students",userData.getUd());
                // Set the "capital" field of the city 'DC'
                await updateDoc(washingtonRef, {
                    numWarn: warncount
                });
            }
          }
          // add the doc to the warnings
          await addDoc(collection(db, "Students",userData.getUd(),"Warnings"), {
            Warn: "You have been given two warnings for taboo words",
            numofWarn: 2
          });
          alert("You have too many taboo words, review failed to submit unsuccessfully");
          await history.push('Studentview');
        }
    }

    async function submitComplaint(){
        await addDoc(collection(db, "Complaints"), {
            SentBy: userData.getFirstname()+ " "+ userData.getLastname(),
            IssuedName: complainUiid,
            Complaint: document.getElementById("input-details").value 
          });
          alert("Complaint submitted, Thank you for your Feedback!");
          await history.push('Studentview');  
    }

 useEffect(() => {
    setLoading(true);
    getStudentCourses(db);
    getWarnings(db);
    getInstructor1(db);
    getWarnings1(db);
    getCourses(db);
    getStudentRecords(db);
    getStudentCoursesDayTime(db);
  }, []);


  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0)

  const handleClick = value => {
    console.log(value)
    setCurrentValue(value)
  }

  const handleMouseOver = newHoverValue => {
    setHoverValue(newHoverValue)
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined)
  }

  const colors = {
    violet: "#c722e0",
    grey: "#a9a9a9",  
    };

    if (Loading) {
        return <h1> Loading .. </h1>
      }

    return (
        <div className ='studentPage'>
        <h1 className= "noselect" style = {{color: "White"}}>Welcome!</h1>
         
        <Container className = "Dropdown" maxWidth = "false">
                <div> 
                    <div className='Card2'>
                        <div className = "upper-container2">  
                            <div className='image-container'>
                                <img src= "https://www.logolynx.com/images/logolynx/ab/ab3cf43cb423c7d9c20eadde6a051a5d.jpeg" alt='' height="100px" width="100px"/>
                            </div>    
                        </div>
                        <div className="lower-container2">
                            <h2>Selection Menu</h2>
            
                            <Select className ="Selection" options = { options } value ={OptionSelected} onInputChange = {handleInputChange} onChange = {handleChange}>
                            </Select>
                        </div>
                    </div>
                </div>    
        </Container>    

        <Container className = "MyInfo" maxWidth = "false">
            <div className ="MyInfo">
                    <div className='Card'>
                    <div className='upper-container'>
                            <div className='image-container2'>
                                <img src= "https://i.pravatar.cc/150?img=56" alt='' height="100px" width="100px"/>
                            </div>
                    </div>
                    <div className="lower-container">
                            <h3>Student Information</h3>
                            <p>First Name: {userData.getFirstname()}</p>
                            <p>Last Name: {userData.getLastname()}</p>
                            <p>Date of Birth: {userData.getDob()}</p>
                            <p>GPA: {userData.getGPA()}</p>
                            <p>EMPL: {userData.getEmpl()}</p>
                            <p>Email: {userData.getEmail()}</p>
                    </div>
                </div>
            </div> 
        </Container>
        <Container className= "Display" maxWidth = "false" >
            <div className= "Display" style={{ backgroundColor: "white", height: '80vh' , width: '150vh'}}>
                {OptionSelected.value === "schedule" && <table className = "student-schedule-table">
                                <tr>
                                    <th>Class</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                    <th>Section</th>
                                    <th> Instructor</th>
                                </tr>
                            { CurrentClasses.map((Class) => (
                                <tr>
                                    <td> { Class.Class } </td>
                                    <td> { Class.DayTime } </td>
                                    <td> { Class.Room } </td>
                                    <td> { Class.Secion } </td>
                                    <td> {Class.Instructor } </td>
                                </tr>
                            ))}
                        </table>    
                        }  
                     
                     {(OptionSelected.value === "grades") && <table className ="student-grades-table">
                                <tr>
                                    <th>Class</th>
                                    <th>Instructor</th>
                                    <th>Grades</th>
                                </tr>
                            { StudentRecord.map((Class) => (
                                <tr>
                                    <td> { Class.Class } </td>
                                    <td> { Class.Instructor } </td>
                                    <td> { Class.Grade } </td>
                                </tr>
                            ))}
                        </table>    
                        }
                        
                        {(OptionSelected.value === "drop") && <table className="student-drop-table">
                                <tr>
                                    <th>Class</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                    <th>Section</th>
                                    <th> Instructor</th>
                                </tr>
                            { CurrentClasses.map((Class) => (
                                <tr>
                                    <td> { Class.Class } </td>
                                    <td> { Class.DayTime } </td>
                                    <td> { Class.Room } </td>
                                    <td> { Class.Secion } </td>
                                    <td> {Class.Instructor } </td>
                                    <td> <button onClick = {() => dropCourse(Class.Class,
                                                                            Class.Instructor
                                    )}>Drop</button> </td>
                                </tr>
                            ))}
                        </table>    
                        }
                        
                        {(OptionSelected.value === "enroll") && 
                         <table className="enroll-student-table">
                         <tr>
                             <th>Class</th>
                             <th>Day/Time</th>
                             <th>Room</th>
                             <th>Section</th>
                             <th className="enroll-instructor-column">Instructor</th>
                             <th className="enroll-size-column">Size</th>
                         </tr>
                         {enrollcourses.map((course) => (
                             <tr>
                                 <td> {course.Class} </td>
                                 <td> {course.DayTime} </td>
                                 <td> {course.Room} </td>
                                 <td> {course.Secion} </td>
                                 <td className="enroll-instructor-column2"> {course.Instructor} </td>
                                 <td className="enroll-size-column2"> {course.Size} </td>
                                 <td><button className="enroll-button"onClick={() => enrollCourse(course.Class, 
                                                               course.DayTime, 
                                                               course.Room, 
                                                               course.Secion, 
                                                               course.Size,
                                                               course.Instructor,
                                                               course.Instructoruiid
                                                               )}>Enroll Course</button></td>
                             </tr>
                         ))}
                     </table> 
                        }

                        

                        {(OptionSelected.value === "complaints") && <table className = "student-complaint-table">
                                <tr>
                                    <th>Name</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                    <th>Section</th>
                                    <th>Instructor</th>
                                </tr>
                            {CurrentClasses.map((Class) => (
                                <tr>
                                    <td> { Class.Class } </td>
                                    <td> { Class.DayTime } </td>
                                    <td> { Class.Room } </td>
                                    <td> { Class.Secion } </td>
                                    <td> {Class.Instructor } </td>
                                    <td><button onClick={() => Complain(Class.Class,
                                                                        Class.Instructoruiid 
                                    )}className="student-complaint-button">Complain</button></td>
                                </tr>
                            ))}
                        </table>    
                        }       
                        {((userData.getPeriod() !==3) && (OptionSelected.value === "rate")) && 
                        <table className = "student-rate-table">
                                <tr>
                                    <th>Class</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                    <th>Section</th>
                                    <th> Instructor</th>
                                </tr>
                            { CurrentClasses.map((Class) => (
                                <tr>
                                    <td> { Class.Class } </td>
                                    <td> { Class.DayTime } </td>
                                    <td> { Class.Room } </td>
                                    <td> { Class.Secion } </td>
                                    <td> {Class.Instructor } </td>
                                    <td><button className="rate-button"onClick = {() => Rate(Class.Class, 
                                                                      Class.Instructoruiid                                  
                                                                     )}>Rate</button></td>
                                </tr>
                            ))}
                        </table>     
                        }
                        {((userData.getPeriod() === 3) && (OptionSelected.value === "rate")) && 
                        <div className = "student-rate-table-after-period">
                                <h1>You cannot rate during this period.</h1>
                                <h2>Please try again next semester!</h2>
                        </div>     
                        }   
                   
                
                        {(OptionSelected.value === "warning") && <div className="warning-page">
                            <h1>Total Warnings:</h1>
                            <p>Reminder: Getting 3 warnings will result in a suspension!</p>
                                <table className ="CourseStyler-warning">
                                    <tr>
                                        <th>Amount</th>
                                        <th>Reason</th>
                                    </tr>
                                    { StudentsWarnings.map((warn) => (
                                        <tr>
                                            <td> { warn.numofWarn } </td>
                                            <td> { warn.Warn } </td>
                                        </tr>
                                    ))}
                                </table>   
                        </div> 
                        }    
                </div>
            </Container>  

      
        {complainpopup && <ComplainPopup
            content={<>
                <table className="complaint-popup-table">
                    <h1>Instructor</h1>
                <tr>
                    <th>Name</th>
                    <th></th>
                </tr>
                                <tr>
                                    <td> { InstructorTable.data().firstname+ " " + InstructorTable.data().lastname } </td>
                                    <td><button onClick = {() => Complain1(InstructorTable.data().useruiid                              
                                                                     )}className="complaint-popup-button">Complain</button></td>
                                </tr>
                </table>
                <table className="complaint-popup-table">
                    <h1>Students</h1>
                <tr>
                    <th>Name</th>
                    <th></th>
                </tr>
                { ClassStudents.map((Class) => (
                                <tr>
                                    <td> { Class.StudentName } </td>
                                    <td><button onClick = {() => Complain1(Class.Student                                
                                                                     )}className="complaint-popup-button">Complain</button></td>
                                </tr>
                            ))}
                </table>
            </>}
            handleClose={complainclosePopUp}
            />}
        
        {complainpopup1 && <ComplaintPopup
            content={<>
                <div className="complaint"style={styles.container}>
                        <h2> Complaint </h2>
                            <textarea className="input-details"id="input-details"ref={complaint} placeholder="Describe your issue." style={styles.textarea} />
                            <button onClick ={submitComplaint} className="submit-complaint-button"> Submit </button>  
                        </div>
            </>}
            handleClose={complainclosePopUp1}
            />} 
        {ratepopus && <RatePopup
            content={<>
                <div className="rating"style={styles.container}>
                            <h2> Ratings </h2>
                            <div style={styles.stars}>
                            {stars.map((_, index) => {
                                return (
                                    <FaStar
                                    key={index}
                                    size={24}
                                    onClick={() => handleClick(index + 1)}
                                    onMouseOver={() => handleMouseOver(index + 1)}
                                    onMouseLeave={handleMouseLeave}
                                    color={(hoverValue || currentValue) > index ? colors.violet : colors.grey}
                                    style={{
                                        marginRight: 10,
                                        cursor: "pointer"
                                    }}
                                    />
                                )
                             })}
                            </div>
                                <textarea className="input-details" id="input-details"ref={experience} placeholder="What's your experience?" style={styles.textarea} />
                            <button onClick = {submitreview}className="submit-rating-button"> Submit </button>
                     </div> 
            </>}
            handleClose={closeratePopup}
            />}                    
    </div>
    );
}

const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    stars: {
      display: "flex",
      flexDirection: "row",
    },
    textarea: {
      border: "1px solid #a9a9a9",
      borderRadius: 5,
      padding: 10,
      margin: "20px 0",
      minHeight: 100,
      width: 300
    },
    textarea2: {
        border: "1px solid #a9a9a9",
        borderRadius: 5,
        padding: 10,
        margin: "10px 0",
        minHeight: 40,
        width: 100
    },
  };


