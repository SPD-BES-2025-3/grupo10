export interface CrudOperation {
  entity: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  source: 'ODM';
  data: string;
  timestamp: string;
}
