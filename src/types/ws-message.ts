export type MessageStruct<TType, TPayload = undefined> = {
  type: TType
  payload?: TPayload
}

export type MessageStructRequiredPayload<TType, TPayload> = {
  type: TType
  payload: TPayload
}

export type WSMessage<S, T> = {
  data: MessageStruct<S, T>
}
