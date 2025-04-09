import { createServerClient } from '@/lib/supabase/server';

export async function DELETE(req: Request) {
    const supabase = createServerClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return new Response(JSON.stringify({ error: "ID required" }), { status: 400 });
    }

    const { error } = await supabase
        .from('Vinyl')
        .delete()
        .eq('id', id);

    if (error) {
        return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Vinyl deleted" }), { status: 200 });
}
