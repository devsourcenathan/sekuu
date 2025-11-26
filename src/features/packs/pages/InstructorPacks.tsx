import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInstructorPacks, useDeletePack, usePublishPack } from '../hooks/usePacks';
import { PackDrawer } from '../components/PackDrawer';
import type { Pack } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Eye, TrendingUp } from 'lucide-react';

export function InstructorPacks() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedPack, setSelectedPack] = useState<Pack | undefined>();
    const { data: packsData, isLoading } = useInstructorPacks();
    const deletePack = useDeletePack();
    const publishPack = usePublishPack();

    const handleEdit = (pack: Pack) => {
        setSelectedPack(pack);
        setDrawerOpen(true);
    };

    const handleDelete = async (pack: Pack) => {
        if (confirm('Are you sure you want to delete this pack?')) {
            await deletePack.mutateAsync(pack.id);
        }
    };

    const handleTogglePublish = async (pack: Pack) => {
        await publishPack.mutateAsync(pack.id);
    };

    const handleCreateNew = () => {
        setSelectedPack(undefined);
        setDrawerOpen(true);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const packs = packsData?.data || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Packs</h1>
                    <p className="text-muted-foreground">
                        Manage your course packs and bundles
                    </p>
                </div>
                <Button onClick={handleCreateNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Pack
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packs.map((pack) => (
                    <Card key={pack.id} className="group relative overflow-hidden transition-all hover:shadow-lg">
                        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                            {pack.cover_image && (
                                <img
                                    src={pack.cover_image}
                                    alt={pack.title}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                {pack.is_active ? (
                                    <Badge variant="default">Published</Badge>
                                ) : (
                                    <Badge variant="secondary">Draft</Badge>
                                )}
                            </div>
                        </div>

                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold line-clamp-2 mb-1">
                                        {pack.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {pack.description}
                                    </p>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEdit(pack)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <TrendingUp className="mr-2 h-4 w-4" />
                                            Statistics
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleTogglePublish(pack)}>
                                            {pack.is_active ? 'Unpublish' : 'Publish'}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(pack)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4">
                                    <span className="text-muted-foreground">
                                        {pack.total_courses} courses
                                    </span>
                                    <span className="text-muted-foreground">
                                        {pack.students_enrolled} students
                                    </span>
                                </div>
                                <span className="font-semibold">
                                    {pack.price} {pack.currency}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {packs.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                        You haven't created any packs yet
                    </p>
                    <Button onClick={handleCreateNew}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Pack
                    </Button>
                </div>
            )}

            <PackDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                pack={selectedPack}
            />
        </div>
    );
}
