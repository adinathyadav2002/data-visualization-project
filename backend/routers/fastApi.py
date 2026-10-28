from fastapi.responses import StreamingResponse
import pandas as pd
import numpy as np
import re
from io import StringIO, BytesIO
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File, HTTPException, Query, APIRouter


router = APIRouter()


class CleanOperation(BaseModel):
    type: str
    params: Optional[Dict[str, Any]] = None


class CleanDataRequest(BaseModel):
    data: List[Dict[str, Any]]
    operations: List[CleanOperation]


@router.get("/")
async def root():
    return {"message": "Data Analysis API is running"}


@router.post("/upload-file")
async def upload_file(
    file: UploadFile = File(...),
    full_data: bool = Query(
        False, description="Return full dataset instead of just preview")
):
    """
    Upload and analyze a CSV or Excel file
    Returns:
    - First 5 rows as JSON (or full data if full_data=True)
    - Column names and data types
    - Summary statistics for numeric columns
    - Categorical data analysis
    - Missing values information
    """

    # Validate file type
    valid_extensions = ['.csv', '.xlsx', '.xls']
    if not any(file.filename.lower().endswith(ext) for ext in valid_extensions):
        raise HTTPException(
            status_code=400, detail="File must be CSV or Excel format")

    try:
        # Read the uploaded file
        content = await file.read()

        # Create DataFrame based on file type
        if file.filename.lower().endswith('.csv'):
            csv_string = content.decode('utf-8')
            df = pd.read_csv(StringIO(csv_string))
        else:  # Excel file
            df = pd.read_excel(BytesIO(content))

        # Get basic info
        shape = df.shape
        columns_info = {col: str(df[col].dtype) for col in df.columns}

        # Get preview or full data based on parameter
        if full_data:
            # Return all data (be careful with large datasets)
            data_rows = df.fillna("").to_dict('records')
        else:
            # Return first 5 rows
            data_rows = df.head(5).fillna("").to_dict('records')

        # Convert numpy types to Python types for JSON serialization
        for row in data_rows:
            for key, value in row.items():
                if pd.isna(value):
                    row[key] = None
                elif isinstance(value, (np.integer, np.int64)):
                    row[key] = int(value)
                elif isinstance(value, (np.floating, np.float64)):
                    row[key] = float(value)
                else:
                    row[key] = str(value)

        # Get numeric columns for analysis
        numeric_columns = df.select_dtypes(
            include=[np.number]).columns.tolist()

        # Calculate summary statistics for numeric columns
        summary = {}
        if numeric_columns:
            summary_stats = df[numeric_columns].describe()
            for col in numeric_columns:
                summary[col] = {
                    'mean': float(summary_stats.loc['mean', col]) if not pd.isna(summary_stats.loc['mean', col]) else 0,
                    'min': float(summary_stats.loc['min', col]) if not pd.isna(summary_stats.loc['min', col]) else 0,
                    'max': float(summary_stats.loc['max', col]) if not pd.isna(summary_stats.loc['max', col]) else 0,
                    'std': float(summary_stats.loc['std', col]) if not pd.isna(summary_stats.loc['std', col]) else 0,
                    'count': int(summary_stats.loc['count', col]) if not pd.isna(summary_stats.loc['count', col]) else 0
                }

        # Get categorical columns and their value counts
        categorical_columns = df.select_dtypes(
            include=['object', 'category']).columns.tolist()
        categorical_data = {}

        for col in categorical_columns:
            # Get top 10 categories to avoid overwhelming the chart
            value_counts = df[col].value_counts().head(10)
            categorical_data[col] = [
                {'category': str(cat), 'count': int(count)}
                for cat, count in value_counts.items()
            ]

        # Missing values analysis
        missing_values = {}
        for col in df.columns:
            null_count = df[col].isnull().sum()
            missing_values[col] = {
                'null_count': int(null_count),
                'null_percentage': float((null_count / len(df)) * 100),
                'total_rows': len(df)
            }

        return {
            "filename": file.filename,
            "file_type": "csv" if file.filename.lower().endswith('.csv') else "excel",
            "shape": shape,
            "columns": columns_info,
            "preview": data_rows,
            "numeric_columns": numeric_columns,
            "categorical_columns": categorical_columns,
            "summary": summary,
            "categorical_data": categorical_data,
            "missing_values": missing_values,
            "full_data": full_data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing file: {str(e)}")


@router.post("/get-full-dataset")
async def get_full_dataset(file: UploadFile = File(...)):
    """
    Get the complete dataset for the dataset viewer
    """

    valid_extensions = ['.csv', '.xlsx', '.xls']
    if not any(file.filename.lower().endswith(ext) for ext in valid_extensions):
        raise HTTPException(
            status_code=400, detail="File must be CSV or Excel format")

    try:
        content = await file.read()

        # Create DataFrame based on file type
        if file.filename.lower().endswith('.csv'):
            csv_string = content.decode('utf-8')
            df = pd.read_csv(StringIO(csv_string))
        else:  # Excel file
            df = pd.read_excel(BytesIO(content))

        # Convert to dict records
        data_rows = df.fillna("").to_dict('records')

        # Convert numpy types to Python types for JSON serialization
        for row in data_rows:
            for key, value in row.items():
                if pd.isna(value):
                    row[key] = None
                elif isinstance(value, (np.integer, np.int64)):
                    row[key] = int(value)
                elif isinstance(value, (np.floating, np.float64)):
                    row[key] = float(value)
                else:
                    row[key] = str(value)

        return {
            "data": data_rows,
            "columns": {col: str(df[col].dtype) for col in df.columns},
            "total_rows": len(df)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing file: {str(e)}")


@router.post("/convert-file")
async def convert_file(
    file: UploadFile = File(...),
    output_format: str = Query(
        "csv", description="Output format: 'csv' or 'excel'")
):
    """
    Convert uploaded CSV/Excel file to CSV or Excel format.
    Returns the converted file as a downloadable response.
    """

    valid_extensions = ['.csv', '.xlsx', '.xls']
    filename = file.filename.lower()

    if not any(filename.endswith(ext) for ext in valid_extensions):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Only .csv, .xls, .xlsx are allowed."
        )

    try:
        content = await file.read()

        # Read input file into a DataFrame
        if filename.endswith('.csv'):
            df = pd.read_csv(StringIO(content.decode('utf-8')))
        else:
            df = pd.read_excel(BytesIO(content))

        # Prepare output buffer
        output_buffer = BytesIO()
        base_name = file.filename.rsplit('.', 1)[0]

        if output_format == 'csv':
            df.to_csv(output_buffer, index=False)
            media_type = "text/csv"
            extension = "csv"
        elif output_format == 'excel':
            with pd.ExcelWriter(output_buffer, engine='openpyxl') as writer:
                df.to_excel(writer, index=False)
            media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            extension = "xlsx"
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid output format. Must be 'csv' or 'excel'."
            )

        output_buffer.seek(0)

        return StreamingResponse(
            output_buffer,
            media_type=media_type,
            headers={
                "Content-Disposition": f"attachment; filename={base_name}.{extension}"
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process file: {str(e)}"
        )


@router.post("/clean-data")
async def clean_data_endpoint(request: CleanDataRequest):
    """
    Perform optimal, vectorized data cleaning operations using pandas.
    Supports missing value imputation/removal, duplicate removal, column standardization,
    text normalization, outlier removal, and column type casting.
    """
    try:
        if not request.data:
            return {"data": [], "columns": {}, "total_rows": 0, "log": ["Dataset is empty"]}

        df = pd.DataFrame(request.data)
        log = []

        for op in request.operations:
            op_type = op.type
            params = op.params or {}

            if op_type == "drop_duplicates":
                before = len(df)
                subset = params.get("columns")
                keep = params.get("keep", "first")
                if subset and isinstance(subset, list) and len(subset) > 0:
                    df = df.drop_duplicates(subset=subset, keep=keep)
                else:
                    df = df.drop_duplicates(keep=keep)
                dropped = before - len(df)
                log.append(f"Removed {dropped} duplicate rows (keep='{keep}')")

            elif op_type == "drop_na":
                before = len(df)
                subset = params.get("columns")
                how = params.get("how", "any")
                if subset and isinstance(subset, list) and len(subset) > 0:
                    df = df.dropna(subset=subset, how=how)
                else:
                    df = df.dropna(how=how)
                dropped = before - len(df)
                log.append(f"Dropped {dropped} rows containing null values")

            elif op_type == "fill_na":
                strategy = params.get("strategy", "constant")
                cols = params.get("columns") or df.columns.tolist()
                fill_val = params.get("value", "")

                for c in cols:
                    if c in df.columns:
                        null_c = int(df[c].isna().sum())
                        if null_c > 0:
                            if strategy == "mean" and pd.api.types.is_numeric_dtype(df[c]):
                                m = float(df[c].mean())
                                df[c] = df[c].fillna(m)
                                log.append(f"Filled {null_c} missing values in '{c}' with mean ({round(m, 2)})")
                            elif strategy == "median" and pd.api.types.is_numeric_dtype(df[c]):
                                med = float(df[c].median())
                                df[c] = df[c].fillna(med)
                                log.append(f"Filled {null_c} missing values in '{c}' with median ({round(med, 2)})")
                            elif strategy == "mode":
                                mode_val = df[c].mode()
                                val = mode_val[0] if not mode_val.empty else fill_val
                                df[c] = df[c].fillna(val)
                                log.append(f"Filled {null_c} missing values in '{c}' with mode ('{val}')")
                            elif strategy == "ffill":
                                df[c] = df[c].ffill()
                                log.append(f"Forward-filled {null_c} missing values in '{c}'")
                            elif strategy == "bfill":
                                df[c] = df[c].bfill()
                                log.append(f"Backward-filled {null_c} missing values in '{c}'")
                            else:
                                df[c] = df[c].fillna(fill_val)
                                log.append(f"Filled {null_c} missing values in '{c}' with '{fill_val}'")

            elif op_type == "standardize_columns":
                case = params.get("case", "snake_case")
                new_names = {}
                for col in df.columns:
                    clean_col = str(col).strip()
                    if case == "snake_case":
                        clean_col = re.sub(r'[^\w\s]', '', clean_col)
                        clean_col = re.sub(r'\s+', '_', clean_col).lower()
                    elif case == "lowercase":
                        clean_col = clean_col.lower()
                    elif case == "uppercase":
                        clean_col = clean_col.upper()
                    new_names[col] = clean_col
                df = df.rename(columns=new_names)
                log.append(f"Standardized all column names to {case}")

            elif op_type == "clean_text":
                cols = params.get("columns") or df.select_dtypes(include=['object']).columns.tolist()
                action = params.get("action", "trim")
                for c in cols:
                    if c in df.columns and pd.api.types.is_object_dtype(df[c]):
                        s = df[c].astype(str)
                        if action == "trim":
                            df[c] = s.str.strip()
                        elif action == "lowercase":
                            df[c] = s.str.lower()
                        elif action == "uppercase":
                            df[c] = s.str.upper()
                        elif action == "remove_special":
                            df[c] = s.str.replace(r'[^a-zA-Z0-9\s]', '', regex=True)
                log.append(f"Applied text cleaning ({action}) to {len(cols)} columns")

            elif op_type == "remove_outliers":
                cols = params.get("columns") or df.select_dtypes(include=[np.number]).columns.tolist()
                multiplier = float(params.get("multiplier", 1.5))
                action = params.get("action", "remove")
                total_outliers = 0
                for c in cols:
                    if c in df.columns and pd.api.types.is_numeric_dtype(df[c]):
                        q1 = df[c].quantile(0.25)
                        q3 = df[c].quantile(0.75)
                        iqr = q3 - q1
                        lower_bound = q1 - multiplier * iqr
                        upper_bound = q3 + multiplier * iqr
                        outlier_mask = (df[c] < lower_bound) | (df[c] > upper_bound)
                        outlier_count = int(outlier_mask.sum())
                        if outlier_count > 0:
                            total_outliers += outlier_count
                            if action == "remove":
                                df = df[~outlier_mask]
                            elif action == "clip":
                                df[c] = df[c].clip(lower_bound, upper_bound)
                log.append(f"{'Removed' if action == 'remove' else 'Clipped'} {total_outliers} outliers using IQR")

        # Convert back to clean records
        data_rows = df.fillna("").to_dict('records')
        for row in data_rows:
            for key, value in row.items():
                if pd.isna(value):
                    row[key] = ""
                elif isinstance(value, (np.integer, np.int64)):
                    row[key] = int(value)
                elif isinstance(value, (np.floating, np.float64)):
                    row[key] = float(value)
                else:
                    row[key] = str(value)

        return {
            "data": data_rows,
            "columns": {col: str(df[col].dtype) for col in df.columns},
            "total_rows": len(df),
            "log": log
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data cleaning failed: {str(e)}")
