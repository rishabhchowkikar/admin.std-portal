"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/lib/hook';
import { loginUser, RoleOption } from '@/app/lib/authSlice';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'admin' as RoleOption
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            const result = await dispatch(loginUser(formData)).unwrap();
            if (result.data) {
                toast.success(`Welcome back, ${result.data.email}!`);
                router.push('/dashboard');
            }

            console.log(result);
        } catch (err: any) {
            toast.error(err.message || 'Login failed. Please try again.');
        }
    };
    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-2">
            {/* Header */}
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h1>
                <p className="text-sm text-gray-500">
                    Enter your credentials to access the portal
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                        Login As
                    </Label>
                    <Select
                        value={formData.role}
                        onValueChange={(value: RoleOption) =>
                            setFormData({ ...formData, role: value })}
                    >
                        <SelectTrigger className="w-full h-10 px-3 border border-gray-300 rounded-md">
                            <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@cuh.ac.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </Label>
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-purple-600 hover:text-purple-500"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Label
                        htmlFor="remember"
                        className="ml-2 block text-sm text-gray-700"
                    >
                        Remember me
                    </Label>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                        </div>
                    ) : (
                        'Sign in'
                    )}
                </Button>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-500">
                    Not registered?{' '}
                    <Link
                        href="/signup"
                        className="font-medium text-purple-600 hover:text-purple-500"
                    >
                        Create an account
                    </Link>
                </p>
            </form>
        </div>
    );
}
