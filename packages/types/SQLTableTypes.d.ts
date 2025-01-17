import Message from './Message'

export interface MsgTableName {
    id: number
    tableName: string
}

export interface DBVersion {
    dbVersion: number
    fsForkDbVersion: number
}

export interface MessageInSQLDB extends Message {
    roomId: number | string
}
