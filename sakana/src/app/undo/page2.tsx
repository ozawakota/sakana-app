'use client'

import UndoApp from './components/UndoApp'
import { Provider } from 'jotai'

export default function Page() {
  return (
    <Provider>
      <UndoApp />
    </Provider>
  )
}