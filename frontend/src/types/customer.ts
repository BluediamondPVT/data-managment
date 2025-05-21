export interface Customer {
  _id: string;
  name: string;
  phoneNumber: string;
  source?: string;
  service?: string;
  remark?: string;
  createdAt: string;
  updatedAt?: string;
  history?: HistoryEntry[];
  [key: string]: any; // For dynamic sorting
}

export interface HistoryEntry {
  timestamp: string;
  changes: {
    [key: string]: {
      old?: string;
      new?: string;
    };
  };
}