
import { useState, useRef, useEffect } from "react";
import { Atom } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { toast } from "sonner";

// Import refactored components
import { PredictionForm } from "./stock-predictor/PredictionForm";
import { FileUploadSection } from "./stock-predictor/FileUploadSection";
import { ResultSection } from "./stock-predictor/ResultSection";
import { StockPredictorHeader } from "./stock-predictor/StockPredictorHeader";
import { PredictionData, StockPredictorProps, PredictionResult } from "./stock-predictor/types";

export const StockPredictor = ({ products }: StockPredictorProps) => {
  // Get current date and default end date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate default end date (30 days from today)
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 30);
  const defaultEndDateStr = defaultEndDate.toISOString().split('T')[0];

  const [predictionData, setPredictionData] = useState<PredictionData>({
    date: today,
    product_id: 0,
    current_stock: 0,
    previous_sales: 0,
    price: 0,
    custom_product: "",
    is_custom_product: false,
    start_date: today,
    end_date: defaultEndDateStr
  });
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [previousResults, setPreviousResults] = useState<PredictionResult[]>([]);
  
  // Reference to the results section for scrolling
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Effect to scroll to results when they appear - with slower animation
  useEffect(() => {
    if ((predictionResult || aiAnalysis) && resultsRef.current) {
      // Delayed to ensure components are fully rendered
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 300); // Increased delay for smoother transition
    }
  }, [predictionResult, aiAnalysis]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
        toast.error("Please upload a CSV file");
        return;
      }
      
      setLoading(true);
      
      // Simulate CSV data parsing and set some default values
      setTimeout(() => {
        // Save current prediction to history if there is one
        if (predictionResult && aiAnalysis) {
          saveCurrentPredictionToHistory();
        }
        
        // Set random values if uploading a file
        setPredictionData({
          ...predictionData,
          current_stock: Math.floor(Math.random() * 50) + 20,
          previous_sales: Math.floor(Math.random() * 30) + 10,
          price: Math.floor(Math.random() * 1000) + 100,
          custom_product: "Imported Product",
          is_custom_product: true
        });
        setAiAnalysis(true);
        setLoading(false);
        toast.success("File uploaded successfully", {
          description: "Your product data has been processed and analyzed",
        });
      }, 1500);
      
      // Reset the file input
      e.target.value = '';
    }
  };

  const isFormComplete = () => {
    if (predictionData.is_custom_product) {
      return (
        predictionData.date !== "" &&
        predictionData.custom_product.trim() !== "" &&
        predictionData.current_stock > 0 &&
        predictionData.previous_sales >= 0 &&
        predictionData.price > 0 &&
        predictionData.start_date !== "" &&
        predictionData.end_date !== ""
      );
    }
    
    return (
      predictionData.date !== "" &&
      predictionData.product_id !== 0 &&
      predictionData.current_stock > 0 &&
      predictionData.previous_sales >= 0 &&
      predictionData.price > 0 &&
      predictionData.start_date !== "" &&
      predictionData.end_date !== ""
    );
  };

  // Save current prediction to history
  const saveCurrentPredictionToHistory = () => {
    if (predictionResult && aiAnalysis) {
      const currentDate = new Date();
      const restockDate = new Date(currentDate);
      restockDate.setDate(currentDate.getDate() + 21);
      
      const reviewDate = new Date(currentDate);
      reviewDate.setDate(currentDate.getDate() + 15);
      
      const nextAnalysisDate = new Date(currentDate);
      nextAnalysisDate.setDate(currentDate.getDate() + 30);
      
      const currentPrediction: PredictionResult = {
        text: predictionResult,
        timestamp: new Date().toISOString(),
        restockDate: restockDate,
        reviewDate: reviewDate,
        nextAnalysisDate: nextAnalysisDate,
        predictionPeriod: `${new Date(predictionData.start_date!).toLocaleDateString()} - ${new Date(predictionData.end_date!).toLocaleDateString()}`
      };
      
      setPreviousResults(prev => [currentPrediction, ...prev]);
    }
  };

  const handleGeneratePrediction = () => {
    if (!isFormComplete()) {
      toast.error("Please fill in all fields", {
        description: "All fields are required to generate an accurate prediction",
      });
      return;
    }
    
    // Check if end date is after start date
    if (new Date(predictionData.end_date!) < new Date(predictionData.start_date!)) {
      toast.error("End date must be after start date");
      return;
    }

    // Save current prediction to history if there is one
    if (predictionResult && aiAnalysis) {
      saveCurrentPredictionToHistory();
    }

    // Mock prediction logic with longer loading time for smoother experience
    setLoading(true);
    setTimeout(() => {
      // Calculate days between start and end date
      const startDate = new Date(predictionData.start_date!);
      const endDate = new Date(predictionData.end_date!);
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Adjust prediction based on date range
      const dailyRate = predictionData.previous_sales / 30; // Assuming previous sales is for 30 days
      const predictedSales = Math.ceil(dailyRate * daysDiff * 1.2);
      const recommendedStock = Math.ceil(dailyRate * daysDiff * 1.5);
      
      const newPredictionResult = `Based on historical data and current trends, we predict sales of ${predictedSales} units from ${new Date(predictionData.start_date!).toLocaleDateString()} to ${new Date(predictionData.end_date!).toLocaleDateString()} (${daysDiff} days). Consider stocking at least ${recommendedStock} units to maintain optimal inventory levels during this period.`;
      
      setPredictionResult(newPredictionResult);
      setAiAnalysis(true);
      setLoading(false);
      toast.success("Prediction generated", {
        description: "AI has analyzed your data and provided predictions",
      });
    }, 2000); // Increased to 2 seconds for more noticeable effect
  };

  const currentDate = new Date();
  const restockDate = new Date(currentDate);
  restockDate.setDate(currentDate.getDate() + 21);
  
  const reviewDate = new Date(currentDate);
  reviewDate.setDate(currentDate.getDate() + 15);
  
  const nextAnalysisDate = new Date(currentDate);
  nextAnalysisDate.setDate(currentDate.getDate() + 30);

  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm">
      <StockPredictorHeader />

      <div className="bg-background rounded-lg p-6">
        <PredictionForm 
          predictionData={predictionData}
          setPredictionData={setPredictionData}
          products={products}
        />

        <Button
          onClick={handleGeneratePrediction}
          className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white mt-6"
          disabled={loading || !isFormComplete()}
        >
          <Atom className="mr-2 h-4 w-4" />
          {loading ? "Generating..." : "Generate Prediction"}
        </Button>

        <div className="text-center text-muted-foreground my-4">OR</div>

        <FileUploadSection 
          handleFileUpload={handleFileUpload}
          loading={loading}
        />

        <div ref={resultsRef} className="scroll-mt-16">
          <ResultSection 
            predictionResult={predictionResult}
            aiAnalysis={aiAnalysis}
            restockDate={restockDate}
            reviewDate={reviewDate}
            nextAnalysisDate={nextAnalysisDate}
            predictionData={predictionData}
            previousResults={previousResults}
          />
        </div>
      </div>
    </div>
  );
};
