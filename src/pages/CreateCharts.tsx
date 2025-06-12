import React, { useState, useRef } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Plus,
  Edit3,
  Trash2,
  Download,
  Save,
  X,
  BarChart3,
  PieChartIcon,
  TrendingUp,
  Circle,
} from "lucide-react";

const ChartBuilder = () => {
  const [charts, setCharts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingChart, setEditingChart] = useState(null);
  const [currentChart, setCurrentChart] = useState({
    id: null,
    title: "",
    type: "bar",
    data: [{ name: "Item 1", value: 100 }],
    colors: ["#3b82f6"],
    showLegend: true,
    showGrid: true,
    width: 400,
    height: 300,
  });
  const chartsRef = useRef();

  const defaultCharts = [
    {
      id: "pie-sample",
      title: "Sales Distribution",
      type: "pie",
      data: [
        { name: "Product A", value: 400 },
        { name: "Product B", value: 300 },
        { name: "Product C", value: 300 },
        { name: "Product D", value: 200 },
      ],
      colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
      showLegend: true,
      showGrid: false,
      width: 400,
      height: 300,
    },
    {
      id: "line-sample",
      title: "Monthly Revenue",
      type: "line",
      data: [
        { name: "Jan", value: 4000 },
        { name: "Feb", value: 3000 },
        { name: "Mar", value: 5000 },
        { name: "Apr", value: 4500 },
        { name: "May", value: 6000 },
        { name: "Jun", value: 5500 },
      ],
      colors: ["#3b82f6"],
      showLegend: true,
      showGrid: true,
      width: 500,
      height: 300,
    },
    {
      id: "bar-sample",
      title: "Quarterly Performance",
      type: "bar",
      data: [
        { name: "Q1", value: 2400 },
        { name: "Q2", value: 1398 },
        { name: "Q3", value: 9800 },
        { name: "Q4", value: 3908 },
      ],
      colors: ["#3b82f6"],
      showLegend: true,
      showGrid: true,
      width: 400,
      height: 300,
    },
    {
      id: "scatter-sample",
      title: "Price vs Quality",
      type: "scatter",
      data: [
        { name: "A", value: 100, x: 100, y: 200 },
        { name: "B", value: 120, x: 120, y: 100 },
        { name: "C", value: 170, x: 170, y: 300 },
        { name: "D", value: 140, x: 140, y: 250 },
        { name: "E", value: 150, x: 150, y: 400 },
        { name: "F", value: 110, x: 110, y: 280 },
      ],
      colors: ["#3b82f6"],
      showLegend: true,
      showGrid: true,
      width: 400,
      height: 300,
    },
  ];

  const resetCurrentChart = () => {
    setCurrentChart({
      id: null,
      title: "",
      type: "bar",
      data: [{ name: "Item 1", value: 100 }],
      colors: ["#3b82f6"],
      showLegend: true,
      showGrid: true,
      width: 400,
      height: 300,
    });
  };

  const openModal = (chart = null) => {
    if (chart) {
      setCurrentChart({ ...chart });
      setEditingChart(chart.id);
    } else {
      resetCurrentChart();
      setEditingChart(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingChart(null);
    resetCurrentChart();
  };

  const addDataPoint = () => {
    const newPoint =
      currentChart.type === "scatter"
        ? {
            name: `Item ${currentChart.data.length + 1}`,
            value: 100,
            x: 100,
            y: 100,
          }
        : { name: `Item ${currentChart.data.length + 1}`, value: 100 };
    setCurrentChart({
      ...currentChart,
      data: [...currentChart.data, newPoint],
    });
  };

  const updateDataPoint = (index, field, value) => {
    const newData = [...currentChart.data];
    newData[index] = {
      ...newData[index],
      [field]:
        field === "value" || field === "x" || field === "y"
          ? Number(value)
          : value,
    };
    setCurrentChart({ ...currentChart, data: newData });
  };

  const removeDataPoint = (index) => {
    if (currentChart.data.length > 1) {
      const newData = currentChart.data.filter((_, i) => i !== index);
      setCurrentChart({ ...currentChart, data: newData });
    }
  };

  const addColor = () => {
    setCurrentChart({
      ...currentChart,
      colors: [...currentChart.colors, "#3b82f6"],
    });
  };

  const updateColor = (index, color) => {
    const newColors = [...currentChart.colors];
    newColors[index] = color;
    setCurrentChart({ ...currentChart, colors: newColors });
  };

  const removeColor = (index) => {
    if (currentChart.colors.length > 1) {
      const newColors = currentChart.colors.filter((_, i) => i !== index);
      setCurrentChart({ ...currentChart, colors: newColors });
    }
  };

  const saveChart = () => {
    if (!currentChart.title.trim()) {
      alert("Please enter a chart title");
      return;
    }

    if (editingChart) {
      setCharts(
        charts.map((chart) =>
          chart.id === editingChart
            ? { ...currentChart, id: editingChart }
            : chart
        )
      );
    } else {
      const newChart = { ...currentChart, id: Date.now().toString() };
      setCharts([...charts, newChart]);
    }
    closeModal();
  };

  const deleteChart = (id) => {
    setCharts(charts.filter((chart) => chart.id !== id));
  };

  const addDefaultChart = (defaultChart) => {
    const newChart = { ...defaultChart, id: Date.now().toString() };
    setCharts([...charts, newChart]);
  };

  const exportToPDF = async () => {
    const html2pdf = await import(
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
    );

    const element = chartsRef.current;
    const opt = {
      margin: 1,
      filename: "charts-export.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf.default().set(opt).from(element).save();
  };

  const renderChart = (chart) => {
    const { type, data, colors, showLegend, showGrid, width, height } = chart;

    switch (type) {
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              {showLegend && <Legend />}
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey="value"
                stroke={colors[0]}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Bar dataKey="value" fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="x" name="x" />
              <YAxis dataKey="y" name="y" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              {showLegend && <Legend />}
              <Scatter dataKey="y" fill={colors[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Chart Builder</h1>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Create Chart
              </button>
              {charts.length > 0 && (
                <button
                  onClick={exportToPDF}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download size={20} />
                  Export PDF
                </button>
              )}
            </div>
          </div>

          {/* Default Charts */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Sample Charts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {defaultCharts.map((chart) => (
                <div
                  key={chart.id}
                  className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {chart.type === "pie" && (
                        <PieChartIcon size={16} className="text-blue-600" />
                      )}
                      {chart.type === "line" && (
                        <TrendingUp size={16} className="text-blue-600" />
                      )}
                      {chart.type === "bar" && (
                        <BarChart3 size={16} className="text-blue-600" />
                      )}
                      {chart.type === "scatter" && (
                        <Circle size={16} className="text-blue-600" />
                      )}
                      <span className="font-medium text-sm">{chart.title}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addDefaultChart(chart)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors"
                  >
                    Add to Charts
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Display */}
        <div ref={chartsRef}>
          {charts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {charts.map((chart) => (
                <div
                  key={chart.id}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {chart.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(chart)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteChart(chart.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div style={{ width: "100%", height: chart.height }}>
                    {renderChart(chart)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {charts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Charts Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first chart or add a sample chart to get started
            </p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingChart ? "Edit Chart" : "Create New Chart"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Configuration Panel */}
                  <div className="space-y-6">
                    {/* Basic Settings */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Basic Settings
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={currentChart.title}
                            onChange={(e) =>
                              setCurrentChart({
                                ...currentChart,
                                title: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter chart title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chart Type
                          </label>
                          <select
                            value={currentChart.type}
                            onChange={(e) =>
                              setCurrentChart({
                                ...currentChart,
                                type: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="bar">Bar Chart</option>
                            <option value="line">Line Chart</option>
                            <option value="pie">Pie Chart</option>
                            <option value="scatter">Scatter Plot</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Width
                            </label>
                            <input
                              type="number"
                              value={currentChart.width}
                              onChange={(e) =>
                                setCurrentChart({
                                  ...currentChart,
                                  width: Number(e.target.value),
                                })
                              }
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="200"
                              max="800"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Height
                            </label>
                            <input
                              type="number"
                              value={currentChart.height}
                              onChange={(e) =>
                                setCurrentChart({
                                  ...currentChart,
                                  height: Number(e.target.value),
                                })
                              }
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="200"
                              max="600"
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={currentChart.showLegend}
                              onChange={(e) =>
                                setCurrentChart({
                                  ...currentChart,
                                  showLegend: e.target.checked,
                                })
                              }
                              className="mr-2"
                            />
                            Show Legend
                          </label>
                          {currentChart.type !== "pie" && (
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={currentChart.showGrid}
                                onChange={(e) =>
                                  setCurrentChart({
                                    ...currentChart,
                                    showGrid: e.target.checked,
                                  })
                                }
                                className="mr-2"
                              />
                              Show Grid
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Data Points */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Data Points</h3>
                        <button
                          onClick={addDataPoint}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        >
                          <Plus size={16} />
                          Add
                        </button>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {currentChart.data.map((point, index) => (
                          <div
                            key={index}
                            className="flex gap-2 items-center p-2 bg-gray-50 rounded"
                          >
                            <input
                              type="text"
                              value={point.name}
                              onChange={(e) =>
                                updateDataPoint(index, "name", e.target.value)
                              }
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="Name"
                            />
                            <input
                              type="number"
                              value={point.value}
                              onChange={(e) =>
                                updateDataPoint(index, "value", e.target.value)
                              }
                              className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="Value"
                            />
                            {currentChart.type === "scatter" && (
                              <>
                                <input
                                  type="number"
                                  value={point.x}
                                  onChange={(e) =>
                                    updateDataPoint(index, "x", e.target.value)
                                  }
                                  className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                                  placeholder="X"
                                />
                                <input
                                  type="number"
                                  value={point.y}
                                  onChange={(e) =>
                                    updateDataPoint(index, "y", e.target.value)
                                  }
                                  className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                                  placeholder="Y"
                                />
                              </>
                            )}
                            <button
                              onClick={() => removeDataPoint(index)}
                              className="text-red-600 hover:text-red-700 p-1"
                              disabled={currentChart.data.length === 1}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Colors</h3>
                        <button
                          onClick={addColor}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        >
                          <Plus size={16} />
                          Add
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {currentChart.colors.map((color, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) =>
                                updateColor(index, e.target.value)
                              }
                              className="w-12 h-8 border border-gray-300 rounded"
                            />
                            <input
                              type="text"
                              value={color}
                              onChange={(e) =>
                                updateColor(index, e.target.value)
                              }
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                            <button
                              onClick={() => removeColor(index)}
                              className="text-red-600 hover:text-red-700 p-1"
                              disabled={currentChart.colors.length === 1}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preview Panel */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Preview</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div
                        style={{
                          width: "100%",
                          height: Math.min(currentChart.height, 300),
                        }}
                      >
                        {renderChart(currentChart)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveChart}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save size={16} />
                    {editingChart ? "Update Chart" : "Create Chart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartBuilder;
