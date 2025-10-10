// app\api\create-payment-intent\route.ts
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("Received body in API route:", body)

    // Calculate amount from cart items or direct amount
    const amountToCharge =
      body.amount ||
      Math.round(
        (body.items || []).reduce(
          (total: number, item: { price: number; quantity: number }) => total + item.price * item.quantity,
          0,
        ),
      )

    // Prepare data for FastAPI exactly as expected
    const paymentData = {
      first_name: body.first_name || "",
      last_name: body.last_name || "",
      country: body.country || "",
      address: body.address || "",
      address_2: body.address_2 || "",
      city: body.city || "",
      postcode: body.postcode || "",
      phone_no: body.phone_no || "",
      address_type: body.address_type || 0,
      different_billing_first_name: body.different_billing_first_name || "",
      different_billing_last_name: body.different_billing_last_name || "",
      different_billing_country: body.different_billing_country || "",
      different_billing_address: body.different_billing_address || "",
      different_billing_address_2: body.different_billing_address_2 || "",
      different_billing_city: body.different_billing_city || "",
      different_billing_postcode: body.different_billing_postcode || "",
      different_billing_phone_no: body.different_billing_phone_no || "",
      amount: amountToCharge,
      currency: body.currency || "gbp",
      receipt_email: body.receipt_email || body.email || "",
      order_id: body.order_id || `order_${Date.now()}`,
      metadata: body.metadata || {},
    }

    const url = process.env.NEXT_PUBLIC_CREATE_PAYMENT_INTENT_URL
    if (!url) {
      throw new Error("NEXT_PUBLIC_CREATE_PAYMENT_INTENT_URL is not defined")
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      try {
        const errorData = JSON.parse(errorText)
        return NextResponse.json(
          { error: errorData.message || "Failed to create payment intent" },
          { status: response.status },
        )
      } catch (e) {
        console.error(e)
        return NextResponse.json({ error: errorText || "Failed to create payment intent" }, { status: response.status })
      }
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}