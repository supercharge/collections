'use strict'

export interface QueueItem {
  /**
   * Stores the parameter data for the collection method.
   */
  data?: any

  /**
   * Identifies the collection method.
   */
  method: string

  /**
   * Stores the user-land callback processing in the collection method.
   */
  callback?: Function
}
