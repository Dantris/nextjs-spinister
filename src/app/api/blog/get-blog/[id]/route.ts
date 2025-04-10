import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createServerClient();

    const { data: blog, error } = await supabase
        .from('Blog')
        .select('id, title, content, createdAt, author:User(name, email)')
        .eq('id', params.id)
        .single();

    if (error || !blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
}
