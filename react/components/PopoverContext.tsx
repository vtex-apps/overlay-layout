import React, { createContext, useReducer, useContext } from 'react'

interface State {
  open: boolean
  containerRef?: React.RefObject<HTMLDivElement> | null
}

const DEFAULT_STATE = {
  open: false,
  containerRef: null,
}

interface OpenAction {
  type: 'OPEN_POPOVER'
}

interface CloseAction {
  type: 'CLOSE_POPOVER'
}

interface SetContainerRefAction {
  type: 'SET_CONTAINER_REF'
  payload: { containerRef: React.RefObject<HTMLDivElement> }
}

type Action = OpenAction | CloseAction | SetContainerRefAction
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
