import { useState } from "react";
import { Upload, Download, FileText, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Button } from "@nudle/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nudle/ui/table";
import { useToast } from "@nudle/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ReportCards = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const generatedReports = [
    { id: 1, name: "Q1 2024 Report Cards", date: "2024-03-15", students: 45, status: "completed" },
    { id: 2, name: "Q2 2024 Report Cards", date: "2024-06-20", students: 48, status: "completed" },
    { id: 3, name: "Q3 2024 Report Cards", date: "2024-09-18", students: 46, status: "completed" },
  ];

  // AI-generated performance data
  const performanceData = [
    { month: "Jan", average: 78, excellence: 85, improvement: 72 },
    { month: "Feb", average: 81, excellence: 88, improvement: 75 },
    { month: "Mar", average: 83, excellence: 90, improvement: 78 },
    { month: "Apr", average: 80, excellence: 87, improvement: 76 },
    { month: "May", average: 85, excellence: 92, improvement: 82 },
    { month: "Jun", average: 87, excellence: 94, improvement: 84 },
    { month: "Jul", average: 86, excellence: 93, improvement: 83 },
    { month: "Aug", average: 88, excellence: 95, improvement: 86 },
    { month: "Sep", average: 90, excellence: 96, improvement: 88 },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} is ready to process`,
      });
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  const handleGenerateReports = () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a CSV file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Report cards generated!",
        description: `Successfully generated report cards for all students`,
      });
      setUploadedFile(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Report Card Generator</h1>
        <p className="text-muted-foreground">Upload student data and generate comprehensive report cards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
              <FileText className="h-5 w-5 text-accent-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">139</p>
            <p className="text-sm text-muted-foreground mt-1">Generated this year</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <FileText className="h-5 w-5 text-accent-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">0</p>
            <p className="text-sm text-muted-foreground mt-1">All reports completed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Last Generated</p>
              <CheckCircle className="h-5 w-5 text-accent-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">3 days</p>
            <p className="text-sm text-muted-foreground mt-1">ago</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                AI-Generated Performance Insights
              </CardTitle>
              <CardDescription>Student performance trends analyzed by AI over the academic year</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Class Average"
                dot={{ fill: 'hsl(var(--primary))' }}
              />
              <Line 
                type="monotone" 
                dataKey="excellence" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                name="Top Performers"
                dot={{ fill: 'hsl(var(--secondary))' }}
              />
              <Line 
                type="monotone" 
                dataKey="improvement" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                name="Most Improved"
                dot={{ fill: 'hsl(var(--accent))' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">AI Insight:</span> Overall performance has shown consistent improvement, with a 15% increase in class average since January. Top performers maintain excellence above 85%, while the most improved group shows strong upward trajectory.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Student Data</CardTitle>
          <CardDescription>
            Upload a CSV file containing student grades and information to generate report cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center space-y-4">
            <div className="flex justify-center">
              <Upload className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Upload CSV File</h3>
              <p className="text-sm text-muted-foreground mb-4">
                File should include: Student Name, ID, Course, Grade, Comments
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button asChild variant="outline">
                  <span className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
            </div>
            {uploadedFile && (
              <div className="flex items-center justify-center gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <span>{uploadedFile.name}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" disabled={!uploadedFile}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            <Button 
              onClick={handleGenerateReports} 
              disabled={!uploadedFile || isProcessing}
            >
              {isProcessing ? "Generating..." : "Generate Report Cards"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Report Cards</CardTitle>
          <CardDescription>View and download previously generated report cards</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Date Generated</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generatedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.students} students</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span className="capitalize">{report.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCards;
