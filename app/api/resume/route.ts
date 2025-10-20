import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the resume URL from query parameters
    const searchParams = request.nextUrl.searchParams;
    const resumeUrl = searchParams.get("url");

    if (!resumeUrl) {
      return NextResponse.json(
        { error: "Resume URL is required" },
        { status: 400 }
      );
    }

    // Fetch the PDF from Firebase Storage
    const response = await fetch(resumeUrl, {
      headers: {
        Accept: "application/pdf",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    // Get the PDF blob
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    // Return the PDF with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Gaurav_Resume.pdf"',
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error proxying resume:", error);
    return NextResponse.json(
      { error: "Failed to load resume" },
      { status: 500 }
    );
  }
}
