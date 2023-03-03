import { EMPTY } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/user';
import { AuthService } from '../auth.service';





@Component({
  selector: 'hostel-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user: User;

  userGroup = new UntypedFormGroup({
    newUsername : new UntypedFormControl('',[Validators.required]),
    firstName : new UntypedFormControl('',[Validators.required]),
    lastName : new UntypedFormControl('',[Validators.required]),
    mobileNumber : new UntypedFormControl('',[Validators.required, Validators.pattern("[7-9]{1}[0-9]{9}")]),
    email : new UntypedFormControl('',[Validators.required, Validators.email]),
    newPassword : new UntypedFormControl('',[Validators.required]),
    cPassword : new UntypedFormControl('',[Validators.required, this.passwordMatch]),
  });

  constructor(private router: Router, private authService: AuthService)
  {
    this.authService.findMe().subscribe(user =>(this.user = user));
  }

  ngOnInit(): void {
  }

  passwordMatch(control: UntypedFormControl) {
    let newPassword = control.root.get('newPassword');
    return newPassword && control.value !== newPassword.value?
    {
      passwordMatch:true
    }
    : null;
  }

  
  // mobileNumberLegth(control: FormControl) {
  //   return control.value.length === 10?{
  //     mobileNumberLegth:true
  //   }: null;
  // }

  signup() {
    
    const user = this.userGroup.getRawValue();
    this.authService.signup(user).subscribe(s=>this.router.navigate(['/']));
  }

  get cPassword() {
    return this.userGroup.get('cPassword');
  }

  get email() {
    return this.userGroup.get('email');
  } 

  get mobileNumber() {
    return this.userGroup.get('mobileNumber');
  }

  get newPassword() {
    return this.userGroup.get('newPassword');
  }

  redirectToHome() {
    this.router.navigate(['/dashboard']); // navigate to dashboard page
  }

}
