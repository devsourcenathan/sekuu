import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Wallet, CheckCircle2 } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useNavigate } from 'react-router-dom';

// Mock Course Data Interface (replace with real type later)
interface Course {
    id: string;
    title: string;
    price: number;
    thumbnail?: string;
}

interface CheckoutFormProps {
    course: Course;
}

const checkoutSchema = z.object({
    paymentMethod: z.enum(['stripe', 'paypal']),
    promoCode: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ course }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [discount, setDiscount] = useState(0);
    const { addNotification } = useUiStore();
    const navigate = useNavigate();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            paymentMethod: 'stripe',
            promoCode: '',
        },
    });

    const paymentMethod = watch('paymentMethod');
    const promoCode = watch('promoCode');

    const handleApplyPromo = () => {
        if (promoCode === 'SUMMER2024') {
            setDiscount(course.price * 0.2); // 20% discount
            addNotification({
                type: 'success',
                title: 'Promo Code Applied',
                message: 'You got 20% off!',
            });
        } else {
            addNotification({
                type: 'error',
                title: 'Invalid Code',
                message: 'This promo code is not valid.',
            });
        }
    };

    const onSubmit = async (data: CheckoutFormValues) => {
        setIsProcessing(true);
        try {
            // Simulate payment processing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log('Processing payment:', {
                courseId: course.id,
                amount: course.price - discount,
                method: data.paymentMethod,
                promoCode: data.promoCode
            });

            addNotification({
                type: 'success',
                title: 'Payment Successful',
                message: `You have successfully enrolled in ${course.title}`,
            });

            navigate('/student/my-courses');
        } catch (error) {
            addNotification({
                type: 'error',
                title: 'Payment Failed',
                message: 'Something went wrong. Please try again.',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const total = course.price - discount;

    return (
        <div className="grid gap-8 md:grid-cols-2">
            {/* Order Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Review your order details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        {course.thumbnail && (
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                        )}
                        <div>
                            <h3 className="font-medium">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">Lifetime Access</p>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Original Price</span>
                            <span>${course.price.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span>-${discount.toFixed(2)}</span>
                            </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Input
                            placeholder="Promo Code"
                            {...register('promoCode')}
                        />
                        <Button type="button" variant="outline" onClick={handleApplyPromo}>
                            Apply
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>Select your payment method</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <RadioGroup
                            defaultValue="stripe"
                            onValueChange={(val) => setValue('paymentMethod', val as 'stripe' | 'paypal')}
                            className="grid gap-4"
                        >
                            <div>
                                <RadioGroupItem value="stripe" id="stripe" className="peer sr-only" />
                                <Label
                                    htmlFor="stripe"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <CreditCard className="mb-3 h-6 w-6" />
                                    Credit Card
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                                <Label
                                    htmlFor="paypal"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <Wallet className="mb-3 h-6 w-6" />
                                    PayPal
                                </Label>
                            </div>
                        </RadioGroup>

                        {paymentMethod === 'stripe' && (
                            <div className="p-4 border rounded-md bg-secondary/20 text-center text-sm text-muted-foreground">
                                Stripe Elements Placeholder (Card Number, Expiry, CVC)
                            </div>
                        )}

                        {paymentMethod === 'paypal' && (
                            <div className="p-4 border rounded-md bg-secondary/20 text-center text-sm text-muted-foreground">
                                You will be redirected to PayPal to complete your purchase.
                            </div>
                        )}

                        <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3 h-3" />
                            Secure Payment Encrypted
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
