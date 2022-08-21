import { Reducer, useReducer } from "react";

type InputState = {
  [key: string]: any;
};

type InputAction = {
  [key: string]: string;
};

const inputReducer = <S, T>(state: S, action: T) => {
  return {
    ...state,
    ...action,
  };
};

export const useMultiInputs = <T extends InputState>(
  initialState: T | null
) => {
  const [inputs, registerInput] = useReducer<Reducer<T, InputAction>>(
    inputReducer,
    initialState || ({} as T)
  );

  return [inputs, registerInput] as const;
};
