import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Category, CreateCategoryData, UpdateCategoryData } from '../types/category.types';

/**
 * API pour la gestion des catégories
 */
export const categoriesApi = {
    /**
     * Récupérer toutes les catégories
     */
    getCategories: async (): Promise<Category[]> => {
        return apiGet<Category[]>(ENDPOINTS.CATEGORIES.LIST);
    },

    /**
     * Récupérer une catégorie par ID
     */
    getCategory: async (id: number | string): Promise<Category> => {
        return apiGet<Category>(ENDPOINTS.CATEGORIES.SHOW(id));
    },

    /**
     * Créer une catégorie
     */
    createCategory: async (data: CreateCategoryData): Promise<Category> => {
        return apiPost<Category>(ENDPOINTS.CATEGORIES.CREATE, data);
    },

    /**
     * Mettre à jour une catégorie
     */
    updateCategory: async (id: number | string, data: UpdateCategoryData): Promise<Category> => {
        return apiPut<Category>(ENDPOINTS.CATEGORIES.UPDATE(id), data);
    },

    /**
     * Supprimer une catégorie
     */
    deleteCategory: async (id: number | string): Promise<void> => {
        return apiDelete<void>(ENDPOINTS.CATEGORIES.DELETE(id));
    },
};
