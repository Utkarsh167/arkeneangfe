import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  baseURL = "http://localhost:3000";
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Get Users
  // getUsers() {
  //   return this.http.get(this.baseURL)
  // }

  // Create User
  addUser(fName: string,lName: string,pNumer: string,email: string, profileImage: File,_id:string): Observable<any> {
    var formData: any = new FormData();
    formData.append("fName", fName);
    formData.append("lName", lName);
    formData.append("pNumber", pNumer);
    formData.append("email", email);
    formData.append("pImage", profileImage);

    console.log(_id);
    if(_id==''){
    return this.http.post<User>(`${this.baseURL}/users`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }else{
    formData.append("_id", _id);
    return this.http.put<User>(this.baseURL+'/users/'+_id, formData);
    // this.route.navigate(['/add-user']);
  }
  }


  listUser(): Observable<any> {
    // var formData: any = new FormData();
    // formData.append("fName", fName);
    // formData.append("lName", lName);
    // formData.append("pNumber", pNumer);
    // formData.append("email", email);
    // formData.append("pImage", profileImage);

    return this.http.get<User>(`${this.baseURL}/users`, {
      reportProgress: true,
      observe: 'events'
    })
  }

  deleteUser(_id){
    return this.http.delete(this.baseURL+'/users/'+_id);
  }

  // Error handling 
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
