import { Knex } from 'knex'
import { DBVersion } from '@icalingua/types/SQLTableTypes'

const upg = async (db: Knex, mainDbVersion: number) => {
    await db.schema.alterTable('dbVersion', (table) => {
        table.integer('fsForkDbVersion')
    })
    await db.schema.alterTable('rooms', (table) => {
        table.string('cryptSecret').nullable()
    })
    await db<DBVersion>('dbVersion').update({ dbVersion: mainDbVersion, fsForkDbVersion: 1 })
}

export default upg
