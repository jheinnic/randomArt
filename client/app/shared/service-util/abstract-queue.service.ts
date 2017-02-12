/**
 * Created by jheinnic on 2/1/17.
 */
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import Immutable = require('immutable');


export class AbstractQueueService<T>
{
  private content: Immutable.List<T> = Immutable.List<T>();
  private changes: BehaviorSubject<QueueChange<T>>;

  constructor() {
    this.changes = new BehaviorSubject<QueueChange<T>>({
      kind: 'create',
      newContent: this.content
    });
  }

  onChanged() {
    return this.changes.asObservable();
  }

  offer(item: T) {
    this.content = this.content.push(item);
    this.changes.next({
      kind: 'offer',
      newContent: this.content,
      offeredItem: item
    });
  }

  take(): T {
    let retVal: T = undefined;
    if (!this.content.isEmpty()) {
      retVal = this.content.first();
      this.content = this.content.unshift();

      this.changes.next({
        kind: 'take',
        newContent: this.content,
        takenItem: retVal
      });
    }

    return retVal;
  }

  peek(): T {
    let retVal: T;
    if (!this.content.isEmpty()) {
      retVal = this.content.first();
    }
    return retVal;
  }

  remove(index: number) {
    if (index < 0 || index >= this.content.size) {
      throw new Error('Index Out Of Bounds: ' + index);
    }

    const retVal: T = this.content.get(index);
    this.content = this.content.remove(index);

    this.changes.next({
      kind: 'remove',
      newContent: this.content,
      removedItem: retVal,
      removedIndex: index
    });
  }

  replace(index: number, item: T) {
    if (index < 0 || index >= this.content.size) {
      throw new Error('Index Out Of Bounds: ' + index);
    }

    const retVal: T = this.content.get(index);
    this.content = this.content.remove(index);

    this.changes.next({
      kind: 'remove',
      newContent: this.content,
      removedItem: retVal,
      removedIndex: index
    });
  }

  swap(firstIndex: number, secondIndex: number) {
    if ((firstIndex < 0) || (firstIndex >= this.content.size)) {
      throw new Error('Index Out Of Bounds: ' + firstIndex);
    }
    if ((secondIndex < 0) || (secondIndex >= this.content.size)) {
      throw new Error('Index Out Of Bounds: ' + secondIndex);
    }

    if (firstIndex !== secondIndex) {
      const first: T = this.content.get(firstIndex);
      const second: T = this.content.get(secondIndex);
      this.content = this.content.set(firstIndex, second);
      this.content = this.content.set(secondIndex, first);

      this.changes.next({
        kind: 'swap',
        newContent: this.content,
        firstItem: first,
        secondItem: second,
        firstIndex: firstIndex,
        secondIndex: secondIndex
      });
    }
  }

  count(): number {
    return this.content.size;
  }
}


export type QueueChangeType = 'create' | 'offer' | 'take' | 'remove' | 'swap' | 'replace';

export interface CreateQueueChange<T>
{
  readonly kind: QueueChangeType & 'create';
  readonly newContent: Immutable.List<T>;

  constructor
}

export interface OfferQueueChange<T>
{
  readonly kind: QueueChangeType & 'offer';
  readonly newContent: Immutable.List<T>;
  readonly offeredItem: T;
}

export interface TakeQueueChange<T>
{
  readonly kind: QueueChangeType & 'take';
  readonly newContent: Immutable.List<T>;
  readonly takenItem: T;
}

export interface RemoveQueueChange<T>
{
  readonly kind: QueueChangeType & 'remove';
  readonly newContent: Immutable.List<T>;
  readonly removedItem: T;
  readonly removedIndex: number;
}

export interface SwapQueueChange<T>
{
  readonly kind: QueueChangeType & 'swap';
  readonly newContent: Immutable.List<T>;
  readonly firstItem: T;
  readonly secondItem: T;
  readonly firstIndex: number;
  readonly secondIndex: number;
}

export interface ReplaceQueueChange<T>
{
  readonly kind: QueueChangeType & 'replace';
  readonly newContent: Immutable.List<T>;
  readonly newItem: T;
  readonly oldItem: T;
  readonly replacedIndex: number;
}

export type QueueChange<T> = CreateQueueChange<T> | OfferQueueChange<T> | TakeQueueChange<T> | RemoveQueueChange<T> | SwapQueueChange<T> | ReplaceQueueChange<T>;

