"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type AuthFormProps = {
    mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"admin" | "teacher">("admin");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    // Simulating API call for demo purpose. Replace with real API integration.
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            let response;
            if (mode === "login") {
                // Replace with your actual API request for login
                if (role === "admin") {
                    // Example payload, replace with fetch/axios and real backend
                    response = {
                        status: true,
                        message: "Admin login successful",
                        data: { email, role }
                    };
                    toast.success(
                        `Welcome Admin!\n${response.message}\nEmail: ${response.data.email}`
                    );
                } else {
                    response = {
                        status: true,
                        message: "Teacher login successful",
                        data: { email, role }
                    };
                    toast.success(
                        `Welcome Teacher!\n${response.message}\nEmail: ${response.data.email}`
                    );
                }
            } else {
                // Signup (for Teacher only)
                response = {
                    status: true,
                    message: "Teacher signup completed",
                    data: { name, email, role }
                };
                toast.success(
                    `Signup Successful! Welcome, ${response.data.name}\nAccount Created as Teacher\nEmail: ${response.data.email}`
                );
            }
            // Optional: Redirect or further logic
        } catch (err: any) {
            toast.error(
                `Error: ${err?.message || "Something went wrong. Please try again."}`
            );
        }
    }

    return (
        <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold mb-4">
                {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            {mode === "signup" && (
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
            )}
            <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                    id="email"
                    type="email"
                    autoComplete="username"
                    placeholder="you@cuh.ac.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="role">
                    {mode === "signup" ? "Sign up as" : "Login as"}
                </Label>
                <Select value={role} onValueChange={role => setRole(role as "admin" | "teacher")}>
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        {mode === "signup" ? (
                            <SelectItem value="teacher">Teacher</SelectItem>
                        ) : (
                            <>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                            </>
                        )}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="********"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" className="w-full">
                {mode === "login" ? "Sign In" : "Sign Up"}
            </Button>
        </form>
    );
}
