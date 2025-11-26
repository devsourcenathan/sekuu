import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useManageCourses, useUpdateCourseStatus } from '@/features/admin/hooks/useManageCourses';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MoreHorizontal, CheckCircle, XCircle, Eye } from 'lucide-react';
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

export function AdminCourses() {
    // const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const debouncedSearch = useDebounce(search, 500);
    const [page] = useState(1);

    const { data, isLoading } = useManageCourses(page, debouncedSearch, statusFilter === 'all' ? '' : statusFilter);
    const { mutate: updateStatus } = useUpdateCourseStatus();

    const handleStatusUpdate = (courseId: number, newStatus: string) => {
        updateStatus(
            { courseId, status: newStatus },
            {
                // onSuccess: () => showSuccess('Course status updated successfully'),
                // onError: () => showError('Failed to update course status'),
            }
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge className="bg-green-500">Published</Badge>;
            case 'draft':
                return <Badge variant="secondary">Draft</Badge>;
            case 'archived':
                return <Badge variant="outline">Archived</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
                <p className="text-muted-foreground">
                    Review and moderate courses.
                </p>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses..."
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
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Course</TableHead>
                            <TableHead>Instructor</TableHead>
                            <TableHead>Price</TableHead>
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
                                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No courses found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.data?.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{course.title}</p>
                                            <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                                                {course.description}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm">{course.instructor?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {course.is_free ? (
                                            <Badge variant="secondary">Free</Badge>
                                        ) : (
                                            formatCurrency(course.price || 0)
                                        )}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(course.status)}</TableCell>
                                    <TableCell>
                                        {new Date(course.created_at).toLocaleDateString()}
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
                                                    View Course
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {course.status !== 'published' && (
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(course.id, 'published')}>
                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                        Approve & Publish
                                                    </DropdownMenuItem>
                                                )}
                                                {course.status === 'published' && (
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(course.id, 'draft')}>
                                                        <XCircle className="mr-2 h-4 w-4 text-orange-600" />
                                                        Unpublish
                                                    </DropdownMenuItem>
                                                )}
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