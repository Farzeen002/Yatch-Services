import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { from, to, subject, body } = await req.json();

    console.log("📧 [TEST MODE EMAIL]");
    console.log("From:", from);
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Body:", body);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: "✅ Test email sent successfully (simulated).",
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { success: false, message: "❌ Failed to send test email." },
      { status: 500 }
    );
  }
}
