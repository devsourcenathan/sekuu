import { useQuery } from '@tanstack/react-query';
import { testsApi } from '../api/testsApi';

export function useSubmissionDetails(submissionId: number | string, enabled = true) {
    return useQuery({
        queryKey: ['submissions', submissionId],
        queryFn: () => testsApi.getSubmission(submissionId),
        enabled: enabled && !!submissionId,
        staleTime: 30 * 1000,
    });
}