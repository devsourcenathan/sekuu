import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as authApi from "../../features/auth/api/authApi";
import { useTranslation } from 'react-i18next';
import { useAuthStore } from "@/store/authStore";

type FormValues = {
    name: string;
    email: string;
    password: string;
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
                <label className="block text-sm font-medium">{t('auth.name')}</label>
                <input className="mt-1 w-full border rounded px-3 py-2" {...register("name", { required: true })} />
                {errors.name && <div className="text-sm text-red-600">{t('auth.required')}</div>}
            </div>

            <div>
                <label className="block text-sm font-medium">{t('auth.email')}</label>
                <input className="mt-1 w-full border rounded px-3 py-2" {...register("email", { required: true })} type="email" />
                {errors.email && <div className="text-sm text-red-600">{t('auth.required')}</div>}
            </div>

            <div>
                <label className="block text-sm font-medium">{t('auth.password')}</label>
                <input className="mt-1 w-full border rounded px-3 py-2" {...register("password", { required: true })} type="password" />
                {errors.password && <div className="text-sm text-red-600">{t('auth.required')}</div>}
            </div>

            <div>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{t('auth.register.submit')}</button>
            </div>
        </form>
    );
};

export default RegisterForm;
