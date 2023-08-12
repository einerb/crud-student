import { Student } from './student.interface';

export interface ResponsePagination {
  records: Student[];
  elementsPerPage: number;
  page: number;
  totalPages: number;
  totalRecords: number;
}
