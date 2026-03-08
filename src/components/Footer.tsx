const Footer = () => (
  <footer className="py-8 px-6">
    <div className="container mx-auto max-w-5xl">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
      <div className="mt-6 flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
        <p className="font-display gradient-text">Portfolio</p>
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
