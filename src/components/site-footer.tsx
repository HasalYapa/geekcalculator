import { Icons } from './icons';

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Made for Geeks by a friendly AI.
        </p>
        <a
            href="https://github.com/FirebaseExtended/ai-apps"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            <Icons.github className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </a>
      </div>
    </footer>
  );
}
