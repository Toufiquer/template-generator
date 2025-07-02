/*
|-----------------------------------------
| setting up MenuBarNextComponent for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/

import Link from 'next/link';

import { ModeToggle } from '../mode-toggle';

const MenuBarNextComponent = () => {
  return (
    <main className="centralized-center divide-accent divide-x-2 flex-wrap gap-4">
      <Link className="px-4" href="/">
        Home
      </Link>
      <Link className="px-4" href="/test">
        Test
      </Link>
      <Link className="px-4" href="/template-generator">
        Template Genereator
      </Link>
      <Link className="px-4" href="/doc">
        Doc
      </Link>
      <Link className="px-4" href="/design">
        Design
      </Link>
      <Link className="px-4" href="/dashboard/template-demo/all">
        Template Demo
      </Link>
      <div className="px-4">
        <ModeToggle />
      </div>
    </main>
  );
};
export default MenuBarNextComponent;
