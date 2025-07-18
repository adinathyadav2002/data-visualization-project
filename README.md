# Data Visualization Platform

A comprehensive data analysis platform built with React/TypeScript frontend and FastAPI backend that allows users to upload, analyze, and visualize datasets with advanced data cleaning and preprocessing capabilities.

## 🚀 Features

- **File Upload & Processing**: Support for CSV and Excel files with data type detection
- **Interactive Data Preview**: Dynamic table view with sorting, filtering, and pagination
- **Statistical Analysis**: Comprehensive summary statistics for numeric and categorical data
- **Missing Values Analysis**: Visual representation and handling of missing data
- **Outlier Detection**: Statistical algorithms for identifying and managing outliers
- **Data Cleaning Pipeline**: Step-by-step data preprocessing workflow (implementing)
- **Chart Generation**: Interactive visualizations for data exploration
- **File Format Conversion**: Export data in multiple formats (CSV, Excel, JSON)
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- **React** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation
- **Shadcn/ui, Radix/ui aceternity** components

### Backend

- **FastAPI** (Python)
- **Pandas** for data manipulation
- **NumPy** for numerical computations
- **Uvicorn** ASGI server

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm**
- **Python** (v3.8 or higher)
- **pip** (Python package manager)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/adinathyadav2002/data-visualization-project.git
cd data-visualization-project
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

**Start the FastAPI server:**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

**API Documentation:** Visit `http://localhost:8000/docs` for interactive API documentation

### 3. Frontend Setup

Open a new terminal and navigate to the project root:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:8000/
```

## 📁 Project Structure

```
data-visualization-project/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application file
│   ├── requirements.txt    # Python dependencies
│   ├── routers/           # API route handlers
│   ├── models/            # Database models
│   ├── schemas/           # Pydantic schemas
│   └── utility/           # Helper functions
├── src/                   # React frontend
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── api/              # API service functions
│   ├── types/            # TypeScript type definitions
│   └── lib/              # Utility functions
├── public/               # Static assets
└── package.json         # Node.js dependencies
```

## 🚀 Available Scripts

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Scripts

```bash
# Development
uvicorn main:app --reload

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📊 Usage

1. **Upload Dataset**: Navigate to the upload page and select a CSV or Excel file
2. **Data Analysis**: View automatic analysis including:
   - Summary statistics
   - Missing values visualization
   - Data type detection
   - Categorical data distribution
3. **Data Cleaning**: Follow the step-by-step cleaning pipeline
4. **Visualization**: Generate charts and graphs for data exploration
5. **Export**: Download cleaned data in your preferred format

## 🔗 API Endpoints

- `POST /api/data/upload-file` - Upload and analyze dataset
- `POST /api/data/get-full-dataset` - Retrieve complete dataset
- `POST /api/data/convert-file` - Convert file formats
- `GET /api/data/` - API health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Adinath Yadav**

- GitHub: [@adinathyadav2002](https://github.com/adinathyadav2002)
- LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/adinath-yadav-50a294251/)

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this project
- Inspired by modern data analysis tools and platforms
- Built with love for the data science community

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/adinathyadav2002/data-visualization-project/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the problem

---

⭐ **Star this repository if you found it helpful!**
