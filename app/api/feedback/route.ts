import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzCTeSB-_cXFC_uFy4i8X7rkUoX6h_NmK4QtjdfI4j9Wjr0xhb5sGc3ZSz_I9wiyQkv-g/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Apps Script error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json(
      { message: "Success!", data },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Feedback API error:", err);
    return Response.json(
      { message: "Failed to send feedback", error: err.message },
      { status: 500 }
    );
  }
}
