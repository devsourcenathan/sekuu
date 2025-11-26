import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api/categoriesApi';
import type { CreateCategoryData, UpdateCategoryData } from '../types/category.types';
import { toast } from 'sonner';

/**
 * Hook pour récupérer toutes les catégories
 */
export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => categoriesApi.getCategories(),
    });
}

/**
 * Hook pour créer une catégorie
 */
export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCategoryData) => categoriesApi.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully');
        },
        onError: () => {
            toast.error('Failed to create category');
        },
    });
}

/**
 * Hook pour mettre à jour une catégorie
 */
export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: UpdateCategoryData }) =>
            categoriesApi.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category updated successfully');
        },
        onError: () => {
            toast.error('Failed to update category');
        },
    });
}

/**
 * Hook pour supprimer une catégorie
 */
export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => categoriesApi.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete category');
        },
    });
}
