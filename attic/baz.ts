export type Record<K extends string, T> = { [P in K]: T; }
export type Flags<K extends string> = Record<K, boolean>

export type KeyToValue<T extends string> = { [P in keyof T]: P }
export type KeyToValueTwo<T extends string> = Record<T, T>

export type StableState = 'CONFIGURABLE' | 'READY' | 'WORKING' | 'PAUSED' | 'FINISHED' | 'SOFT_ERROR' | 'FATAL_ERROR';
export type TransitionState = 'INITIALIZING' | 'LAUNCHING' | 'PAUSING' | 'RESUMING' | 'FINISHING' | 'ABORTING' | 'SOFT_FAILURE' | 'HARD_FAILURE' | 'FAULTING' | 'RETYING' | 'ACKNOWLEDGING';

export type StableStateKeys = KeyToValue<StableState>;
export type TransitionStateKeys = KeyToValue<TransitionState>;

export const STABLE: StableStateKeys = {
  CONFIGURABLE: 'CONFIGURABLE'
};

