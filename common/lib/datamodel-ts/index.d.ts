/**
 * Created by jheinnic on 1/1/17.
 */
import {TypeDecorator} from "@angular/core";

export interface DataModelDecorator {
  /**
   * Declare immutable data model.
   */
  (obj: DataModel): TypeDecorator;
  /**
   * See the {@link DataModel} decorator.
   */
  new (obj: DataModel): DataModel;
}
/**
 * Type of the DataModel metadata.
 *
 * @stable
 */
export interface DataModel {
  name: string;
  builder?: string;
}
/**
 * Pipe decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export declare const DataModel: DataModelDecorator;

/**
 * Type of the Collection decorator / constructor function.
 *
 * @stable
 */
export interface CollectionDecorator {
  /**
   * `Input` takes an optional parameter that specifies the name
   * used when instantiating a component in the template. When not provided,
   * the name of the decorated property is used.
   *
   * ```typescript
   * class BankAccount {
   *   @Collection() bankName: string;
   *   @Collection('account-id') id: string;
   * }
   */
  (bindingPropertyName?: string): any;
  new (bindingPropertyName?: string): any;
}
/**
 * Type of the Input metadata.
 */
export interface Collection {
  /**
   * Name used when instantiating a component in the template.
   */
  bindingPropertyName?: string;
  someProperty: string;
}
/**
 * Input decorator and metadata.
 * @Annotation
 */
export declare const Collection: CollectionDecorator;
