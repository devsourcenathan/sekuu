import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, type User } from '@/lib/api/usersApi';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
}

interface UserPermissionsDialogProps {
    user: User;
    onClose: () => void;
}

function UserPermissionsDialog({ user, onClose }: UserPermissionsDialogProps) {
    const queryClient = useQueryClient();

    // Fetch user's permissions
    const { data: userPermissionsData, isLoading } = useQuery({
        queryKey: ['user-permissions', user.id],
        queryFn: async () => {
            const res = await usersApi.getUserPermissions(user.id);
            return res.data.data;
        },
    });

    // Fetch all available permissions
    const { data: allPermissions } = useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            const res = await apiClient.get('/permissions');
            return res.data.data as Record<string, Permission[]>;
        },
    });

    // Assign permission mutation
    const assignPermission = useMutation({
        mutationFn: async (permissionId: number) => {
            return usersApi.assignPermission(user.id, permissionId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-permissions', user.id] });
            toast.success('Permission assigned successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to assign permission');
        },
    });

    // Revoke permission mutation
    const revokePermission = useMutation({
        mutationFn: async (permissionId: number) => {
            return usersApi.revokePermission(user.id, permissionId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-permissions', user.id] });
            toast.success('Permission revoked successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to revoke permission');
        },
    });

    if (isLoading || !userPermissionsData || !allPermissions) {
        return <div>Loading...</div>;
    }

    const rolePermissionIds = userPermissionsData.role_permissions.map((p) => p.id);
    const directPermissionIds = userPermissionsData.direct_permissions.map((p) => p.id);

    const handleTogglePermission = (permission: Permission) => {
        const isDirectPermission = directPermissionIds.includes(permission.id);

        if (isDirectPermission) {
            revokePermission.mutate(permission.id);
        } else {
            assignPermission.mutate(permission.id);
        }
    };

    return (
        <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
                <DialogTitle>
                    Manage Permissions: {user.name}
                </DialogTitle>
                <div className="flex gap-2 mt-2">
                    {user.roles.map((role) => (
                        <Badge key={role.id} variant="secondary">
                            {role.name}
                        </Badge>
                    ))}
                </div>
            </DialogHeader>

            <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                    {Object.entries(allPermissions).map(([module, modulePermissions]) => (
                        <div key={module} className="border rounded-md p-4">
                            <h3 className="font-semibold capitalize mb-3">{module}</h3>
                            <div className="space-y-2">
                                {modulePermissions.map((permission) => {
                                    const hasFromRole = rolePermissionIds.includes(permission.id);
                                    const hasDirectly = directPermissionIds.includes(permission.id);
                                    const isDisabled = hasFromRole && !hasDirectly;

                                    return (
                                        <div
                                            key={permission.id}
                                            className="flex items-center justify-between gap-2 p-2 rounded hover:bg-accent/50"
                                        >
                                            <div className="flex items-center gap-2 flex-1">
                                                <Checkbox
                                                    id={`perm-${permission.id}`}
                                                    checked={hasFromRole || hasDirectly}
                                                    disabled={isDisabled}
                                                    onCheckedChange={() => handleTogglePermission(permission)}
                                                />
                                                <Label
                                                    htmlFor={`perm-${permission.id}`}
                                                    className={`text-sm cursor-pointer ${isDisabled ? 'opacity-60' : ''
                                                        }`}
                                                >
                                                    {permission.name}
                                                </Label>
                                            </div>
                                            <div className="flex gap-1">
                                                {hasFromRole && (
                                                    <Badge variant="outline" className="text-xs">
                                                        From Role
                                                    </Badge>
                                                )}
                                                {hasDirectly && (
                                                    <Badge variant="default" className="text-xs">
                                                        Direct
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
            </div>
        </DialogContent>
    );
}

export function UserPermissions() {
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Fetch users
    const { data: usersData, isLoading } = useQuery({
        queryKey: ['users', search],
        queryFn: async () => {
            const res = await usersApi.getUsers({ search });
            return res.data.data;
        },
    });

    const users = usersData?.data || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">User Permissions</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead>Direct Permissions</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user: User) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {user.roles.map((role) => (
                                                <Badge key={role.id} variant="secondary">
                                                    {role.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {user.permissions?.length || 0} direct
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog
                                            open={selectedUser?.id === user.id}
                                            onOpenChange={(open) => {
                                                if (!open) setSelectedUser(null);
                                            }}
                                        >
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedUser(user)}
                                                >
                                                    <Shield className="h-4 w-4 mr-2" />
                                                    Manage Permissions
                                                </Button>
                                            </DialogTrigger>
                                            {selectedUser?.id === user.id && (
                                                <UserPermissionsDialog
                                                    user={user}
                                                    onClose={() => setSelectedUser(null)}
                                                />
                                            )}
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
