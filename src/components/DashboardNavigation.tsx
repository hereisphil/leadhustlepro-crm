
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
import { LayoutDashboard, Table, UserCircle } from "lucide-react";

const DashboardNavigation = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 md:p-6 bg-white border-b">
      <div className="flex items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-leadhustle-blue">
          LeadHustle.pro
        </Link>
      </div>
      
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/dashboard" className="text-gray-800 hover:text-leadhustle-blue font-medium flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link to="/leads" className="text-gray-800 hover:text-leadhustle-blue font-medium flex items-center gap-2">
          <Table className="h-4 w-4" />
          Leads
        </Link>
      </div>
      
      <div>
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
                  {user?.email}
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
      </div>
    </nav>
  );
};

export default DashboardNavigation;
