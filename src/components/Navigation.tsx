
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";

const Navigation = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 md:p-6">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-leadhustle-blue">
          LeadHustle.pro
        </Link>
      </div>
      
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/" className="text-gray-800 hover:text-leadhustle-blue font-medium">
          Home
        </Link>
        <Link to="/features" className="text-gray-800 hover:text-leadhustle-blue font-medium">
          Features
        </Link>
        <Link to="/testimonials" className="text-gray-800 hover:text-leadhustle-blue font-medium">
          Testimonials
        </Link>
        <Link to="/faq" className="text-gray-800 hover:text-leadhustle-blue font-medium">
          FAQ
        </Link>
        <Link to="/contact" className="text-gray-800 hover:text-leadhustle-blue font-medium">
          Contact
        </Link>
      </div>
      
      <div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <UserCircle className="h-8 w-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">My Account</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/dashboard" className="w-full">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/profile" className="w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={() => signOut()}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/auth">
              <Button variant="outline" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-leadhustle-blue hover:bg-leadhustle-darkBlue text-white">
                Start Free Trial
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
