"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  X,
  Users as UsersIcon,
  UserCheck,
  UserX,
  ShieldAlert,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DynamicUsersTable from "./components/DynamicCompaniesTable";

export default function CompanyManagementPage() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedTab, setSelectedTab] = useState<string>("all");

  const [count, setCount] = useState({
    all: 0,
    pending: 0,
    approved: 0,
  });

  return (
    <div className="container mx-auto pb-8 pt-20 px-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Company Management</h1>
        <p className="text-muted-foreground text-sm">
          Manage system companies, adjust LTL and FTL Rates.
        </p>
      </div>

      {/* <div className="bg-slate-50 dark:bg-primary/10 border border-border p-4 rounded-md mb-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-primary">Filter Users</h2>
          <Button
            variant="destructive"
            onClick={() => {
              setSearch("");
              setSelectedRole("all");
            }}
            size="sm"
          >
            <X className="w-4 h-4 mr-1" /> Clear Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground block">
              Search Users (Name, Email, Phone):
            </label>
            <div className="flex w-full">
              <Input
                placeholder="Search by name, email or phone..."
                className="rounded-r-none bg-white dark:bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                type="button"
                className="rounded-l-none bg-primary hover:bg-[#005999] px-3"
              >
                <Search size={16} />
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-muted-foreground block">
              Filter by Role:
            </label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-white dark:bg-background w-full">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div> */}

      {/* Tabs */}
      {/* <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full md:w-max gap-2 bg-white dark:bg-slate-800 border border-blue-200 p-1 mb-6 flex overflow-x-auto no-scrollbar">
          {[
            {
              icon: UsersIcon,
              label: "All Users",
              value: "all",
              count: count.all,
            },
            {
              icon: ShieldAlert,
              label: "Pending Approval",
              value: "pending",
              count: count.pending,
            },
            {
              icon: UserCheck,
              label: "Approved",
              value: "approved",
              count: count.approved,
            },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer data-[state=active]:bg-primary/10 data-[state=active]:border-primary data-[state=active]:border data-[state=active]:text-primary"
            >
              <tab.icon size={16} /> {tab.label} ({tab.count})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <DynamicUsersTable
            search={search}
            roleFilter={selectedRole}
            statusFilter="all"
            setCount={setCount}
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-0">
          <DynamicUsersTable
            search={search}
            roleFilter={selectedRole}
            statusFilter="pending"
            setCount={setCount}
          />
        </TabsContent>
        <TabsContent value="approved" className="mt-0">
          <DynamicUsersTable
            search={search}
            roleFilter={selectedRole}
            statusFilter="approved"
            setCount={setCount}
          />
        </TabsContent>
      </Tabs> */}
      <DynamicUsersTable
        search={search}
        roleFilter={selectedRole}
        statusFilter="all"
        setCount={setCount}
      />
    </div>
  );
}
