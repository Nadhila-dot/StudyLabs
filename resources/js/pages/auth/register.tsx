import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Upload, ImagePlus, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { FormEventHandler, useState, useRef } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    avatar: File | null;
    banner: File | null;
    description: string;
};

export default function Register() {
    const [step, setStep] = useState(1);
    const totalSteps = 2;
    
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        avatar: null,
        banner: null,
        description: '',
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Create FileReader to convert to base64
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target?.result as string;
                setAvatarPreview(base64String);
                
                // For file uploads with Inertia we can set the File object directly
                // The controller will handle the base64 conversion
                setData('avatar', file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Create FileReader to convert to base64
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target?.result as string;
                setBannerPreview(base64String);
                
                // For file uploads with Inertia we can set the File object directly
                // The controller will handle the base64 conversion
                setData('banner', file);
            };
            reader.readAsDataURL(file);
        }
    };

    const nextStep = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // The forceFormData option is important for file uploads
        // This ensures that the File objects get properly sent to the server
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            forceFormData: true,
        });
    };

    return (
        <AuthSplitLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2 text-sm">
                    <span>Step {step} of {totalSteps}</span>
                    <span>{step === 1 ? 'Basic Information' : 'Profile Details'}</span>
                </div>
                <Progress value={(step / totalSteps) * 100} className="h-2" />
            </div>
            
            <form className="flex flex-col gap-6" onSubmit={submit} encType="multipart/form-data">
                {step === 1 && (
                    <div className="grid gap-6 animate-in fade-in-50 duration-300">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Full name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button 
                            type="button" 
                            onClick={nextStep}
                            className="mt-2"
                            disabled={!data.name || !data.email || !data.password || !data.password_confirmation}
                        >
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid gap-6 animate-in fade-in-50 duration-300">
                        {/* Banner Upload */}
                        <div className="grid gap-2">
                            <Label>Banner Image (Optional)</Label>
                            <div 
                                className="relative h-32 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 flex justify-center items-center cursor-pointer overflow-hidden"
                                onClick={() => bannerInputRef.current?.click()}
                            >
                                {bannerPreview ? (
                                    <img 
                                        src={bannerPreview} 
                                        alt="Banner Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                                        <ImagePlus className="h-8 w-8 mb-2" />
                                        <span>Upload banner image</span>
                                        <span className="text-xs mt-1">Recommended size: 1500x500px</span>
                                    </div>
                                )}
                                <input
                                    ref={bannerInputRef}
                                    type="file"
                                    name="banner" // Add name attribute for FormData
                                    className="hidden"
                                    onChange={handleBannerChange}
                                    accept="image/*"
                                />
                            </div>
                            <InputError message={errors.banner} />
                        </div>
                        
                        {/* Avatar Upload */}
                        <div className="grid gap-2">
                            <Label>Profile Avatar (Optional)</Label>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={avatarPreview || undefined} />
                                    <AvatarFallback>
                                        <User className="h-8 w-8" />
                                    </AvatarFallback>
                                </Avatar>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="text-sm"
                                    onClick={() => avatarInputRef.current?.click()}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload avatar
                                </Button>
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    name="avatar" // Add name attribute for FormData
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                />
                            </div>
                            <InputError message={errors.avatar} />
                        </div>
                        
                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">About You (Optional)</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                disabled={processing}
                                placeholder="Tell us a bit about yourself..."
                                rows={4}
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex justify-between gap-4 mt-4">
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={prevStep}
                                className="flex-1"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="flex-1"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Create account
                            </Button>
                        </div>
                    </div>
                )}
            </form>

            <div className="text-muted-foreground text-center text-sm mt-8">
                Already have an account?{' '}
                <TextLink href={route('login')}>
                    Log in
                </TextLink>
            </div>
        </AuthSplitLayout>
    );
}