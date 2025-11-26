import { useState } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useCourses } from '@/features/courses/hooks';
import type { CourseFilters as CourseFiltersType } from '@/features/courses/types/course.types';
import { CourseFilters } from '@/features/courses/components/CourseFilters';
import { CourseList } from '@/features/courses/components/CourseList';
import { useTranslation } from 'react-i18next';

export function CourseCatalog() {
    const { t } = useTranslation();
    const [filters, setFilters] = useState<CourseFiltersType>({
        per_page: 12,
        page: 1,
    });

    const { data, isLoading, error } = useCourses(filters);

    const handleFiltersChange = (newFilters: CourseFiltersType) => {
        setFilters({ ...newFilters, page: 1 });
    };

    const handleLoadMore = () => {
        setFilters((prev) => ({
            ...prev,
            page: (prev.page || 1) + 1,
        }));
    };

    return (
        <div className="container p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{t('course.catalog.title')}</h1>
                <p className="text-muted-foreground">
                    {t('course.catalog.subtitle')}
                </p>
            </div>

            {/* Filtres */}
            <div className="mb-8">
                <CourseFilters filters={filters} onFiltersChange={handleFiltersChange} />
            </div>

            {/* Résultats */}
            {isLoading && !data ? (
                <div className="flex items-center justify-center py-20">
                    <LoadingSpinner size="lg" />
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <p className="text-destructive">
                        {t('course.catalog.error')}
                    </p>
                </div>
            ) : (
                <>
                    {/* Compteur de résultats */}
                    {data && (
                        <div className="mb-4 text-sm text-muted-foreground">
                            {data?.total > 1
                                ? t('course.catalog.coursesFoundPlural', { count: data.total })
                                : t('course.catalog.coursesFound', { count: data.total })}
                        </div>
                    )}

                    {/* Liste des cours */}
                    <CourseList courses={data?.data || []} />

                    {/* Pagination */}
                    {data && data.current_page < data.last_page && (
                        <div className="mt-8 flex justify-center">
                            <Button
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                variant="outline"
                            >
                                {isLoading ? t('course.catalog.loading') : t('course.catalog.loadMore')}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}