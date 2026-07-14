export const RazorpayRouteCode = `
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'missing',
      key_secret: process.env.RAZORPAY_SECRET || 'missing',
    });
    
    const options = { amount: parseInt(amount) * 100, currency: "INR" };
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`.trim();

export const RazorpayButtonCode = `
"use client";
export function RazorpayButton({ amount }: { amount: string }) {
  const handlePay = async () => {
    alert('Connecting to Razorpay Backend API to create order for ₹' + amount);
    // Real implementation would fetch /api/checkout and trigger razorpay window
  };
  return (
    <button onClick={handlePay} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105 transition-all">
      Buy Now for ₹{amount}
    </button>
  );
}
`.trim();
