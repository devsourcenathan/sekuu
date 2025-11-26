import { useState } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useCategories, useCreateCategory } from '../hooks/useCategories';
import { CategoryDialog } from './CategoryDialog';
import type { CreateCategoryData } from '../types/category.types';

interface CategorySelectProps {
    value?: number;
    onValueChange: (value: number) => void;
    disabled?: boolean;
}

export function CategorySelect({ value, onValueChange, disabled }: CategorySelectProps) {
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { data: categories = [], isLoading } = useCategories();
    const createCategory = useCreateCategory();

    const selectedCategory = categories.find((cat) => cat.id === value);

    const handleCreateCategory = async (data: CreateCategoryData) => {
        const newCategory = await createCategory.mutateAsync(data);
        onValueChange(newCategory.id);
        setDialogOpen(false);
    };

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={disabled || isLoading}
                    >
                        {selectedCategory ? selectedCategory.name : 'Select category...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                                {categories.map((category) => (
                                    <CommandItem
                                        key={category.id}
                                        value={category.name}
                                        onSelect={() => {
                                            onValueChange(category.id);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === category.id ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {category.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => {
                                        setOpen(false);
                                        setDialogOpen(true);
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create new category
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <CategoryDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleCreateCategory}
                isSubmitting={createCategory.isPending}
            />
        </>
    );
}
