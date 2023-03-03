import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Student } from 'src/app/student';
import { AdminService } from '../admin.service';
import { ViewAllStudentService } from '../view-all-student/view-all-student.service';

@Component({
  selector: 'pm-update-student',
  templateUrl: './update-student.component.html',
  styleUrls: ['./update-student.component.css',
    '../view-all-student/view-all-student.component.css',
    '../student-add/student-add.component.css'
  ]
})
export class UpdateStudentComponent implements OnInit {

  students: Student[] = [];
  msg: string;

  maleStudents: Student[] = [];
  superDeluxeRoomsMaleStudents: Student[] = [];
  deluxeRoomsMaleStudents: Student[] = [];
  standardRoomsMaleStudents: Student[] = [];

  femaleStudents: Student[] = [];
  superDeluxeRoomsFemaleStudents: Student[] = [];
  deluxeRoomsFemaleStudents: Student[] = [];
  standardRoomsFemaleStudents: Student[] = [];

  searchRooms: Student[] = [];
  searchIsDone: boolean = false;
  searchmsg: string = "No Student Found!!";

  rNoForSearch = new UntypedFormGroup({
    rNo: new UntypedFormControl('',[Validators.required])
  });

  studentDetails = new UntypedFormGroup({
    roomNo: new UntypedFormControl('',[Validators.required]),
    personNo: new UntypedFormControl('',[Validators.required]),
    gender: new UntypedFormControl('',[Validators.required]),
    roomCategory: new UntypedFormControl('',[Validators.required]),
    firstName: new UntypedFormControl('',[Validators.required]),
    lastName: new UntypedFormControl('',[Validators.required]),
    fatherName: new UntypedFormControl('',[Validators.required]),
    mobileNo: new UntypedFormControl('',[Validators.required, Validators.pattern("[7-9]{1}[0-9]{9}")]),
    fatherMobileNo: new UntypedFormControl('',[Validators.required, Validators.pattern("[7-9]{1}[0-9]{9}")]),
    email: new UntypedFormControl('',[Validators.required, Validators.email]),
    studentAdharCard: new UntypedFormControl('',[Validators.required, Validators.pattern("[0-9]{12}")]),
    fatherAdharCard: new UntypedFormControl('',[Validators.required, Validators.pattern("[0-9]{12}")]),
    currentAdress: new UntypedFormControl('',[Validators.required]),
    collegeName: new UntypedFormControl('',[Validators.required]),
    isStatus: new UntypedFormControl('',[Validators.required])
  });

  constructor(private viewAllStudentService: ViewAllStudentService, private adminService: AdminService, private router: Router, private httpClient: HttpClient) 
  { 
    this.viewAllStudentService.findStudent()
    .subscribe((studentsDetail) => {
        this.students = studentsDetail;
        this.students.sort((a, b) => (a.roomNo > b.roomNo) ? 1 : -1);
        this.students = this.students.filter(a=> a.isStatus !== false);
         
        this.femaleStudents = this.students.filter(a=> a.gender == "female");
        this.superDeluxeRoomsFemaleStudents = this.femaleStudents.filter(a => a.roomCategory == "Super Deluxe");
        this.deluxeRoomsFemaleStudents = this.femaleStudents.filter(a => a.roomCategory == "Deluxe");
        this.standardRoomsFemaleStudents = this.femaleStudents.filter(a => a.roomCategory == "Standard");

        this.maleStudents = this.students.filter(a=> a.gender == "male");
        this.superDeluxeRoomsMaleStudents = this.maleStudents.filter(a => a.roomCategory == "Super Deluxe");
        this.deluxeRoomsMaleStudents = this.maleStudents.filter(a => a.roomCategory == "Deluxe");
        this.standardRoomsMaleStudents = this.maleStudents.filter(a => a.roomCategory == "Standard");
        
        this.msg = 'There is not a single student';
      }
    );

  }

  ngOnInit(): void {
  }

  updateStudent() {
    const student = this.studentDetails.getRawValue();
    this.adminService.updateStudent(student)
    .subscribe((msg) => {
        alert(msg);
    }
    );
  }

  removeStudent() {
    const student = this.studentDetails.getRawValue();
    // console.log(student);
    if(confirm("Are you sure to delete room no " + student.roomNo)) {
      this.adminService.removeStudent(student)
      .subscribe((msg) => {
          alert(msg);
          window.location.reload();
      }
      );
    }
  }

  searchRoomNo() 
  {
    this.searchIsDone = false;
    if(!this.rNoForSearch.valid) {
      alert('please enter roomNo');
      return;
    }
    const roomNoDetails = this.rNoForSearch.getRawValue();
    this.searchRooms = this.students.filter(a => a.roomNo == roomNoDetails.rNo);
    this.searchIsDone = true;
  }

  setValue(student: Student) {
    // console.log(student);
    this.studentDetails.controls['roomNo'].setValue(student.roomNo);
    this.studentDetails.controls['personNo'].setValue(student.personNo);
    this.studentDetails.controls['gender'].setValue(student.gender);
    this.studentDetails.controls['roomCategory'].setValue(student.roomCategory);
    this.studentDetails.controls['firstName'].setValue(student.firstName);
    this.studentDetails.controls['lastName'].setValue(student.lastName);
    this.studentDetails.controls['fatherName'].setValue(student.fatherName);
    this.studentDetails.controls['mobileNo'].setValue(student.mobileNo);
    this.studentDetails.controls['fatherMobileNo'].setValue(student.fatherMobileNo);
    this.studentDetails.controls['email'].setValue(student.email);
    this.studentDetails.controls['studentAdharCard'].setValue(student.studentAdharCard);
    this.studentDetails.controls['fatherAdharCard'].setValue(student.fatherAdharCard);
    this.studentDetails.controls['currentAdress'].setValue(student.currentAdress);
    this.studentDetails.controls['collegeName'].setValue(student.collegeName);
    this.studentDetails.controls['isStatus'].setValue(student.isStatus);

  }

  get rNo() {
    return this.rNoForSearch.get('rNo');
  }

}
