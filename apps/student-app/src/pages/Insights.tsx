import { Card } from "@nudle/ui/card";
import { TrendingUp, TrendingDown, AlertCircle, Sparkles } from "lucide-react";
import { Badge } from "@nudle/ui/badge";

export default function Insights() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Insights
        </h1>
        <p className="text-muted-foreground">
          Personalized learning analytics powered by artificial intelligence
        </p>
      </div>

      {/* Performance Prediction */}
      <Card className="p-6 bg-gradient-card border-2 border-primary/30 shadow-glow">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Performance Prediction</h3>
            <p className="text-muted-foreground mb-4">
              Based on your current progress and study patterns, our AI predicts you'll reach{" "}
              <span className="font-bold text-primary">73% average</span> by next term.
            </p>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              +3.1% Improvement Expected
            </Badge>
          </div>
        </div>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-card border-2 border-success/30">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-success/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-success">Top Performing</h3>
              <p className="text-sm text-muted-foreground">Your strongest subjects</p>
            </div>
          </div>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>General Science</span>
              <span className="font-semibold text-success">87.33%</span>
            </li>
            <li className="flex justify-between items-center">
              <span>French</span>
              <span className="font-semibold text-success">85%</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Mathematics</span>
              <span className="font-semibold text-success">78%</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6 bg-gradient-card border-2 border-amber-500/30">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-400">Needs Attention</h3>
              <p className="text-sm text-muted-foreground">Focus areas for improvement</p>
            </div>
          </div>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>English Literature</span>
              <span className="font-semibold text-amber-400">72%</span>
            </li>
            <li className="flex justify-between items-center">
              <span>History</span>
              <span className="font-semibold text-amber-400">68%</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="p-6 bg-gradient-card border-2 border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Personalized Study Recommendations
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="font-medium mb-2">📚 Study Strategy</p>
            <p className="text-sm text-muted-foreground">
              Dedicate 30 minutes daily to English Literature. Focus on essay structure and literary
              analysis techniques to boost your grade.
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="font-medium mb-2">⏰ Time Management</p>
            <p className="text-sm text-muted-foreground">
              You're most productive between 6-8 PM. Schedule difficult subjects during this time for
              maximum retention.
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="font-medium mb-2">🎯 Next Milestone</p>
            <p className="text-sm text-muted-foreground">
              Complete 3 more assignments with scores above 80% to move up to rank 14 in your class.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
