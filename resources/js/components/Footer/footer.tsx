import { Link } from '@inertiajs/react';
import React, { useEffect } from 'react';

export default function Footer() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://images.dmca.com/Badges/DMCABadgeHelper.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <footer className="w-full py-6 px-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 transition-colors duration-200 mt-auto z-10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Copyright © {new Date().getFullYear()} Nadhi.dev
          </p>
          <div className="flex items-center space-x-4">
            {/*<Link
              href={'/privacy-policy'} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href={'https://astral-core.tebex.io/terms-of-service'} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm transition-colors"
            >
              Terms of Service
            </Link>*/}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 md:mt-0">
            ©️ Web Technologies and Frontend by Nadhila Alokabandara. Courses and Resources by Savith Ratanaweera & <b><a href='/team'> Other collaborators </a></b>
          </p>
        </div>
        <div className="mt-4">
          <a
            href="//www.dmca.com/Protection/Status.aspx?ID=8325d56a-0fde-46d4-b3c7-e00fd57859ff"
            title="DMCA.com Protection Status"
            className="dmca-badge"
          >
           
          </a>
        </div>
      </div>
    </footer>
  );
}