import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { LinksFunction, MetaFunction } from "remix";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import {
  ChakraProvider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import React from "react";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "icon", href: "/favicon.png" },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Fetch Coding Exercise",
  viewport: "width=device-width,initial-scale=1",
});

function DrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button ref={btnRef} colorScheme="whiteAlpha" onClick={onOpen}>
        <span className="sr-only">Open main menu</span>
        <svg
          className="h-6 w-6 text-black"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <svg
          className="hidden h-6 w-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Fetch Rewards Coding Exercise</DrawerHeader>
          <DrawerBody>
            <NavLink
              reloadDocument
              className="block font-medium"
              to="/points/balances"
            >
              {({ isActive }) => (
                <span className={isActive ? "underline" : undefined}>
                  Get Balances
                </span>
              )}
            </NavLink>
            <NavLink
              reloadDocument
              className="block font-medium"
              to="/points/add"
            >
              {({ isActive }) => (
                <span className={isActive ? "underline" : undefined}>
                  Add Points
                </span>
              )}
            </NavLink>
            <NavLink
              reloadDocument
              className="block font-medium"
              to="/points/spend"
            >
              {({ isActive }) => (
                <span className={isActive ? "underline" : undefined}>
                  Spend Points
                </span>
              )}
            </NavLink>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default function App() {
  return (
    <html lang="en" className="">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="">
        <ChakraProvider>
          <header>
            <nav className="rounded border-b border-gray-200 bg-white px-2  py-4 sm:px-6">
              <div className="container mx-auto flex flex-wrap items-center justify-between text-[#2f0c38]">
                <Link to="/" className="flex items-center">
                  <img
                    src="https://fetchrewards.com/assets/images/logos/header-logo@2x.png"
                    className="mr-3 h-9 sm:h-12"
                    alt="Flowbite Logo"
                  />
                </Link>
                <NavLink
                  className="hidden text-base font-bold md:block lg:text-lg"
                  to="/points/balances"
                >
                  {({ isActive }) => (
                    <span className={isActive ? "underline" : undefined}>
                      Get Balances
                    </span>
                  )}
                </NavLink>
                <NavLink
                  className="hidden text-base font-bold md:block lg:text-lg"
                  to="/points/add"
                >
                  {({ isActive }) => (
                    <span className={isActive ? "underline" : undefined}>
                      Add Points
                    </span>
                  )}
                </NavLink>
                <NavLink
                  className="hidden text-base font-bold md:block lg:text-lg"
                  to="/points/spend"
                >
                  {({ isActive }) => (
                    <span className={isActive ? "underline" : undefined}>
                      Spend Points
                    </span>
                  )}
                </NavLink>
                <div className="flex md:order-2 ">
                  <a
                    href="https://github.com/sbleks/fetch-coding-exercise"
                    className="mr-3 flex items-center gap-2 rounded-lg bg-[#2f0c38] px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:px-5 sm:py-2.5 md:mr-0"
                  >
                    <span className="hidden sm:block">See code on Github</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 256 250"
                      className="h-5 text-white"
                    >
                      <path
                        fill="currentColor"
                        d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46c6.397 1.185 8.746-2.777 8.746-6.158c0-3.052-.12-13.135-.174-23.83c-35.61 7.742-43.124-15.103-43.124-15.103c-5.823-14.795-14.213-18.73-14.213-18.73c-11.613-7.944.876-7.78.876-7.78c12.853.902 19.621 13.19 19.621 13.19c11.417 19.568 29.945 13.911 37.249 10.64c1.149-8.272 4.466-13.92 8.127-17.116c-28.431-3.236-58.318-14.212-58.318-63.258c0-13.975 5-25.394 13.188-34.358c-1.329-3.224-5.71-16.242 1.24-33.874c0 0 10.749-3.44 35.21 13.121c10.21-2.836 21.16-4.258 32.038-4.307c10.878.049 21.837 1.47 32.066 4.307c24.431-16.56 35.165-13.12 35.165-13.12c6.967 17.63 2.584 30.65 1.255 33.873c8.207 8.964 13.173 20.383 13.173 34.358c0 49.163-29.944 59.988-58.447 63.157c4.591 3.972 8.682 11.762 8.682 23.704c0 17.126-.148 30.91-.148 35.126c0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002C256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39c-.929-.417-1.45-1.284-1.15-1.922c.276-.655 1.279-.838 2.205-.399c.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591c-.837-.892-.994-2.086-.375-2.66c.63-.566 1.787-.301 2.626.591c.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104c-.784-1.138-.784-2.503.017-3.05c.795-.547 2.058-.055 2.861 1.075c.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49c-1.119-1.032-1.43-2.496-.726-3.27c.71-.776 2.213-.558 3.315.49c1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033c-1.448-.439-2.395-1.613-2.103-2.626c.301-1.01 1.747-1.484 3.207-1.028c1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95c-1.53.034-2.769-.82-2.786-1.86c0-1.065 1.202-1.932 2.733-1.958c1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37c-1.485.271-2.861-.365-3.05-1.386c-.184-1.056.893-2.114 2.376-2.387c1.514-.263 2.868.356 3.061 1.403Z"
                      />
                    </svg>
                  </a>
                  <div className="block md:hidden">
                    <DrawerExample />
                  </div>
                </div>
              </div>
            </nav>
          </header>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </ChakraProvider>
      </body>
    </html>
  );
}
