import React from "react";
import { Link } from "react-router-dom";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import { useDispatch } from "react-redux";
import { clearCookie, logout } from "@/state/auth/AuthSlice";

const Navbar: React.FC = () => {
  const dispatch = useDispatch()
  return (
    <nav className="flex w-full h-full items-center justify-between  px-4 py-2 ">
      <Link to="/" className="flex gap-[1px]  dark:gap-0 items-center">
        <img src="/scrapy-allobaba.png" alt="Scrapy" className="h-10" />
        <span className="text-2xl dark:text-xl font-bold relative dark:right-1">
          crapy
        </span>
      </Link>
      {/* <NavLink to='/'>Menu</NavLink> */}
      <div className="flex gap-2 items-center">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <span className="sr-only">Menu</span>
              scrapy pages
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link to="/scrapy/autoscout24">
              <DropdownMenuItem>AutoScout24</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link to="/scrapy/orange">
              <DropdownMenuItem>Orange</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link to="/scrapy/pagesjaunes">
              <DropdownMenuItem>PagesJaunes</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-center items-center">
              <Button className="h-10 w-full bg-red-500 hover:bg-red-600 text-secondary dark:text-white " onClick={() => {
                dispatch(clearCookie())
                dispatch(logout())
              }}>Logout</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
