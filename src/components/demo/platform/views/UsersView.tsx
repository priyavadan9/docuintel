import { 
  Users,
  UserPlus,
  Shield,
  MoreHorizontal,
  Mail,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const users = [
  { id: 1, name: "John Doe", email: "john@company.com", role: "admin", status: "active", lastActive: "2 minutes ago" },
  { id: 2, name: "Jane Smith", email: "jane@company.com", role: "user", status: "active", lastActive: "15 minutes ago" },
  { id: 3, name: "Bob Johnson", email: "bob@company.com", role: "auditor", status: "active", lastActive: "1 hour ago" },
  { id: 4, name: "Alice Brown", email: "alice@company.com", role: "user", status: "inactive", lastActive: "2 days ago" },
  { id: 5, name: "Charlie Wilson", email: "charlie@company.com", role: "user", status: "active", lastActive: "30 minutes ago" },
];

const roleColors = {
  admin: "bg-primary/10 text-primary border-primary/30",
  user: "bg-info/10 text-info border-info/30",
  auditor: "bg-warning/10 text-warning border-warning/30",
};

export function UsersView() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <Users className="h-10 w-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-3xl font-bold">{users.filter(u => u.role === "admin").length}</p>
              </div>
              <Shield className="h-10 w-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="text-3xl font-bold">{users.filter(u => u.status === "active").length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Invites</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <Mail className="h-10 w-10 text-warning/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map((user) => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name}</p>
                      {user.status === "active" && (
                        <span className="h-2 w-2 rounded-full bg-success" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={cn(roleColors[user.role as keyof typeof roleColors], "capitalize")}>
                    {user.role}
                  </Badge>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground w-32">
                    <Clock className="h-3 w-3" />
                    {user.lastActive}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem>View Activity</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { role: "Admin", permissions: ["Full system access", "User management", "Settings & config", "All document operations", "Analytics & reports"] },
              { role: "Operations User", permissions: ["Upload documents", "View & edit documents", "Use document chat", "View own analytics"] },
              { role: "Auditor", permissions: ["Read-only access", "View all documents", "Access audit logs", "View analytics", "Export reports"] },
            ].map((r) => (
              <div key={r.role} className="p-4 rounded-lg bg-secondary/30">
                <h4 className="font-medium mb-3">{r.role}</h4>
                <ul className="space-y-2">
                  {r.permissions.map((p, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
