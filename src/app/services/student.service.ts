import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Constant } from '../shared/constant';
import { GlobalService } from 'src/app/services/global.service';
import { Student } from '../interfaces/student.interface';
import { IPagination } from '../interfaces/pagination.interface';
import { ResponsePagination } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private globalService: GlobalService) {}

  public getAll(
    pagination: IPagination
  ): Observable<{ data: ResponsePagination }> {
    return this.globalService
      .get(Constant.Endpoints.STUDENT.FIND(pagination))
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public create(data: Student) {
    return this.globalService.post(Constant.Endpoints.STUDENT.CREATE, data).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public update(identification: number, data: Student) {
    return this.globalService
      .patch(Constant.Endpoints.STUDENT.BASE + '/' + identification, data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public delete(data: Student) {
    return this.globalService
      .delete(Constant.Endpoints.STUDENT.BASE + '/' + data.identification)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
