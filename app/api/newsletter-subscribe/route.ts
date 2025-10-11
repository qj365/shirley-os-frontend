import { NextRequest, NextResponse } from 'next/server'
import MailerLite from '@mailerlite/mailerlite-nodejs'

const mailerLite = new MailerLite({
  api_key: process.env.NEXT_PUBLIC_MAILERLITE_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Subscribe to MailerLite
    await mailerLite.subscribers.createOrUpdate({
      email,
      groups: [process.env.NEXT_PUBLIC_MAILERLITE_GROUP_ID!],
      status: 'active',
    })

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!' },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Newsletter subscription error:', error)
    
    // Handle specific MailerLite errors
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { status?: number } }
      if (apiError.response?.status === 422) {
        return NextResponse.json(
          { error: 'Email already subscribed or invalid' },
          { status: 422 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}