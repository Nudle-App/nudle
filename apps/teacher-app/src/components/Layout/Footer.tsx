import nudleLogo from "@/assets/nudle-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <img 
              src={nudleLogo} 
              alt="Nudle Logo" 
              className="h-10 w-auto"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">Nudle</p>
              <p className="text-xs text-muted-foreground">AI-Powered Education Management</p>
              <p className="text-xs text-muted-foreground mt-1">Building the future of education</p>
            </div>
          </div>
          <div className="text-center md:text-right text-xs text-muted-foreground">
            <p className="font-medium">© {new Date().getFullYear()} Nudle. All rights reserved.</p>
            <p className="mt-1">Transforming education through AI innovation</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
