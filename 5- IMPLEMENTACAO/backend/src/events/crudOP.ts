export interface CrudOperation {
  entity: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  source: 'ODM' | 'ORM';
  data: string;
  timestamp: string;
}
