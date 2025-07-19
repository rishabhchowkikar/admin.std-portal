"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hook";
import { loginUser } from "@/app/lib/authSlice";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RootState } from "@/app/lib/store";
import { toast } from "sonner";

type RoleOption = "admin" | "teacher";

export const roleOptions: { label: string; value: RoleOption }[] = [
    { label: "Admin", value: "admin" },
    { label: "Teacher", value: "teacher" },
];

const LoginForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user, loading, error } = useAppSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState("");
    const [role, setRole] = useState<RoleOption>("admin");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (user) {
            toast.success(`Login successful! Welcome, ${user.email || "User"}.`);
        }
        if (error) {
            toast.error(error);
        }
    }, [user, error]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ email, password, role }));
    };

    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Sign in</CardTitle>
            </CardHeader>
            <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            autoComplete="username"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="e.g. john@university.com"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="role">Role</Label>
                        <Select value={role} onValueChange={(value) => setRole(value as RoleOption)}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Choose role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roleOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="********"
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                    {error && (
                        <span className="text-red-500 text-sm">{error}</span>
                    )}
                </CardFooter>
            </form>
        </Card>
    );
};

export default LoginForm;
