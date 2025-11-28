import { useState } from 'react';
import { useAdminPacks, useAdminPackStatistics, useUpdatePackStatus, useForceDeletePack } from '@/features/admin/hooks/useManagePacks';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MoreHorizontal, CheckCircle, XCircle, Trash2, Eye, Package } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { formatCurrency } from '@/lib/utils/format';
import type { Pack } from '@/types';

export function AdminPacks() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const debouncedSearch = useDebounce(search, 500);
    const [page] = useState(1);

    const { data: packsData, isLoading } = useAdminPacks(
        page,
        debouncedSearch,
        undefined,
        statusFilter === 'all' ? '' : statusFilter
    );
    const { data: stats, isLoading: statsLoading } = useAdminPackStatistics();
    const { mutate: updateStatus } = useUpdatePackStatus();
    const { mutate: forceDelete } = useForceDeletePack();

    console.log(stats, "stats");

    const handleStatusUpdate = (packId: number, isActive: boolean) => {
        updateStatus({ packId, isActive });
    };

    const handleForceDelete = (packId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer définitivement ce pack ? Cette action est irréversible.')) {
            forceDelete(packId);
        }
    };

    const getStatusBadge = (pack: Pack) => {
        if (pack.is_active && pack.published_at) {
            return <Badge className="bg-green-500">Published</Badge>;
        } else if (pack.is_active) {
            return <Badge className="bg-blue-500">Active</Badge>;
        } else {
            return <Badge variant="secondary">Inactive</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Packs Management</h1>
                <p className="text-muted-foreground">
                    Manage all course packs on the platform
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Packs</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">{stats?.total_packs || 0}</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Packs</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">{stats?.active_packs || 0}</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">{stats?.total_students || 0}</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {formatCurrency(stats?.total_revenue || 0)}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search packs..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Packs Table */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pack</TableHead>
                            <TableHead>Instructor</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Courses</TableHead>
                            <TableHead>Students</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-3 w-[150px]" />
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : packsData?.data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    No packs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            packsData?.data?.map((pack) => (
                                <TableRow key={pack.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{pack.title}</p>
                                            <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                                                {pack.description}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">{pack.instructor?.name}</span>
                                    </TableCell>
                                    <TableCell>
                                        {formatCurrency(pack.price || 0)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{pack.total_courses}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{pack.students_enrolled}</Badge>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(pack)}</TableCell>
                                    <TableCell>
                                        {new Date(pack.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Pack
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {pack.is_active ? (
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(pack.id, false)}>
                                                        <XCircle className="mr-2 h-4 w-4 text-orange-600" />
                                                        Deactivate
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(pack.id, true)}>
                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                        Activate
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleForceDelete(pack.id)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Force Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
