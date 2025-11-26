import { useState } from 'react';
import type { Pack } from '@/types';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PackForm } from './PackForm';
import { PackCourses } from './PackCourses';
import { useCreatePack, useUpdatePack } from '../hooks/usePacks';
import { toast } from 'sonner';
import type { PackFormValues } from '@/types';

interface PackDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pack?: Pack;
}

export function PackDrawer({ open, onOpenChange, pack }: PackDrawerProps) {
    const [activeTab, setActiveTab] = useState('info');
    const [createdPack, setCreatedPack] = useState<Pack | undefined>();
    const createPack = useCreatePack();
    const updatePack = useUpdatePack();

    const isEdit = !!pack;
    const currentPack = pack || createdPack;

    const handleSubmit = async (data: PackFormValues) => {
        try {
            if (isEdit) {
                await updatePack.mutateAsync({ id: pack.id.toString(), data });
                toast.success('Pack updated successfully');
            } else {
                const newPack = await createPack.mutateAsync(data);
                setCreatedPack(newPack);
                toast.success('Pack created successfully');
                // Switch to courses tab after creating pack
                if (newPack) {
                    setActiveTab('courses');
                }
            }
        } catch (error) {
            toast.error(isEdit ? 'Failed to update pack' : 'Failed to create pack');
            throw error;
        }
    };

    const handleClose = () => {
        setActiveTab('info');
        setCreatedPack(undefined);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto p-4">
                <SheetHeader>
                    <SheetTitle>{isEdit ? 'Edit Pack' : 'Create New Pack'}</SheetTitle>
                    <SheetDescription>
                        {isEdit
                            ? 'Update your pack information and courses'
                            : 'Fill in the details to create a new pack'}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="info">Pack Information</TabsTrigger>
                            <TabsTrigger value="courses" disabled={!currentPack}>
                                Courses
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="info" className="mt-6">
                            <PackForm
                                initialData={pack}
                                onSubmit={handleSubmit}
                                isSubmitting={createPack.isPending || updatePack.isPending}
                            />
                        </TabsContent>

                        <TabsContent value="courses" className="mt-6">
                            {currentPack && (
                                <PackCourses packId={currentPack.id} />
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </SheetContent>
        </Sheet>
    );
}
