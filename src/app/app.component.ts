import * as moment from 'moment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ModalCreateComponent } from './modal-create/modal-create.component';
import { Student } from './interfaces/student.interface';
import { StudentService } from './services/student.service';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public dataSource = new MatTableDataSource<Student>();
  public page: number = 1;
  public elementsPerPage = 5;
  public totalRecords: number = 0;
  public displayedColumns: string[] = [
    'identification',
    'name',
    'lastname',
    'birthday',
    'phone',
    'email',
    'status',
    'actions',
  ];

  constructor(
    public dialog: MatDialog,
    private readonly studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.getStudents();
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public delete(student: Student) {
    Swal.fire({
      icon: 'warning',
      title: `¿Está seguro que desea eliminar al estudiante ${student.name} ${student.lastname}?`,
      text: 'Será una acción que no se podrá revertir!',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancelar!',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService.delete(student).subscribe((res) => {
          Swal.fire({
            icon: 'success',
            title: res.message,
          });

          this.getStudents();
        });
      }
    });
  }

  public getAge(birthDate: Date): number {
    const today = moment();
    const birth = moment(birthDate);
    return today.diff(birth, 'years');
  }

  public loadPage(event: any) {
    const pageIndex = event.pageIndex + 1;
    const pageSize = event.pageSize;

    if (
      event.previousPageIndex !== undefined ||
      event.nextPageIndex !== undefined
    ) {
      this.getStudents(pageIndex, pageSize);
    }
  }

  public openDialog(data: Student | null): void {
    const dialogRef = this.dialog.open(ModalCreateComponent, {
      data: data,
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.getStudents();
      }
    });
  }

  private getStudents(
    pageIndex: number = this.page,
    pageSize: number = this.elementsPerPage
  ) {
    this.studentService
      .getAll({ pageNumber: pageIndex, pageElements: pageSize })
      .pipe(
        catchError((err) => {
          Swal.fire({
            icon: 'error',
            title: err.error.message,
          });
          throw err;
        })
      )
      .subscribe((res) => {
        this.dataSource.data = res.data.records;
        this.totalRecords = res.data.totalRecords;
        this.page = pageIndex;
        this.elementsPerPage = pageSize;
      });
  }
}
