import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-red-100 p-3">
                                    <AlertTriangle className="h-8 w-8 text-red-600" />
                                </div>
                            </div>
                            <CardTitle className="text-center">Une erreur est survenue</CardTitle>
                            <CardDescription className="text-center">
                                Nous sommes désolés pour ce désagrément.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {this.state.error && (
                                <div className="rounded-lg bg-muted p-4">
                                    <p className="text-sm font-mono text-muted-foreground">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}
                            <Button onClick={this.handleReset} className="w-full">
                                Retour à l'accueil
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}