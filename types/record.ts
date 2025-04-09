export interface CreateRecordDto {
    userId: number | null;
    entity: string;
    description: string;
  }


  export interface RecordFlat {
    id: number;
    userId: number | null;
    userName: string;
    identity: string;
    description: string;
    createdAt: Date;
  };