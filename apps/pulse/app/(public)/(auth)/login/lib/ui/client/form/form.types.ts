import { StateUpdater } from "@lib/state"
import { SchemaState, FieldErrors } from "@lib/validation"

import { LoginState } from "@login/state"

import { LoginFormSchema } from "./form.validation"
import { LoginAction } from "../../actions/form.action"

export interface LoginFormState
  extends LoginState,
    SchemaState<LoginFormSchema> {
  hasInteractedWithEmail: boolean
  hasInteractedWithPassword: boolean
}

export interface LoginSubmitInput {
  loginAction: LoginAction
  formState: LoginFormState
  updater: StateUpdater<LoginFormState>
}

export interface LoginSubmitMap {
  draft: LoginFormState
  isPending: boolean
  fieldErrors?: FieldErrors<LoginFormSchema>
}
