from fastapi.responses import StreamingResponse
import pandas as pd
import numpy as np
from io import StringIO, BytesIO
from fastapi import FastAPI, UploadFile, File, HTTPException, Query, APIRouter


router = APIRouter()


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
