const express = require('express');
const app = express();
const path=require('path');
const mysql = require('mysql');

global.tname;
//For using static folder content
app.use('/static',express.static('static'));

// Creating View Engine
app.set('views', path.join(__dirname, 'templates'))
app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded());

//Database connection
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Rushi.11",
    database: "student_management"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to databse.");
  });

app.get("/",(req,res)=>{
    res.render('teacher_login');
});

app.post("/",(req,res)=>{
    res.render('teacher_login');
});

app.get("/success",(req,res)=>{
    res.render('gethome');
});

app.post("/success",(req,res)=>{
    let usn=String(req.body.USN);
    let subc=String(req.body.SUB_CODE);
    let ia1=String(req.body.IA1);
    let ia2=String(req.body.IA2);
    let ia3=String(req.body.IA3);
    let act=String(req.body.ACT);
    let avg=(parseFloat(ia1)+parseFloat(ia2)+parseFloat(ia3)+parseFloat(act))/4;
    let grade
    if(avg>=0 && avg<11){
      grade="D";
    }
    else if(avg>=11 && avg<21){
      grade="C";
    }
    else if(avg>=21 && avg<31){
      grade="B";
    }
    else if(avg>=11 && avg<21){
      grade="A";
    }
    else{
      grade="NA";
    }
    let sqlcmd="UPDATE student_marks set IA1_Marks =?,IA2_Marks =?,IA3_Marks =?,Act_Marks =?,Grade =? WHERE USN=? AND Sub_Code=?";
    con.query(sqlcmd,[ia1,ia2,ia3,act,grade,usn,subc],(err, result)=> {
      if (err) throw err;});
    res.write('<script>alert("Successfully Inserted/Updated Marks")</script>');
    res.write('<script>window.history.go(-1)</script>');
    res.end();
});

app.get("/teacher_home",(req,res)=>{
      res.render('teacher_home');
});

app.post("/teacher_home",(req,res)=>{
    let name=String(req.body.cname);
    let pswd=String(req.body.cpswd);
    let sqlcmd="SELECT * FROM teachers where Username = ?";
    con.query(sqlcmd,[name],(err, result)=> {
      if (err) throw err;
      let vtpswd=String(result[0].Password);
        if (vtpswd === pswd){
          res.render('teacher_home',{tid:result[0].ID,tname:result[0].Username,tqua:result[0].Qualification,ct:result[0].CT});
      }
      else{
        res.write('<script>alert("Username And Password Didn\'t match")</script>');
        res.write('<script>window.location.assign("/")</script>');
        res.end();
      }
      
    });
});

app.post("/student_login",(req,res)=>{
  res.render('student_login');
});

app.get("/student_login",(req,res)=>{
  res.render('student_login');
});

app.get("/student_home",(req,res)=>{
    res.render('gethome');
});

app.post("/student_home",(req,res)=>{
    let sname=String(req.body.cname);
    let spswd=String(req.body.cpswd);
    let sqlcmd="SELECT Password FROM students where USN = ?";
    con.query(sqlcmd,[sname],(err, result)=> {
      if (err) throw err;
      let vspswd=String(result[0].Password);
      if (vspswd === spswd){
          res.render('student_home');
      }
      else{
        res.write('<script>alert("Username And Password Didn\'t match")</script>');
        res.write('<script>window.location.assign("/student_login")</script>');
        res.end();
      }

    });
});

app.listen(80,()=>{
    console.log("The server running on port 80");
});