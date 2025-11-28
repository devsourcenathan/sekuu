import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as authApi from "../../features/auth/api/authApi";
import { useTranslation } from 'react-i18next';
import { useAuthStore } from "@/store/authStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

type FormValues = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export const RegisterForm: React.FC = () => {
    const { t } = useTranslation();
    const { register, handleSubmit, formState } = useForm<FormValues>();
    const { errors } = formState;
    const navigate = useNavigate();
    const auth = useAuthStore();

    const onSubmit = async (values: FormValues) => {
        try {
            const data = await authApi.register(values as any);
            if (data?.user && data?.token) {
                auth.setAuth(data.user, data.token);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (e: any) {
            alert(e?.response?.data?.message ?? e.message ?? t('errors.registerFailed'));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
            <div>
                <Label className="block text-sm font-medium">{t('auth.name')}</Label>
                <Input className="mt-1 w-full border rounded px-3 py-2" {...register("name", { required: true })} />
                {errors.name && <div className="text-sm text-red-600">{t('auth.required')}</div>}
            </div>

            <div>
                <Label className="block text-sm font-medium">{t('auth.email')}</Label>
                <Input className="mt-1 w-full border rounded px-3 py-2" {...register("email", { required: true })} type="email" />
                {errors.email && <div className="text-sm text-red-600">{t('auth.required')}</div>}
            </div>

            <div>
                <Label className="block text-sm font-medium">{t('auth.password')}</Label>
                <Input className="mt-1 w-full border rounded px-3 py-2" {...register("password", { required: true })} type="password" />
                {errors.password && <div className="text-sm text-red-600">{t('auth.required')}</div>}
            </div>
            <div>
                <Label className="block text-sm font-medium">{t('auth.passwordConfirmation')}</Label>
                <Input className="mt-1 w-full border rounded px-3 py-2" {...register("password_confirmation", { required: true })} type="password" />
                {errors.password_confirmation && <div className="text-sm text-red-600">{t('auth.required')}</div>}
            </div>

            <div>
                <Button disabled={formState.isSubmitting} type="submit" className="px-4 py-2 bg-primary text-white rounded">{t('auth.register.submit')}</Button>
            </div>
            <div>
                <Link className="text-primary hover:underline cursor-pointer " to="/login">{t('auth.register.login')}</Link>
            </div>
        </form>
    );
};

export default RegisterForm;
