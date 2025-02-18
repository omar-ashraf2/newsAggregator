/**
 * Footer.tsx
 *
 * A footer with social links and a copyright notice.
 */

import { memo } from "react";

const Footer = memo(() => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-4 flex flex-col-reverse sm:flex-row gap-4 justify-between items-center">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="text-[#811211]">NexaNews</span>. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a
            href="https://github.com/omar-ashraf2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.234c-3.338.727-4.033-1.61-4.033-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.087-.744.084-.73.084-.73 1.205.084 1.84 1.24 1.84 1.24 1.07 1.84 2.805 1.31 3.49.997.107-.774.42-1.31.762-1.61-2.665-.307-5.467-1.33-5.467-5.93 0-1.31.465-2.382 1.235-3.22-.123-.307-.536-1.54.117-3.205 0 0 1.01-.324 3.3 1.23a11.51 11.51 0 0 1 3-.405c1.02.005 2.04.14 3 .405 2.29-1.554 3.3-1.23 3.3-1.23.653 1.665.24 2.898.117 3.205.77.838 1.235 1.91 1.235 3.22 0 4.61-2.805 5.62-5.478 5.92.43.37.823 1.102.823 2.222v3.293c0 .32.193.693.8.575 4.76-1.587 8.19-6.085 8.19-11.387C24 5.67 18.63.297 12 .297z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/omar-ashraf-338580182/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22.23 0H1.77C.79 0 0 .775 0 1.733V22.26c0 .96.79 1.74 1.77 1.74h20.46c.98 0 1.77-.78 1.77-1.74V1.732C24 .775 23.21 0 22.23 0zM7.12 20.452H3.56V8.987h3.56v11.465zM5.34 7.38c-1.12 0-2.03-.91-2.03-2.04s.91-2.04 2.03-2.04c1.12 0 2.03.91 2.03 2.04s-.91 2.04-2.03 2.04zm14.99 13.072h-3.56v-5.58c0-1.33-.02-3.06-1.86-3.06-1.86 0-2.14 1.45-2.14 2.96v5.68h-3.56V8.987h3.42v1.56h.05c.48-.92 1.65-1.89 3.4-1.89 3.64 0 4.31 2.39 4.31 5.5v6.295z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
