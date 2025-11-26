import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { COURSE_CONFIG } from '@/lib/constants/config';
import type { CourseFilters as CourseFiltersType } from '../types/course.types';

interface CourseFiltersProps {
    filters: CourseFiltersType;
    onFiltersChange: (filters: CourseFiltersType) => void;
}

export function CourseFilters({ filters, onFiltersChange }: CourseFiltersProps) {
    const [localFilters, setLocalFilters] = useState<CourseFiltersType>(filters);

    const handleFilterChange = (key: keyof CourseFiltersType, value: any) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFilterChange('search', e.target.value);
    };

    const handleReset = () => {
        const emptyFilters: CourseFiltersType = {};
        setLocalFilters(emptyFilters);
        onFiltersChange(emptyFilters);
    };

    return (
        <div className="space-y-4">
            {/* Barre de recherche principale */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un cours..."
                        value={localFilters.search || ''}
                        onChange={handleSearchChange}
                        className="pl-10"
                    />
                </div>

                {/* Bouton filtres avancés (mobile) */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden">
                            <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>Filtres</SheetTitle>
                            <SheetDescription>
                                Affinez votre recherche de cours
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-4">
                            <FilterInputs
                                filters={localFilters}
                                onFilterChange={handleFilterChange}
                                onReset={handleReset}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Filtres desktop */}
            <div className="hidden md:flex gap-4 items-end">
                <FilterInputs
                    filters={localFilters}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                />
            </div>
        </div>
    );
}

interface FilterInputsProps {
    filters: CourseFiltersType;
    onFilterChange: (key: keyof CourseFiltersType, value: any) => void;
    onReset: () => void;
}

function FilterInputs({ filters, onFilterChange, onReset }: FilterInputsProps) {
    return (
        <>
            <div className="flex-1 space-y-2">
                <Label>Niveau</Label>
                <Select
                    value={filters.level || 'all'}
                    onValueChange={(value) =>
                        onFilterChange('level', value === 'all' ? undefined : value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Tous les niveaux" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les niveaux</SelectItem>
                        {COURSE_CONFIG.LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                                {level.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 space-y-2">
                <Label>Type</Label>
                <Select
                    value={filters.is_free === undefined ? 'all' : filters.is_free ? 'free' : 'paid'}
                    onValueChange={(value) =>
                        onFilterChange('is_free',
                            value === 'all' ? undefined : value === 'free'
                        )
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Tous les cours" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les cours</SelectItem>
                        <SelectItem value="free">Gratuits</SelectItem>
                        <SelectItem value="paid">Payants</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 space-y-2">
                <Label>Trier par</Label>
                <Select
                    value={filters.sort_by || 'created_at'}
                    onValueChange={(value) => onFilterChange('sort_by', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Date de création" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="created_at">Plus récents</SelectItem>
                        <SelectItem value="title">Titre</SelectItem>
                        <SelectItem value="price">Prix</SelectItem>
                        <SelectItem value="students_count">Popularité</SelectItem>
                        <SelectItem value="rating">Meilleures notes</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button variant="outline" onClick={onReset}>
                Réinitialiser
            </Button>
        </>
    );
}