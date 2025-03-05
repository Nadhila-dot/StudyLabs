import { FaWhatsapp } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideMailCheck } from "lucide-react";

export function SupportCard() {
    const whatsappLink = "https://chat.whatsapp.com/FqLAuEWV3tF9wVadoqRwXj";
    
    return (
        <>
        <div className="grid grid-cols-4 gap-4">
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Support Center</CardTitle>
                <CardDescription>Get help from our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <img
                        src="https://images.pexels.com/photos/3280130/pexels-photo-3280130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="Happy students learning together"
                        className="object-cover w-full h-full"
                    />
                </div>
                
                <Button 
                    variant="default" 
                    className="w-full bg-green-500 hover:bg-green-600"
                    onClick={() => window.open(whatsappLink, '_blank')}
                >
                    <FaWhatsapp className="mr-2 h-5 w-5" />
                    Join WhatsApp Support Group
                </Button>
            </CardContent>
        </Card>
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Support Center</CardTitle>
                <CardDescription>Get help from our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/020/946/697/original/3d-illustration-chatting-when-sitting-in-the-sofa-free-png.png"
                        alt="Happy students learning together"
                        className="object-cover w-full h-full"
                    />
                </div>
                
                <Button 
                    variant="default" 
                    className="w-full bg-blue-500 hover:bg-blue-900"
                    onClick={() => window.open('mailto:studylabs@nadhi.dev', '_blank')}
                >
                    <LucideMailCheck className="mr-2 h-5 w-5" />
                    Email us! 
                </Button>
            </CardContent>
        </Card>
        </div>
        </>
    );
}