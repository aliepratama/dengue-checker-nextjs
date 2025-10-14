'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  active: 'home' | 'form';
}

export default function Navbar({ active }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeList = 'flex gap-x-2 py-2 px-3 text-white bg-red-700 rounded md:bg-transparent md:text-red-700 md:p-0 md:dark:text-red-500';
  const regularList = 'flex gap-x-2 py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 md:dark:hover:text-red-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700';

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse w-fit">
          <a
            href="https://uty.ac.id/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/uty_logo.png"
              className="h-10"
              alt="UTY Logo"
            />
          </a>
        </div>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <a
            href="https://github.com/aliepratama/dengue-checker-nextjs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-x-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            <img
              src="/github.svg"
              className="text-white w-5 h-5"
              alt="Github Icon"
            />
            Lihat Repository
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between ${isOpen ? '' : 'hidden'} w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                href="/"
                className={active === 'home' ? activeList : regularList}
                aria-current="page"
              >
                <img
                  src="/house.svg"
                  alt="House Icon"
                  className="w-5 h-5"
                />
                Beranda
              </Link>
            </li>
            <li>
              <Link
                href="/form"
                className={active === 'form' ? activeList : regularList}
                aria-current="page"
              >
                <img
                  src="/scan-search.svg"
                  alt="Form Icon"
                  className="w-5 h-5"
                />
                Periksa
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
