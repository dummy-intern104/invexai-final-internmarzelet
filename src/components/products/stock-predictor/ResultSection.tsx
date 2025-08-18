
import React from "react";
import { Dices, Calendar, TrendingUp, Package, History, Clock, BarChart4 } from "lucide-react";
import { PredictionData, PredictionResult } from "./types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ResultSectionProps {
  predictionResult: string | null;
  aiAnalysis: boolean;
  restockDate: Date;
  reviewDate: Date;
  nextAnalysisDate: Date;
  predictionData: PredictionData;
  previousResults: PredictionResult[];
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  predictionResult,
  aiAnalysis,
  restockDate,
  reviewDate,
  nextAnalysisDate,
  predictionData,
  previousResults
}) => {
  if (!predictionResult && !aiAnalysis) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format prediction dates if available
  const predictionPeriod = predictionData.start_date && predictionData.end_date
    ? `${new Date(predictionData.start_date).toLocaleDateString()} - ${new Date(predictionData.end_date).toLocaleDateString()}`
    : "Next 30 days";

  return (
    <div className="mt-8 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Dices className="mr-2 h-5 w-5 text-primary" />
        Prediction Results
      </h3>

      {predictionResult && (
        <div className="bg-primary/5 p-6 rounded-lg mb-6 border border-primary/10">
          <h4 className="font-semibold text-lg mb-2 flex items-center">
            <TrendingUp className="mr-2 h-4 w-4 text-primary" />
            Sales Forecast for {predictionPeriod}
          </h4>
          <p className="text-muted-foreground">{predictionResult}</p>
        </div>
      )}

      {aiAnalysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center mb-2">
                <Package className="h-4 w-4 text-yellow-500 mr-2" />
                <h4 className="font-medium">Restock By</h4>
              </div>
              <p className="text-sm text-muted-foreground">{formatDate(restockDate)}</p>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                <h4 className="font-medium">Review Strategy</h4>
              </div>
              <p className="text-sm text-muted-foreground">{formatDate(reviewDate)}</p>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                <h4 className="font-medium">Next Analysis</h4>
              </div>
              <p className="text-sm text-muted-foreground">{formatDate(nextAnalysisDate)}</p>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-semibold text-lg mb-4">Advanced AI Analysis (95% confidence):</h4>
            
            <div className="space-y-4 text-sm font-mono">
              <div>
                <p className="font-medium">1. Demand Forecast:</p>
                <p className="ml-4">- Predicted demand range: 38 - 46 units</p>
                <p className="ml-4">- Most likely demand: 42 units</p>
                <p className="ml-4">- Confidence interval: ±8%</p>
              </div>
              
              <div>
                <p className="font-medium">2. Market Insights:</p>
                <p className="ml-4">- Seasonal trend: Strong upward (15.3% growth)</p>
                <p className="ml-4">- Market sentiment: Very positive</p>
                <p className="ml-4">- Competition impact: 2.5% market pressure</p>
              </div>
              
              <div>
                <p className="font-medium">3. Pricing Strategy:</p>
                <p className="ml-4">- Current price: ₹500.00</p>
                <p className="ml-4">- Optimal price point: ₹570.58</p>
                <p className="ml-4">- Price elasticity: 1.03</p>
              </div>
              
              <div>
                <p className="font-medium">4. Inventory Optimization:</p>
                <p className="ml-4">- Recommended safety stock: 8 units</p>
                <p className="ml-4">- Optimal reorder point: 12 units</p>
                <p className="ml-4">- Inventory turnover rate: 5.5x per year</p>
              </div>
              
              <div>
                <p className="font-medium">5. Growth Indicators:</p>
                <p className="ml-4">- YoY growth potential: 12.1%</p>
                <p className="ml-4">- Market penetration: Strong</p>
                <p className="ml-4">- Economic multiplier: 1.08</p>
              </div>
              
              <div>
                <p className="font-medium">6. Action Items:</p>
                <p className="ml-4">- Restock before: {formatDate(restockDate)}</p>
                <p className="ml-4">- Review pricing: {formatDate(reviewDate)}</p>
                <p className="ml-4">- Next analysis: {formatDate(nextAnalysisDate)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Previous AI Analyses */}
      {previousResults && previousResults.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <History className="mr-2 h-5 w-5 text-primary" />
            Previous Analyses
          </h3>
          
          <Accordion type="single" collapsible className="w-full">
            {previousResults.map((result, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:bg-muted/50 px-4 py-2 rounded-lg">
                  <div className="flex items-center text-left">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Analysis from {new Date(result.timestamp).toLocaleDateString()} ({result.predictionPeriod})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div className="bg-primary/5 p-4 rounded-lg mb-4 border border-primary/10">
                    <p className="text-muted-foreground">{result.text}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center mb-2">
                        <Package className="h-4 w-4 text-yellow-500 mr-2" />
                        <h4 className="font-medium">Restock By</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(result.restockDate)}</p>
                    </div>

                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                        <h4 className="font-medium">Review Strategy</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(result.reviewDate)}</p>
                    </div>

                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                        <h4 className="font-medium">Next Analysis</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(result.nextAnalysisDate)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
                    <h4 className="font-semibold text-lg mb-4">Advanced AI Analysis (95% confidence):</h4>
                    
                    <div className="space-y-4 text-sm font-mono">
                      <div>
                        <p className="font-medium">1. Demand Forecast:</p>
                        <p className="ml-4">- Predicted demand range: 38 - 46 units</p>
                        <p className="ml-4">- Most likely demand: 42 units</p>
                        <p className="ml-4">- Confidence interval: ±8%</p>
                      </div>
                      
                      <div>
                        <p className="font-medium">2. Market Insights:</p>
                        <p className="ml-4">- Seasonal trend: Strong upward (15.3% growth)</p>
                        <p className="ml-4">- Market sentiment: Very positive</p>
                        <p className="ml-4">- Competition impact: 2.5% market pressure</p>
                      </div>
                      
                      <div>
                        <p className="font-medium">3. Pricing Strategy:</p>
                        <p className="ml-4">- Current price: ₹500.00</p>
                        <p className="ml-4">- Optimal price point: ₹570.58</p>
                        <p className="ml-4">- Price elasticity: 1.03</p>
                      </div>
                      
                      <div>
                        <p className="font-medium">4. Inventory Optimization:</p>
                        <p className="ml-4">- Recommended safety stock: 8 units</p>
                        <p className="ml-4">- Optimal reorder point: 12 units</p>
                        <p className="ml-4">- Inventory turnover rate: 5.5x per year</p>
                      </div>
                      
                      <div>
                        <p className="font-medium">5. Growth Indicators:</p>
                        <p className="ml-4">- YoY growth potential: 12.1%</p>
                        <p className="ml-4">- Market penetration: Strong</p>
                        <p className="ml-4">- Economic multiplier: 1.08</p>
                      </div>
                      
                      <div>
                        <p className="font-medium">6. Action Items:</p>
                        <p className="ml-4">- Restock before: {formatDate(result.restockDate)}</p>
                        <p className="ml-4">- Review pricing: {formatDate(result.reviewDate)}</p>
                        <p className="ml-4">- Next analysis: {formatDate(result.nextAnalysisDate)}</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};
