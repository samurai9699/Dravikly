import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { jsPDF } from 'jspdf';
import { trackEventServer } from '@/lib/track-event-server';

export const dynamic = 'force-dynamic';

interface FrictionPoint {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
}

interface Analysis {
  id: string;
  user_id: string;
  url: string;
  status: string;
  friction_score: number | null;
  insights: {
    summary: string;
    friction_points: FrictionPoint[];
    forms_detected?: boolean;
    forms_count?: number;
  } | null;
  created_at: string;
  completed_at: string | null;
}

function getScoreLabel(score: number): string {
  if (score <= 30) return 'Excellent';
  if (score <= 60) return 'Good';
  if (score <= 80) return 'Fair';
  return 'Poor';
}

function generatePDF(analysis: Analysis): Buffer {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');

    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }

    return yPosition;
  };

  const addWrappedText = (text: string, fontSize: number = 12, isBold: boolean = false, lineHeight: number = 7) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');

    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);

    for (let i = 0; i < lines.length; i++) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(lines[i], margin, yPosition);
      yPosition += lineHeight;
    }
  };

  doc.setFillColor(20, 184, 166);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Friction Analysis Report', margin, 25);

  yPosition = 50;
  doc.setTextColor(0, 0, 0);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition);
  yPosition += 10;

  doc.setDrawColor(20, 184, 166);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Analyzed URL:', margin, yPosition);
  yPosition += 7;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 100, 200);
  addWrappedText(analysis.url, 10, false, 5);
  yPosition += 5;

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Analysis Date: ${new Date(analysis.created_at).toLocaleString()}`, margin, yPosition);
  yPosition += 15;

  const score = analysis.friction_score || 0;
  const scoreLabel = getScoreLabel(score);

  doc.setFillColor(240, 240, 240);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 35, 3, 3, 'F');

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Overall Friction Score', margin + 5, yPosition + 10);

  doc.setFontSize(32);
  if (score <= 30) {
    doc.setTextColor(34, 197, 94);
  } else if (score <= 60) {
    doc.setTextColor(234, 179, 8);
  } else if (score <= 80) {
    doc.setTextColor(249, 115, 22);
  } else {
    doc.setTextColor(239, 68, 68);
  }
  doc.text(score.toString(), pageWidth - margin - 40, yPosition + 25);

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`(${scoreLabel})`, pageWidth - margin - 40, yPosition + 32);

  yPosition += 45;

  if (analysis.insights?.summary) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Summary:', margin, yPosition);
    yPosition += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    addWrappedText(analysis.insights.summary, 10, false, 6);
    yPosition += 5;
  }

  if (analysis.insights?.forms_detected) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Forms Detected: ${analysis.insights.forms_count || 0}`,
      margin,
      yPosition
    );
    yPosition += 10;
  }

  yPosition += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Friction Points', margin, yPosition);
  yPosition += 10;

  const frictionPoints = analysis.insights?.friction_points || [];

  if (frictionPoints.length === 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(34, 197, 94);
    doc.text('No major friction points detected!', margin, yPosition);
    yPosition += 10;
  } else {
    frictionPoints.forEach((point, index) => {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
      }

      let severityColor: [number, number, number];
      if (point.severity === 'high') {
        severityColor = [239, 68, 68];
      } else if (point.severity === 'medium') {
        severityColor = [234, 179, 8];
      } else {
        severityColor = [34, 197, 94];
      }

      doc.setFillColor(250, 250, 250);
      const boxHeight = 50;
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, boxHeight, 2, 2, 'F');

      doc.setFillColor(...severityColor);
      doc.circle(margin + 5, yPosition + 8, 3, 'F');

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${point.type}`, margin + 12, yPosition + 10);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...severityColor);
      doc.text(point.severity.toUpperCase(), pageWidth - margin - 30, yPosition + 10);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);

      const descLines = doc.splitTextToSize(
        `Issue: ${point.description}`,
        pageWidth - 2 * margin - 10
      );
      let textY = yPosition + 18;
      for (let i = 0; i < Math.min(descLines.length, 2); i++) {
        doc.text(descLines[i], margin + 5, textY);
        textY += 5;
      }

      doc.setTextColor(20, 184, 166);
      doc.setFont('helvetica', 'bold');
      doc.text('Fix:', margin + 5, textY + 3);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);

      const fixLines = doc.splitTextToSize(
        point.recommendation,
        pageWidth - 2 * margin - 15
      );
      textY += 8;
      for (let i = 0; i < Math.min(fixLines.length, 2); i++) {
        doc.text(fixLines[i], margin + 5, textY);
        textY += 5;
      }

      yPosition += boxHeight + 5;
    });
  }

  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  } else {
    yPosition += 10;
  }

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Generated by Friction Analyzer', margin, yPosition);
  doc.text(
    `Page ${doc.getCurrentPageInfo().pageNumber} of ${doc.getNumberOfPages()}`,
    pageWidth - margin - 30,
    yPosition
  );

  return Buffer.from(doc.output('arraybuffer'));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysisId = params.id;

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to continue.' },
        { status: 401 }
      );
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found.' },
        { status: 404 }
      );
    }

    if (subscription.tier === 'FREE') {
      return NextResponse.json(
        { error: 'Upgrade to Pro for PDF export' },
        { status: 403 }
      );
    }

    const { data: analysis, error: analysisError } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', analysisId)
      .maybeSingle();

    if (analysisError || !analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    if (analysis.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to access this analysis' },
        { status: 403 }
      );
    }

    if (analysis.status !== 'completed') {
      return NextResponse.json(
        { error: 'Analysis is not yet completed' },
        { status: 400 }
      );
    }

    const pdfBuffer = generatePDF(analysis as Analysis);

    await trackEventServer('pdf_downloaded', { analysis_id: analysisId }, user.id);

    const sanitizedUrl = analysis.url
      .replace(/^https?:\/\//, '')
      .replace(/[^a-z0-9]/gi, '-')
      .substring(0, 50);

    const filename = `friction-analysis-${sanitizedUrl}-${new Date().toISOString().split('T')[0]}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF. Please try again.' },
      { status: 500 }
    );
  }
}
