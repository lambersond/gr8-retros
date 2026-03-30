export interface UpdateBoardColumn {
  id: string | number
  isNew?: boolean
  index: number
  columnType: string
  label: string
  emoji: string
  tagline: string
  placeholder: string
  lightBg: string
  lightBorder: string
  lightTitleBg: string
  lightTitleText: string
  darkBg: string
  darkBorder: string
  darkTitleBg: string
  darkTitleText: string
}

export interface DeleteOperation {
  id: string
}

export interface CreateOperation {
  boardSettingsId: string
  index: number
  columnType: string
  label: string
  emoji: string
  tagline: string
  placeholder: string
  lightBg: string
  lightBorder: string
  lightTitleBg: string
  lightTitleText: string
  darkBg: string
  darkBorder: string
  darkTitleBg: string
  darkTitleText: string
}

export interface UpdateOperation {
  id: string
  data: {
    index: number
    columnType: string
    label: string
    emoji: string
    tagline: string
    placeholder: string
    lightBg: string
    lightBorder: string
    lightTitleBg: string
    lightTitleText: string
    darkBg: string
    darkBorder: string
    darkTitleBg: string
    darkTitleText: string
  }
}

export interface ColumnOperations {
  deletes: DeleteOperation[]
  creates: CreateOperation[]
  updates: UpdateOperation[]
}
