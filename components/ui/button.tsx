import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-medium rounded-md px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",{
    variants: {
        variant: {
            primary: "bg-purple-600 text-white hover:bg-purple-700",
            secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        }
    }
});