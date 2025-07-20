'use client';

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
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/lib/hook';
import { signupTeacher } from '@/app/lib/authSlice';

// Department options
const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Economics",
    "Management",
    "Engineering"
];

// Academic roles
const academicRoles = [
    "Assistant Professor",
    "Associate Professor",
    "Professor",
    "Visiting Faculty",
    "Research Professor"
];

export default function TeacherSignupForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        role: ''
    });

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.department || !formData.role) {
            toast.error('Please fill in all required fields');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        // Password validation (minimum 8 characters, at least one number and one letter)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            toast.error('Password must be at least 8 characters long and contain at least one letter and one number');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const result = await dispatch(signupTeacher({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                department: formData.department,
                role: formData.role
            })).unwrap();

            console.log(result);

            toast.success('Registration successful! Please login to continue.');
            router.push('/login');
        } catch (err: any) {
            toast.error(err || 'Registration failed. Please try again.');
        }


    };

    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-2">
            {/* Header */}
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Teacher Registration
                </h1>
                <p className="text-sm text-gray-500">
                    Create your account to join CUH faculty portal
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                {/* Full Name */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@cuh.ac.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Department */}
                <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                        Department
                    </Label>
                    <Select
                        value={formData.department}
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                        <SelectTrigger className="w-full h-10 px-3 border border-gray-300 rounded-md">
                            <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                            {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                    {dept}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Academic Role */}
                <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                        Academic Role
                    </Label>
                    <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                        <SelectTrigger className="w-full h-10 px-3 border border-gray-300 rounded-md">
                            <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                            {academicRoles.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    />
                    <p className="text-xs text-gray-500">
                        Must be at least 8 characters with numbers and letters
                    </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm Password
                    </Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    />
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
                            Creating account...
                        </div>
                    ) : (
                        'Create Account'
                    )}
                </Button>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-purple-600 hover:text-purple-500"
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    );
} 