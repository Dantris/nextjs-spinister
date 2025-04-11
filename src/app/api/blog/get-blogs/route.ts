// src/app/api/blog/get-blogs/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: blogs, error } = await supabase
        .from('Blog')
        .select(`
            id,
            title,
            content,
            createdAt,
            author:User (
                name,
                email
            )
        `);

    if (error) {
        return NextResponse.json({ error: 'Failed to load blogs' }, { status: 500 });
    }

    return NextResponse.json(blogs, { status: 200 });
}
