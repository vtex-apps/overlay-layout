import React, { createContext, useReducer, useContext } from 'react'

import { TriggerMode } from './OverlayTrigger'

interface State {
  open: boolean
  containerRef?: React.RefObject<HTMLElement> | null
  triggerMode: TriggerMode
  exited: boolean
}

const DEFAULT_STATE: State = {
  open: false,
  exited: false,
  containerRef: null,
  triggerMode: 'click',
}

interface OpenAction {
  type: 'OPEN_OVERLAY'
}

interface CloseAction {
  type: 'CLOSE_OVERLAY'
}

interface SetExitedAction {
  type: 'SET_EXITED'
  payload: { exited: boolean }
}

interface SetContainerRefAction {
  type: 'SET_CONTAINER_REF'
  payload: { containerRef: React.RefObject<HTMLElement> }
}

interface SetTriggerModeAction {
  type: 'SET_TRIGGER_MODE'
  payload: { triggerMode: TriggerMode }
}

type Action =
  | OpenAction
  | CloseAction
  | SetExitedAction
  | SetTriggerModeAction
  | SetContainerRefAction
type Dispatch = (action: Action) => void

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}
const OverlayStateContext = createContext<State>(DEFAULT_STATE)
const OverlayDispatchContext = createContext<Dispatch>(noop)

function overlayContextReducer(state: State = DEFAULT_STATE, action: Action) {
  switch (action.type) {
    case 'OPEN_OVERLAY':
      return {
        ...state,
        open: true,
      }
    case 'CLOSE_OVERLAY':
      return {
        ...state,
        open: false,
      }
    case 'SET_CONTAINER_REF':
      return {
        ...state,
        containerRef: action.payload.containerRef,
      }
    case 'SET_TRIGGER_MODE':
      return {
        ...state,
        triggerMode: action.payload.triggerMode,
      }
    case 'SET_EXITED': {
      return {
        ...state,
        exited: action.payload.exited,
      }
    }
    default:
      return state
  }
}

export const OverlayContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(overlayContextReducer, DEFAULT_STATE)

  return (
    <OverlayStateContext.Provider value={state}>
      <OverlayDispatchContext.Provider value={dispatch}>
        {children}
      </OverlayDispatchContext.Provider>
    </OverlayStateContext.Provider>
  )
}

export function useOverlayDispatch() {
  return useContext(OverlayDispatchContext)
}

export function useOverlayState() {
  const context = useContext(OverlayStateContext)
  if (typeof context === 'undefined') {
    throw Error('useOverlayState must be used within a OverlayStateContext')
  }

  return context
}

export default {
  useOverlayState,
  useOverlayDispatch,
}
