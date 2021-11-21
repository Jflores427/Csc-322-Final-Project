import './instructorView.css'
import { useAuth } from "../contexts/Authcontext";
import { useState, useRef, useEffect } from 'react';
import { db } from "../firebase.js";
import { userData } from '../contexts/userProfile';
import { collection, doc, query, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import Tabs from '../components/Tabs';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

export default function InstructorView() {
    const [Instructor, setInstructor] = useState('');
    const [CurrentClasses, setCurrentClasses] = useState([]);
    const [CurrentRoster, setCurrentRoster] = useState([]);
    const [Loading, setLoading] = useState('false');
    console.log(userData.getUd()); 

    // get the instructors courses
    async function getStudentCourses(db) {
        const coursesCol = collection(db, 'Instructor', userData.getUd(),"Courses");
        setLoading(true);
       onSnapshot(coursesCol, (querySnapshot) => {
          const student = [];
          querySnapshot.forEach((doc) => {
              student.push(doc.data());
          });
          console.log(student);
          setCurrentClasses(student);
        });
        setLoading(false);
      }

    // //setInstructor(userData.getName());

    // // async function GetInfo(db){
    // //     const { login, currentUser } = useAuth();
    // //     const {emailRef, passwordRef} = useRef();
    // //     try{
    // //         const useruiid = await login(emailRef.current.value, passwordRef.current.value);
    // //         const docRef = doc(db, "Instructor", useruiid);
    // //         const docSnap = await getDoc(docRef);
    // //         if(docSnap.exists())
    // //             setInstructor(docSnap.data().firstname + ' ' + docSnap.data().lastname);  
    // //     }
    // //     catch (error) {
    // //         document.getElementById('error').style.display = "block";
    // //     }        
    // // }

    //  async function getCourses(db) {
    // //     const docRef = doc(db, "Instructor", "{Instructor.name}", "Courses", "CurrentCourses")
    // //     const docSnap = await getDoc(docRef);

    // //     if(docSnap.exists()){
    // //         console.log("Document data:", docSnap.data());
    // //     }
    // //     else {
    // //         console.log("No such document!");
    // //         return -1;
    // //     }

    // //     //const instructor = [];
    // //     const currentCourses = [];
    // //     //const instructorsCol = collection(db, 'Instructor');
    // //     //setLoading(true);

    // //     const getDataCourses = onSnapshot(docSnap, (querySnapshot) => {
    // //       docSnap.forEach((doc) => {
    // //           currentCourses.push(doc.data());
    // //       });
    // //       setCurrentClasses(currentCourses);
    // //       return currentCourses;
    // //     }); 
        
    //  }
    // // function closeNavLink() {
    // //     window.scroll(0,0);
    // // }
    // // function Schedule (db){

    // // }

    // // function Roster(event) {

    // // }

    // // function Grades () {

    // // }

    // async function getRoster (db) {

    // }

    // async function getGrades(db) {


    // }

    useEffect(() => {
        setLoading(true);
        getStudentCourses(db);
        // getStudents(db);
        // getTclasses(db);
        // getLclasses(db);
      }, []);

      return (
        <div className = "InstructorPage">
        {/* <h1 class= "noselect">Welcome!</h1>
        <Container className = "Dropdown" maxWidth = "xs">
            <Typography component="div" style={{ backgroundColor: "white" }}>
                <div> 
                    <div className='Card2'>
                        <div className = "upper-container2">  
                            <div className='image-container'>
                                <img src= "https://www.logolynx.com/images/logolynx/ab/ab3cf43cb423c7d9c20eadde6a051a5d.jpeg" alt='' height="100px" width="100px"/>
                            </div>    
                            

                        </div>
                        <div className="lower-container2">
                            <h2>Selection Menu</h2>
                        <label for="options">Choose an option:</label>
                            <select>
                                <option value ="schedule" selected ="schedule">Schedule</option>
                                <option value="record">Record</option>
                                <option value="drop" >Drop</option>
                                <option value="roster">Roster</option>
                                <option value="grades">Grades</option>
                                <option value="complaints">Complaints</option>
                                <option value="rate">Rate</option>
                                <option value="warning">Warning</option>
                            </select>                         
                        </div>
                    </div>
                </div>    
            </Typography>
        </Container>    

        <div>
            <Container className = "Display" maxWidth = "lg">
                <Typography component="div" style={{ backgroundColor: "white", height: '90vh' }}>
                    <div>
                        <table className = "CourseStyler">
                                <tr>
                                    <th>Class</th>
                                    <th>Time</th>
                                    <th>Location</th>
                                    <th>Section</th>
                                    <th>Size</th>
                                </tr>
                            { CurrentClasses.map((Class) => (
                                <tr>
                                    <td> { Class.Class } </td>
                                    <td> { Class.DayTime } </td>
                                    <td> { Class.Room } </td>
                                    <td> { Class.Secion } </td>
                                    <td> {Class.Size } </td>
                                </tr>
                            ))}
                        </table>               
                    </div>
                </Typography>
            </Container>  
        </div>

        <Container className = "MyInfo" maxWidth = "sm">
            <Typography component="div" style={{ backgroundColor: 'White'}}>
                <div>
                    <div className='Card'>
                        <div className='upper-container'>
                            <div className='image-container'>
                                <img src= "https://i.pravatar.cc/150?img=17" alt='' height="100px" width="100px"/>
                            </div>
                        </div>
                        <div className="lower-container">
                            <h3>Instructor Information</h3>
                            <p>First Name: {userData.getFirstname()}</p>
                            <p>Last Name: {userData.getLastname()}</p>
                            <p>Date of Birth: {userData.getDob()}</p>
                            <p>Email: {userData.getEmail()}</p>
                        </div>
                    </div>
                </div>
            </Typography>
        </Container> */}

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
                            <label for="options">Choose an option:</label>
                            <select>
                                <option value ="schedule" selected ="schedule" >Schedule</option>
                                <option value="record">Record</option>
                                <option value="drop" >Drop</option>
                                <option value="enroll">Enroll</option>
                                <option value="grades">Grades</option>
                                <option value="complaints">Complaints</option>
                                <option value="rate">Rate</option>
                                <option value="warning">Warning</option>
                            </select>                         
                        </div>
                    </div>
                </div>    
        </Container>    

        <Container className= "Display" maxWidth = "false" >
                <div className= "Display" style={{ backgroundColor: "white", height: '80vh' , width: '150vh'}}>
                        {ScheduleSelected && <table className = "CourseStyler">
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
                </div>
            </Container>  

        <Container className = "MyInfo" maxWidth = "false">
            <div className ="MyInfo">
                    <div className='Card'>
                    <div className='upper-container'>
                            <div className='image-container'>
                                <img src= "https://i.pravatar.cc/150?img=17" alt='' height="100px" width="100px"/>
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
            {/*<div label="Schedule" onClick = {getCourses}>
                        <table className = "CourseStyler">
                            <tr>
                                <th>Class</th>
                                <th>Time</th>
                                <th>Location</th>
                                <th>Meeting Times</th>
                                <th> Enrolled</th>
                            </tr>
                        { CurrentClasses.map((Class) => (
                            <tr>
                                <td> { Class.name } </td>
                                <td> { Class.time } </td>
                                <td> { Class.location } </td>
                                <td> { Class.date } </td>
                                <td> {Class.Enrolled } </td>
                            </tr>
                        ))}
                        </table>
                        </div>*/}
          
              {/* <form classname="dd" id="dd1"> */}

                        {/* <input type="submit" value="Submit"/> */}
            {/* </form>    */}
        </div>

    
    );
};
