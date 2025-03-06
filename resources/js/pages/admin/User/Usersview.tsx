import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { 
  User,
  Search,
  Trash2,
  Edit,
  Shield,
  ShieldAlert,
  Users as UsersIcon,
  Ban,
  Check,
  X,
  Filter,
  RefreshCw
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pagination } from '@/components/ui/pagination';

import { Switch } from '@/components/ui/switch';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'admin',
        href: '/admin',
    },
    {
        title: 'users',
        href: '/admin/users',
    },
];

export default function Usersview({ users, filters }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showBanned, setShowBanned] = useState(filters.banned === "true");
  const [showAdmins, setShowAdmins] = useState(filters.admins === "true");
  const [showTeams, setShowTeams] = useState(filters.teams === "true");

  const { data, setData, put, processing, errors, reset } = useForm({
    name: '',
    email: '',
    level: 0,
    description: '',
    is_admin: false,
    is_team: false,
    ban: false,
  });

  const openEditDialog = (user) => {
    setUserToEdit(user);
    setData({
      name: user.name,
      email: user.email,
      level: user.level || 0,
      description: user.description || '',
      is_admin: user.is_admin || false,
      is_team: user.is_team || false,
      ban: user.ban || false,
    });
    setIsEditDialogOpen(true);
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('admin.users.update.new', userToEdit.id), {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        toast({
          title: "User updated",
          description: `${data.name}'s information has been updated successfully.`,
        });
      }
    });
  };

  const deleteUser = () => {
    if (!userToDelete) return;
    
    router.delete(route('admin.users.destroy', userToDelete.id))
      .then(() => {
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
        /*toast({
          title: "User deleted",
          description: `${userToDelete.name} has been deleted successfully.`,
          variant: "destructive"
        });*/
        window.location.reload();
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleQuickAction = (user, action) => {
    const userData = {
      name: user.name,
      email: user.email,
      level: user.level || 0,
      description: user.description || '',
      is_admin: user.is_admin || false,
      is_team: user.is_team || false,
      ban: user.ban || false,
    };

    switch(action) {
      case 'toggle-ban':
        userData.ban = !user.ban;
        break;
      case 'make-admin':
        userData.is_admin = true;
        break;
      case 'remove-admin':
        userData.is_admin = false;
        break;
      case 'make-team':
        userData.is_team = true;
        break;
      case 'remove-team':
        userData.is_team = false;
        break;
    }

    router.put(route('admin.users.update.new', user.id), userData)
      .then(() => {
        let message = '';
        switch(action) {
          case 'toggle-ban':
            message = userData.ban ? `${user.name} has been banned.` : `${user.name} has been unbanned.`;
            break;
          case 'make-admin':
            message = `${user.name} is now an admin.`;
            break;
          case 'remove-admin':
            message = `${user.name} is no longer an admin.`;
            break;
          case 'make-team':
            message = `${user.name} is now a team member.`;
            break;
          case 'remove-team':
            message = `${user.name} is no longer a team member.`;
            break;
        }

        /*toast({
          title: "User updated",
          description: message,
        });*/
        
        // Reload after a small delay to show toast
        setTimeout(() => window.location.reload(), 1000);
      });
  };

  const applyFilters = () => {
    window.location.href = route('admin.users.index', {
      search: searchQuery,
      banned: showBanned ? "true" : "false",
      admins: showAdmins ? "true" : "false",
      teams: showTeams ? "true" : "false"
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setShowBanned(false);
    setShowAdmins(false);
    setShowTeams(false);
    window.location.href = route('admin.users.index');
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title="Users Management" />

      <div className="flex flex-col gap-6">
        <div className='px-4 py-4'>
            <DashboardCard/>
        </div>
        <div className="flex justify-between items-center px-4" >
          <h1 className="text-2xl font-bold">Users Management</h1>
        </div>

        <div className='px-4 py-2'>
        <Card>
          <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle>Users</CardTitle>

            <div className="flex flex-wrap items-center gap-2">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input 
                  placeholder="Search users..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64"
                />
                <Button type="submit" size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="p-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-banned" 
                      checked={showBanned} 
                      onCheckedChange={setShowBanned}
                    />
                    <label
                      htmlFor="show-banned"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show banned users only
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-admins" 
                      checked={showAdmins} 
                      onCheckedChange={setShowAdmins}
                    />
                    <label
                      htmlFor="show-admins"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show admins only
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-teams" 
                      checked={showTeams} 
                      onCheckedChange={setShowTeams}
                    />
                    <label
                      htmlFor="show-teams"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show team members only
                    </label>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                    >
                      Reset
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="hidden sm:flex"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {users.data.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No users found.
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.data.map((user) => (
                        <TableRow key={user.id} className={user.ban ? 'bg-red-50 dark:bg-red-950/30' : ''}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="flex gap-1 mt-1">
                                  {user.is_admin && (
                                    <Badge variant="secondary" className="text-xs">
                                      Admin
                                    </Badge>
                                  )}
                                  {user.is_team && (
                                    <Badge variant="outline" className="text-xs">
                                      Team
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.level || 0}</TableCell>
                          <TableCell>
                            {user.ban ? (
                              <Badge variant="destructive">Banned</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Active
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <span className="sr-only">Open menu</span>
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                      <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleQuickAction(user, 'toggle-ban')}
                                    className={user.ban ? "text-green-600" : "text-red-600"}
                                  >
                                    {user.ban ? (
                                      <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Unban User
                                      </>
                                    ) : (
                                      <>
                                        <Ban className="mr-2 h-4 w-4" />
                                        Ban User
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {user.is_admin ? (
                                    <DropdownMenuItem 
                                      onClick={() => handleQuickAction(user, 'remove-admin')}
                                      className="text-amber-600"
                                    >
                                      <ShieldAlert className="mr-2 h-4 w-4" />
                                      Remove Admin
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem 
                                      onClick={() => handleQuickAction(user, 'make-admin')}
                                      className="text-blue-600"
                                    >
                                      <Shield className="mr-2 h-4 w-4" />
                                      Make Admin
                                    </DropdownMenuItem>
                                  )}
                                  {user.is_team ? (
                                    <DropdownMenuItem 
                                      onClick={() => handleQuickAction(user, 'remove-team')}
                                      className="text-teal-600"
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      Remove from Team
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem 
                                      onClick={() => handleQuickAction(user, 'make-team')}
                                      className="text-indigo-600"
                                    >
                                      <UsersIcon className="mr-2 h-4 w-4" />
                                      Add to Team
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => confirmDelete(user)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {users.last_page > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={users.current_page}
                      totalPages={users.last_page}
                      onPageChange={(page) => {
                        window.location.href = `${route('admin.users.index')}?page=${page}` + 
                          (searchQuery ? `&search=${searchQuery}` : '') +
                          (showBanned ? '&banned=true' : '') +
                          (showAdmins ? '&admins=true' : '') +
                          (showTeams ? '&teams=true' : '');
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

        </div>
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          
          {userToEdit && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="required">Name</Label>
                  <Input 
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email" className="required">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="level">Level</Label>
                  <Input 
                    id="level"
                    type="number"
                    value={data.level || 0}
                    onChange={(e) => setData('level', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                  {errors.level && <p className="text-sm text-red-500">{errors.level}</p>}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={data.description || ''}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>

                {/* Permissions */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">User Permissions</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isAdmin" className="text-base">Admin Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Grant full administrative access
                      </p>
                    </div>
                    <Switch 
                      id="isAdmin"
                      checked={data.is_admin}
                      onCheckedChange={(checked) => setData('is_admin', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isTeam" className="text-base">Team Member</Label>
                      <p className="text-sm text-muted-foreground">
                        Set as a team member
                      </p>
                    </div>
                    <Switch 
                      id="isTeam"
                      checked={data.is_team}
                      onCheckedChange={(checked) => setData('is_team', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isBanned" className="text-base">Account Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Ban or unban this user
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={data.ban ? "text-red-500" : "text-green-500"}>
                        {data.ban ? "Banned" : "Active"}
                      </span>
                      <Switch 
                        id="isBanned"
                        checked={data.ban}
                        onCheckedChange={(checked) => setData('ban', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.name}? 
              This action cannot be undone and will permanently delete the user account and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteUser}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}