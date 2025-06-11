export interface DatasetInfo {
  columns: Array<{ name: string; type: string }>;
  totalRows: number;
  data: Array<{
    [key: string]: string | number;
  }>;
}

export interface File {
  filename: string;
  file_type: string;
  shape: [number, number];
  columns: Record<string, string>;
  preview: Array<Record<string, string>>;
  numeric_columns: string[];
  categorical_columns: string[];
  summary: Record<
    string,
    { mean: number; min: number; max: number; std: number; count: number }
  >;
  categorical_data: Record<string, Array<{ category: string; count: number }>>;
  missing_values: Record<
    string,
    { null_count: number; null_percentage: number; total_rows: number }
  >;
  full_data: boolean;
}
