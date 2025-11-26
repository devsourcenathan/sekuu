import { useMutation } from '@tanstack/react-query';
import { testsApi } from '../api/testsApi';
import type { SubmitTestData } from '../types/test.types';

export function useSaveDraft(submissionId: number | string) {
    return useMutation({
        mutationFn: (data: SubmitTestData) =>
            testsApi.saveDraft(submissionId, data),
    });
}