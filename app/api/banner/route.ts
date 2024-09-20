// app/api/banners/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const bannerDir = path.join(process.cwd(), 'public/banner');
    const banners: Banner[] = fs.readdirSync(bannerDir)
        .filter(file => file.endsWith('.png'))
        .map((file, index) => ({
            id: index + 1,
            imageUrl: `/banner/${file}`,
            link: "/#", // You might want to define these links elsewhere
            alt: `Banner ${index + 1}`
        }));

    return NextResponse.json(banners);
}