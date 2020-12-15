import { Component, OnInit,ViewChild,AfterViewInit } from '@angular/core';
import { FileUploadService } from '../shared/file-upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
// import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
// import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { DataService } from '../shared/data.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['fName', 'lName', 'email','pNumber','pImage','action'];
  dataSource: any;

  @ViewChild(MatPaginator,null) paginator: MatPaginator;
  @ViewChild(MatSort,null) sort: MatSort;
  users;
  constructor(
    public fileUploadService: FileUploadService,
    private dataService: DataService,
    private route: Router
  ) { }


  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    this.fileUploadService.listUser().subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          // this.percentDone = Math.round(event.loaded / event.total * 100);
          // console.log(`Uploaded! ${this.percentDone}%`);
          break;
        case HttpEventType.Response:
          console.log('User data fetched succesfully!', event.body);
        let users = event.body;
        // console.log(this.users);
        this.dataSource = new MatTableDataSource(users);
          // this.percentDone = false;
          // this.router.navigate(['list']);
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(filterValue.trim().toLowerCase())
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteUser(id){
    // this.dataService.user=user;
    // console.log(id);
    this.fileUploadService.deleteUser(id).subscribe(data => {
      console.log(data);
      this.getUserDetails();
  })
}

  editUser(user){
    this.dataService.user=user;
    this.route.navigate(['/add-user']);
    // console.log(id);
  }

  adduser(){
    this.route.navigate(['/add-user']);
  }

}
