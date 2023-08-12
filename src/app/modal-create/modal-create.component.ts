import Swal from 'sweetalert2';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from '../interfaces/student.interface';
import { StudentService } from '../services/student.service';
import { catchError } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-create',
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.css'],
})
export class ModalCreateComponent {
  public form!: FormGroup;
  public submitted = false;
  public maxDate!: Date;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Student | null,
    private readonly studentService: StudentService
  ) {
    this.setMaxDate();
    this.createForm();

    this.patchValue();
  }

  public onSave() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if (this.data) {
      this.form.get('identification')?.setValidators([]);
      this.form.get('status')?.setValidators([Validators.required]);

      this.update(this.data?.identification, this.form.value);
    } else {
      this.form.get('identification')?.setValidators([Validators.required]);
      this.form.get('status')?.setValidators([]);

      this.create();
    }

    this.form.get('name')?.updateValueAndValidity();
  }

  setMaxDate() {
    const threeYearsAgo = moment().subtract(3, 'years');
    this.maxDate = threeYearsAgo.toDate();
  }

  private create() {
    this.studentService
      .create(this.form.value)
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
        Swal.fire({
          icon: 'success',
          title: res.message,
        }).then((result) => {
          if (result.isConfirmed) {
            this.dialogRef.close('success');
          }
        });
      });
  }

  private createForm() {
    this.form = this.fb.group({
      identification: ['', [Validators.required]],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      status: [true, [Validators.required]],
    });
  }

  private update(identification: number, data: Student) {
    this.studentService
      .update(identification, data)
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
        Swal.fire({
          icon: 'success',
          title: res.message,
        }).then((result) => {
          if (result.isConfirmed) {
            this.dialogRef.close('success');
          }
        });
      });
  }

  private patchValue() {
    if (this.data) {
      this.form.get('identification')?.disable();
      this.form.patchValue({
        identification: this.data.identification,
        name: this.data.name,
        lastname: this.data.lastname,
        birthday: this.data.birthday,
        phone: this.data.phone,
        email: this.data.email,
        status: this.data.status,
      });
    }
  }
}
