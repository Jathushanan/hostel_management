import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin/admin.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../user';


@Component({
  selector: 'pm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;
  selectedFile : File;

  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: UntypedFormGroup;
  fileInputLabel: string;

  userProfile = new UntypedFormGroup({
    username: new UntypedFormControl('',[Validators.required]),
    firstName: new UntypedFormControl('',[Validators.required]),
    lastName: new UntypedFormControl('',[Validators.required]),
    mobileNumber: new UntypedFormControl('',[Validators.required]),
    email: new UntypedFormControl('',[Validators.required]),
    password: new UntypedFormControl('',[Validators.required])
  });

  constructor(private authService: AuthService, private adminService: AdminService, private http: HttpClient, private formBuilder: UntypedFormBuilder) {
    this.authService.findMe().subscribe((user) =>
    {
      this.user = user;
      this.userProfile.controls['username'].setValue(user.username);
      this.userProfile.controls['firstName'].setValue(user.firstName);
      this.userProfile.controls['lastName'].setValue(user.lastName);
      this.userProfile.controls['mobileNumber'].setValue(user.mobileNumber);
      this.userProfile.controls['email'].setValue(user.email);
    });

    this.userProfile.get('username')!.disable();
    this.userProfile.get('firstName')!.disable();
    this.userProfile.get('lastName')!.disable();
    this.userProfile.get('mobileNumber')!.disable();
    this.userProfile.get('email')!.disable();

  }

  updateUserProfile() {   
    if(!this.userProfile.valid) {
      alert('Please Enter Valiad Value !');
      return;
    }
    const userProfileForm = this.userProfile.getRawValue();
    // console.log(userProfileForm);

    this.adminService.updateUser(userProfileForm)
    .subscribe((msg) => {
        alert(msg);
    }
    );

  }

  onFileSelected(event: any){
    const oldFile = event.target.files[0];
    this.fileInputLabel = oldFile.name;

    // let fileExtension:string = oldFile.name.split('?')[0].split('.').pop();
    const name = this.user.username + ".jpg";

    const file: File = new File([event.target.files[0]], name , {type: 'jpg'});

    this.fileUploadForm.get('uploadedImage')!.setValue(file);
  }

  onFormSubmit() {
    if (!this.fileUploadForm.get('uploadedImage')!.value) {
      alert('Please fill valid details!');
      return;
    }

    const formData = new FormData();
    formData.append('uploadedImage', this.fileUploadForm.get('uploadedImage')!.value);

    this.http.post<any>('http://localhost:4050/api/users/updateProfilePic', formData).subscribe(response => {
        alert("Successfully Updated !!");
        if (response.statusCode === 200) {
          // Reset the file input
          this.uploadFileInput.nativeElement.value = "";
          this.fileInputLabel = '';
        }
      }, er => {
        console.log(er);
        alert(er.error.error);
      });
  }

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      uploadedImage: ['']
    });
  }
}
