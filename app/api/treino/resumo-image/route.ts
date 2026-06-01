export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const apiKey = process.env.ABACUSAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API key não configurada' }, { status: 500 });

    const { description, materia, subtema } = await req.json();
    if (!description) return NextResponse.json({ error: 'Descrição não informada' }, { status: 400 });

    const prompt = `Generate a clear, educational infographic/diagram for a Brazilian high-school student studying for ENEM exam. Topic: ${materia} - ${subtema}. The image should show: ${description}. Use labels in Portuguese. Clean, colorful, educational style with white background. Suitable for studying and revision.`;

    const llmRes = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-5.1',
        messages: [{ role: 'user', content: prompt }],
        modalities: ['image'],
        image_config: { aspect_ratio: '16:9', num_images: 1 },
      }),
    });

    if (!llmRes.ok) {
      const txt = await llmRes.text();
      console.error('Image LLM error:', txt.substring(0, 300));
      return NextResponse.json({ error: 'Erro ao gerar imagem' }, { status: 500 });
    }

    const data = await llmRes.json();
    // Extract image URL from response
    const images = data?.choices?.[0]?.message?.images;
    if (images && images.length > 0) {
      const imgData = images[0];
      const imageUrl = imgData?.image_url?.url ?? imgData?.url ?? null;
      if (imageUrl) {
        return NextResponse.json({ imageUrl });
      }
    }

    // Fallback: check content for image
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content === 'string' && content.startsWith('data:image')) {
      return NextResponse.json({ imageUrl: content });
    }

    return NextResponse.json({ error: 'Imagem não gerada' }, { status: 500 });
  } catch (error: any) {
    console.error('Resumo image error:', error);
    return NextResponse.json({ error: 'Erro ao gerar imagem' }, { status: 500 });
  }
}
