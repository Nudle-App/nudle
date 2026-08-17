export const Footer = () => {
  return (
    <footer className="border-t border-border/60 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Kleva</p>
        <p>© {new Date().getFullYear()} Kleva. All rights reserved.</p>
      </div>
    </footer>
  );
};
