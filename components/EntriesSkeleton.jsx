"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EntriesSkeleton() {
    return (
        <div className="max-w-4xl mx-auto mb-8">
            <Card className="w-full bg-gray-800">
                <CardHeader className="mt-2">
                    <Skeleton className="h-4 w-2/3 bg-gray-700" />
                    <Skeleton className="h-4 w-1/4 bg-gray-700" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-rows-3 gap-2 w-full mb-6">
                        <Skeleton className="h-4 w-full bg-gray-700" />
                        <Skeleton className="h-4 w-2/3 bg-gray-700" />
                        <Skeleton className="h-4 w-1/3 bg-gray-700" />
                        <Skeleton className="h-4 w-full bg-gray-700" />
                        <Skeleton className="h-4 w-1/2 bg-gray-700" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Skeleton className="aspect-video w-full bg-gray-700" />
                        <Skeleton className="aspect-video w-full bg-gray-700" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <Skeleton className="aspect-video w-full bg-gray-700" />
                        <Skeleton className="aspect-video w-full bg-gray-700" />
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}