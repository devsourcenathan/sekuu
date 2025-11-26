import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/query/client';
import { router } from './router';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export function App() {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    expand={false}
                    duration={5000}
                />
                {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
            </QueryClientProvider>
        </ErrorBoundary>
    );
}