import type { Model } from 'mongoose'
import { BlogPost } from '~/server/models/BlogPost'
import { Branch } from '~/server/models/Branch'
import { Career } from '~/server/models/Career'
import { Client } from '~/server/models/Client'
import { ContactPerson } from '~/server/models/ContactPerson'
import { ContactSubmission } from '~/server/models/ContactSubmission'
import { Category } from '~/server/models/Category'
import { Gallery } from '~/server/models/Gallery'
import { Leader } from '~/server/models/Leader'
import { Service } from '~/server/models/Service'
import { Setting } from '~/server/models/Setting'

export interface BackupRegistryEntry {
  model: Model<any>
  /** Fields backed by a unique index, used to reject ambiguous merge targets. */
  uniqueKeys?: readonly string[]
  containsPersonalData?: boolean
  note?: string
}

export const BACKUP_REGISTRY: readonly BackupRegistryEntry[] = [
  { model: Setting, uniqueKeys: ['key'] },
  { model: Branch },
  { model: Service, uniqueKeys: ['slug'] },
  { model: Leader },
  { model: Client },
  { model: Gallery },
  { model: Career },
  { model: BlogPost, uniqueKeys: ['slug'] },
  { model: Category, uniqueKeys: ['slug'] },
  { model: ContactPerson },
  { model: ContactSubmission, containsPersonalData: true },
]

export function getBackupRegistryByCollection() {
  return new Map(BACKUP_REGISTRY.map((entry) => [entry.model.collection.collectionName, entry]))
}
