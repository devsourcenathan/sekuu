import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckoutForm } from '../components/CheckoutForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Mock data fetch (replace with hook later)
const useCourse = (id: string) => {
    // Simulate fetching course details
    return {
        data: {
            id,
            title: 'Complete Laravel Development Course',
            price: 49.99,
            thumbnail: 'https://placehold.co/600x400?text=Laravel+Course',
        },
        isLoading: false,
    };
};

export const Checkout: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const { data: course, isLoading } = useCourse(courseId || '');

    if (isLoading) {
        return <div>Loading checkout...</div>;
    }

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8 px-4 max-w-5xl">
                <Button
                    variant="ghost"
                    className="mb-6"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Course
                </Button>

                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <CheckoutForm course={course} />
            </div>
        </div>
    );
};
