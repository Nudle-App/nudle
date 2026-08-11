import { TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { Badge } from "@nudle/ui/badge";

export default function Insights() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-muted-foreground" />
          AI Insights
        </h1>
        <p className="page-subtitle mt-1">
          Personalized learning analytics powered by artificial intelligence
        </p>
      </div>

      <section className="surface-card p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-muted shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-2">Performance Prediction</h3>
            <p className="text-muted-foreground mb-4">
              Based on your current progress and study patterns, our AI predicts you&apos;ll
              reach <span className="font-semibold text-foreground">73% average</span> by next
              term.
            </p>
            <Badge variant="secondary" className="rounded-full">
              +3.1% Improvement Expected
            </Badge>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <section className="surface-card p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="p-2.5 rounded-full bg-success/15 shrink-0">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-success">Top Performing</h3>
              <p className="text-sm text-muted-foreground">Your strongest subjects</p>
            </div>
          </div>
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-sm">
              <span>General Science</span>
              <Badge variant="secondary" className="rounded-full text-success">
                87.33%
              </Badge>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>French</span>
              <Badge variant="secondary" className="rounded-full text-success">
                85%
              </Badge>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Mathematics</span>
              <Badge variant="secondary" className="rounded-full text-success">
                78%
              </Badge>
            </li>
          </ul>
        </section>

        <section className="surface-card p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="p-2.5 rounded-full bg-amber-500/15 shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-700 dark:text-amber-400">
                Needs Attention
              </h3>
              <p className="text-sm text-muted-foreground">Focus areas for improvement</p>
            </div>
          </div>
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-sm">
              <span>English Literature</span>
              <Badge variant="secondary" className="rounded-full">
                72%
              </Badge>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>History</span>
              <Badge variant="secondary" className="rounded-full">
                68%
              </Badge>
            </li>
          </ul>
        </section>
      </div>

      <section className="surface-card p-6">
        <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-muted-foreground" />
          Personalized Study Recommendations
        </h3>
        <div className="space-y-3">
          <div className="p-4 rounded-2xl border border-border/80 bg-muted/30">
            <p className="font-medium mb-1.5">Study Strategy</p>
            <p className="text-sm text-muted-foreground">
              Dedicate 30 minutes daily to English Literature. Focus on essay structure and
              literary analysis techniques to boost your grade.
            </p>
          </div>
          <div className="p-4 rounded-2xl border border-border/80 bg-muted/30">
            <p className="font-medium mb-1.5">Time Management</p>
            <p className="text-sm text-muted-foreground">
              You&apos;re most productive between 6–8 PM. Schedule difficult subjects during this
              time for maximum retention.
            </p>
          </div>
          <div className="p-4 rounded-2xl border border-border/80 bg-muted/30">
            <p className="font-medium mb-1.5">Next Milestone</p>
            <p className="text-sm text-muted-foreground">
              Complete 3 more assignments with scores above 80% to move up to rank 14 in your
              class.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
