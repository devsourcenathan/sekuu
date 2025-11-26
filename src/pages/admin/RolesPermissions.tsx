import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Plus, Trash2, Edit } from 'lucide-react';
import { type IRole } from '@/types';

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
}

interface RoleWithPermissions extends IRole {
    permissions: Permission[];
    description?: string;
}

export function RolesPermissions() {
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleWithPermissions | null>(null);

    // Fetch Roles
    const { data: roles, isLoading: rolesLoading } = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const res = await apiClient.get('/roles');
            return res.data.data as RoleWithPermissions[];
        },
    });

    // Fetch Permissions
    const { data: permissions, isLoading: permissionsLoading } = useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            const res = await apiClient.get('/permissions');
            return res.data.data as Record<string, Permission[]>;
        },
    });

    // Create Role Mutation
    const createRole = useMutation({
        mutationFn: async (data: any) => {
            return apiClient.post('/roles', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            setIsCreateOpen(false);
            toast.success('Role created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create role');
        },
    });

    // Update Role Mutation
    const updateRole = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: any }) => {
            return apiClient.put(`/roles/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            setEditingRole(null);
            toast.success('Role updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update role');
        },
    });

    // Delete Role Mutation
    const deleteRole = useMutation({
        mutationFn: async (id: number) => {
            return apiClient.delete(`/roles/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            toast.success('Role deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete role');
        },
    });

    if (rolesLoading || permissionsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Roles & Permissions</h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen} >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Role</DialogTitle>
                        </DialogHeader>
                        <RoleForm
                            permissions={permissions || {}}
                            onSubmit={(data) => createRole.mutate(data)}
                            isLoading={createRole.isPending}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Permissions</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles?.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell className="font-medium">{role.name}</TableCell>
                                <TableCell>{role.slug}</TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {role.permissions.length} permissions
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditingRole(role)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this role?')) {
                                                    deleteRole.mutate(role.id);
                                                }
                                            }}
                                            disabled={['admin', 'super_admin', 'student', 'instructor'].includes(role.slug)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Role: {editingRole?.name}</DialogTitle>
                    </DialogHeader>
                    {editingRole && (
                        <RoleForm
                            initialData={editingRole}
                            permissions={permissions || {}}
                            onSubmit={(data) => updateRole.mutate({ id: editingRole.id, data })}
                            isLoading={updateRole.isPending}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

interface RoleFormProps {
    initialData?: RoleWithPermissions;
    permissions: Record<string, Permission[]>;
    onSubmit: (data: any) => void;
    isLoading: boolean;
}

function RoleForm({ initialData, permissions, onSubmit, isLoading }: RoleFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        initialData?.permissions.map((p) => p.id) || []
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name,
            description,
            permissions: selectedPermissions,
        });
    };

    const togglePermission = (id: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(id)
                ? prev.filter((pId) => pId !== id)
                : [...prev, id]
        );
    };

    const toggleModule = (modulePermissions: Permission[]) => {
        const allSelected = modulePermissions.every((p) => selectedPermissions.includes(p.id));
        if (allSelected) {
            setSelectedPermissions((prev) =>
                prev.filter((id) => !modulePermissions.find((p) => p.id === id))
            );
        } else {
            const newIds = modulePermissions.map((p) => p.id).filter((id) => !selectedPermissions.includes(id));
            setSelectedPermissions((prev) => [...prev, ...newIds]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Role Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <Label>Permissions</Label>
                <div className="space-y-6">
                    {Object.entries(permissions).map(([module, modulePermissions]) => (
                        <div key={module} className="border rounded-md p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Checkbox
                                    checked={modulePermissions.every((p) => selectedPermissions.includes(p.id))}
                                    onCheckedChange={() => toggleModule(modulePermissions)}
                                />
                                <h3 className="font-semibold capitalize">{module}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pl-6">
                                {modulePermissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`perm-${permission.id}`}
                                            checked={selectedPermissions.includes(permission.id)}
                                            onCheckedChange={() => togglePermission(permission.id)}
                                        />
                                        <Label htmlFor={`perm-${permission.id}`} className="text-sm font-normal cursor-pointer">
                                            {permission.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Role'}
                </Button>
            </div>
        </form>
    );
}
