import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl } from "@angular/forms";
import { FileUploadService } from "../shared/file-upload.service";
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../shared/data.service';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  preview: string;
  form: FormGroup;
  percentDone: any = 0;
  users = [];

  // profileForm = new FormGroup({
  //   firstName: new FormControl(''),
  //   lastName: new FormControl(''),
  // });
  
  constructor(
    public fb: FormBuilder,
    public router: Router,
    public fileUploadService: FileUploadService,
    public dataService: DataService
  ) {
    // Reactive Form
    this.form = this.fb.group({
      _id:[''],
      fName: [''],
      lName: [''],
      email: [''],
      pNumber: [''],
      avatar: [null]
    })
  }
  ngOnInit() {
    if(this.dataService.user){
      this.form.patchValue(this.dataService.user);
      console.log(this.dataService.user);
    }
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    }
    reader.readAsDataURL(file)
  }


  submitForm() {
    this.fileUploadService.addUser(
      this.form.value.fName,
      this.form.value.lName,
      this.form.value.pNumber,
      this.form.value.email,
      this.form.value.avatar,
      this.form.value._id,
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.percentDone = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.percentDone}%`);
          break;
        case HttpEventType.Response:
          console.log('User successfully created!', event.body);
          this.percentDone = false;
          this.router.navigate(['list']);
      }
    })
    if( this.form.value._id!=''){
    this.router.navigate(['/list']);
    }
  }

}
