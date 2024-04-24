import type { ToastContainerProps, ToastPosition } from 'react-toastify'
import { toast } from 'react-toastify'

export const toastDefaultOptions: ToastContainerProps = {
  position: 'bottom-center' as ToastPosition,
  autoClose: 1200,
  hideProgressBar: true,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: false,
  draggable: true,
  pauseOnHover: true,
  theme: 'dark',
}

export const toastOptions: ToastContainerProps = {
  position: 'bottom-center' as ToastPosition,
  autoClose: 1200,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
}

export const _toast = {
  success: (message: string) => {
    toast.success(message, toastOptions)
  },
  error: (message: string) => {
    toast.error(message, toastOptions)
  },
}
