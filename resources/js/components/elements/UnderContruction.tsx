import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PlaceholderPattern } from "../ui/placeholder-pattern";

export function Undercontruction(){


    return(

        <>
        <div className='px-2 py-2'>
                <Card className='px-2 py-2'>
                    <CardHeader>
                
                    </CardHeader>
                    <CardContent className="relative min-h-[400px]">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span> This section is Under Contruction.</span>
                        </div>
                    </CardContent>
                </Card>
                </div>
        
        </>
    );
}


