export interface NewsletterSubscriptionData {
  email: string
}

export interface NewsletterResponse {
  message: string
  error?: string
}

export const subscribeToNewsletter = async (
  email: string
): Promise<NewsletterResponse> => {
  try {
    const response = await fetch('/api/newsletter-subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Subscription failed')
    }

    return data
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Network error occurred')
  }
}