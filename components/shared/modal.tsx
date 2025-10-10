"use client"
import type { ReactNode } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

interface ModalProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  showCloseIcon?: boolean // Optional prop to control close icon visibility
}

export default function Modal({ children, isOpen, onClose, showCloseIcon = true }: ModalProps) {
  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] p-4"
      onClick={onClose} // Close modal when clicking on backdrop
    >
      {showCloseIcon && (
          <button
            onClick={onClose}
            className="absolute top-3 right-2 p-2 text-black bg-gray-100 rounded-full transition-colors z-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      <div
        className="bg-white w-full sm:w-[85%] md:w-[75%] lg:w-[65%] p-4 sm:p-6 rounded-lg relative max-h-[100vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
