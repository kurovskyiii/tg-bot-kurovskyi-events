import { existsSync, writeFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { JSONFileSyncPreset } from 'lowdb/node'
import { mkdirpSync } from 'mkdirp'

import { NoDataException } from '@root/bot/common/exceptions/index.js'
import type { ID } from '@root/bot/common/values/id.js'

import type { LowSync } from 'node_modules/lowdb/lib/core/Low.js'
import type { SubscriptionTypes } from '@root/bot/common/constants.js'
import type { Db as DbStructure } from './types/db.js'

class Db {
  private db: LowSync<DbStructure>

  constructor(dbPath: string) {
    if (!existsSync(dbPath)) {
      mkdirpSync(dbPath.split(`/`).slice(0, -1).join(`/`))
      writeFileSync(dbPath, JSON.stringify({
        users: [],
        events: [],
        eventAgreements: [],
        subscriptions: [],
      }))
    }

    this.db = JSONFileSyncPreset<DbStructure>(dbPath, {
      users: [],
      events: [],
      eventAgreements: [],
      subscriptions: [],
    })
  }

  async checkUserExists({ id }: { id: ID }): Promise<boolean> {
    this.db.read()

    return this.db.data?.users.findIndex(u => u.id === id) >= 0
  }

  async registerUser({ id, firstName, lastName, username, languageCode }: { id: ID, firstName: string, lastName?: string, username?: string, languageCode?: string }): Promise<void> {
    this.db.read()

    const userIndex = this.db.data?.users.findIndex(u => u.id === id)

    if (userIndex >= 0) {
      Object.assign(this.db.data?.users[userIndex], {
        firstName,
        lastName,
        username,
        languageCode,
        updatedAt: new Date().toISOString(),
      })
    }
    else {
      this.db.data.users.push({
        id,
        firstName,
        lastName,
        username,
        languageCode,
        createdAt: new Date().toISOString(),
      })
    }

    this.db.write()
  }

  async checkUserAlreadySubscribedToNotifications({ userId, subscriptionType }: { userId: ID, subscriptionType: SubscriptionTypes }): Promise<boolean> {
    this.db.read()

    return this.db.data?.subscriptions.findIndex(s => s.userId === userId && s.type === subscriptionType) >= 0
  }

  async subscribeUserToNotifications({ userId, subscriptionType }: { userId: ID, subscriptionType: SubscriptionTypes }): Promise<void> {
    this.db.read()

    const isAlreadySubscribed = this.db.data?.subscriptions.findIndex(s => s.userId === userId && s.type === subscriptionType) >= 0

    if (isAlreadySubscribed) {
      return
    }

    this.db.data.subscriptions.push({
      userId,
      type: subscriptionType,
      createdAt: new Date().toISOString(),
    })

    this.db.write()
  }

  async getNotificationSubscriberIds({ subscriptionType }: { subscriptionType: SubscriptionTypes }): Promise<ID[]> {
    this.db.read()

    return this.db.data.subscriptions
      .filter(s => s.type === subscriptionType)
      .map(s => s.userId)
  }

  async addNewEvent({ description }: { description: string }): Promise<ID> {
    this.db.read()

    const id = randomUUID()

    this.db.data.events.push({
      id,
      description,
      createdAt: new Date().toISOString(),
    })

    this.db.write()

    return id
  }

  async acceptEvent({ userId, eventId }: { userId: ID, eventId: ID }): Promise<void> {
    this.db.read()

    const isAlreadyAccepted = this.db.data?.eventAgreements.findIndex(e => e.userId === userId && e.eventId === eventId) >= 0

    if (isAlreadyAccepted) {
      return
    }

    this.db.data.eventAgreements.push({
      userId,
      eventId,
      createdAt: new Date().toISOString(),
    })

    this.db.write()
  }

  async getEvent({ id }: { id: ID }) {
    this.db.read()

    const event = this.db.data?.events.find(e => e.id === id)

    if (!event) {
      throw new NoDataException(`Event with id ${id} not found.`)
    }

    return event
  }

  async checkUserAlreadyAcceptedEvent({ userId, eventId }: { userId: ID, eventId: ID }): Promise<boolean> {
    this.db.read()

    return this.db.data?.eventAgreements.findIndex(e => e.userId === userId && e.eventId === eventId) >= 0
  }
}

export const db = new Db(`data/db.json`)
