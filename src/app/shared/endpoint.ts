import { environment } from '../../environments/environment';
import { IPagination } from '../interfaces/pagination.interface';

export const Endpoint = {
  STUDENT: {
    BASE: environment.api.base + 'students',
    CREATE: environment.api.base + 'students/create',
    FIND: (pagination: IPagination) =>
      environment.api.base +
      `students?pageNumber=${pagination.pageNumber}&pageElements=${pagination.pageElements}`,
  },
};
