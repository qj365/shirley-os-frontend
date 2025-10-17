import { toast } from 'sonner';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toastErrorMessage = (error: any) => {
  console.log('Error: ', JSON.stringify(error || {}));
  void toast.error(
    error?.body?.details ||
      error?.body?.message ||
      'An error occurred, please try again later.'
  );
};
