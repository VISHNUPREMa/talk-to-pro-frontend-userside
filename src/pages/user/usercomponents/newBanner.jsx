import React from 'react'
import { Info, X } from 'lucide-react'

export function InfoBanner() {
  return (
    <div className="rounded-md border-l-4 border-black bg-gray-100 p-4">
      <div className="flex items-center justify-between space-x-4">
        <div>
          <Info className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium">
            This is some informational text that you can use to show some informational content
          </p>
        </div>
        <div>
          <X className="h-6 w-6 cursor-pointer" />
        </div>
      </div>
    </div>
  )
}


