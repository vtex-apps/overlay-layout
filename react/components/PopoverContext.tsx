import React, { createContext, useReducer, useContext } from 'react'

import { TriggerElement, TriggerMode } from '../Trigger'

interface State {
  open: boolean
  containerRef?: React.RefObject<TriggerElement> | null
  triggerMode: TriggerMode
}

const DEFAULT_STATE: State = {
  open: false,
  containerRef: null,
  triggerMode: 'click',
}

interface OpenAction {
  type: 'OPEN_POPOVER'
}

interface CloseAction {
  type: 'CLOSE_POPOVER'
}

interface SetContainerRefAction {
  type: 'SET_CONTAINER_REF'
  payload: { containerRef: React.RefObject<TriggerElement> }
}

interface SetTriggerModeAction {
  type: 'SET_TRIGGER_MODE'
  payload: { triggerMode: TriggerMode }
}

type Action =
  | OpenAction
  | CloseAction
  | SetContainerRefAction
  | SetTriggerModeAction
type Dispatch = (action: Action) => void

const PopoverStateContext = createContext<State>(DEFAULT_STATE)
const PopoverDispatchContext = createContext<Dispatch | undefined>(undefined)

function popoverContextReducer(state: State = DEFAULT_STATE, action: Action) {
  switch (action.type) {
    case 'OPEN_POPOVER':
      return {
        ...state,
        open: true,
      }
    case 'CLOSE_POPOVER':
      return {
        ...state,
        open: false,
      }
    case 'SET_CONTAINER_REF':
      return {
        ...state,
        containerRef: action.payload?.containerRef,
      }
    case 'SET_TRIGGER_MODE':
      return {
        ...state,
        triggerMode: action.payload?.triggerMode,
      }
    default:
      return state
  }
}

export const PopoverContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(popoverContextReducer, DEFAULT_STATE)

  return (
    <PopoverStateContext.Provider value={state}>
      <PopoverDispatchContext.Provider value={dispatch}>
        {children}
      </PopoverDispatchContext.Provider>
    </PopoverStateContext.Provider>
  )
}

export function usePopoverDispatch() {
  const context = useContext(PopoverDispatchContext)
  return context
}

export function usePopoverState() {
  const context = useContext(PopoverStateContext)
  if (typeof context === 'undefined') {
    throw Error('usePopoverState must be used within a PopoverStateContext')
  }

  return context
}
