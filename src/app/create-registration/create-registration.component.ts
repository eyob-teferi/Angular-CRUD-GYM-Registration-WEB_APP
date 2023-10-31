import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.css']
})
export class CreateRegistrationComponent implements OnInit {
  
  public packages=["Monthly","Quarterly","Yearly"];
  public importantList:string[]=[
    "Toxic Fat Reduction",
    "Energy and Endurance",
    "Buliding lean Muscle",
    "Healthier Digestive System",
    "Suger Craving Body",
    "Fitness"
  ]

  public registerForm!: FormGroup;
  private userIdToUpdate!: number;
  public isUpdateActive: boolean = false;
  userDetails!: User;

  constructor(private fb:FormBuilder, private api:ApiService,private toastService:NgToastService,private activatedRoute: ActivatedRoute,private router: Router){

  }
  ngOnInit(): void {
   this.registerForm=this.fb.group(
    {
       firstName:[''],
       lastName:[''],
       email:[''],
       mobile:[''],
       weight:[''],
       height:[''],
       bmi:[''],
       bmiResult:[''],
       gender:[''],
       requiretrainer:[''],
       package:[''],
       important:[''],
       haveGymBefore:[''],
       enquiryDate:[''],
    }
   );
   this.registerForm.controls['height'].valueChanges.subscribe(res=>{
      this.calculateBmi(res);
   })


   this.activatedRoute.params.subscribe(val => {
    this.userIdToUpdate = val['id'];
    this.fetchUserDetails(this.userIdToUpdate);
    this.fillFormToUpdate(this.userDetails);
  })




    }
  

    fetchUserDetails(userId: number) {
      this.api.getRegisteredUserId(userId)
        .subscribe(res =>{
          this.userDetails=res;
        }
          
        )
    }
    
  

  submit(){
    this.api.postRegistration(this.registerForm.value)
      .subscribe(res => {
        this.toastService.success({ detail: 'SUCCESS', summary: 'Registration Successful', duration: 3000 });
        this.registerForm.reset();
      });
  }

  fillFormToUpdate(user: User) {
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate
    })
  }

  update() {
    this.api.updateRegisterUser(this.registerForm.value, this.userIdToUpdate)
      .subscribe(res => {
        this.toastService.success({ detail: 'SUCCESS', summary: 'User Details Updated Successful', duration: 3000 });
        this.router.navigate(['list']);
        this.registerForm.reset();
      });
  }

  calculateBmi(heightValue: number){
    const weight=this.registerForm.value.weight;
    const height= heightValue;
    const bmi=weight/(height*height);
    this.registerForm.controls['bmi'].patchValue(bmi);
    switch (true){
      case bmi<18.5:
        this.registerForm.controls['bmiResult'].patchValue("Underweight");
        break;
      case (bmi>18.5 && bmi < 25):
          this.registerForm.controls['bmiResult'].patchValue("Normal");
          break;
      case (bmi>=25 && bmi < 30):
        this.registerForm.controls['bmiResult'].patchValue("Overweight");
        break;
      default:
        this.registerForm.controls['bmiResult'].patchValue("Obese");  
    }
  }
}
