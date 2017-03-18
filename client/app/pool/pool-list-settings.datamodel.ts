/**
 * Created by jheinnic on 2/5/17.
 */
import {
  buildMethodFactory, deriveFactoryWrapper, ReflectiveBuilder
} from "../../../common/lib/datamodel-ts/index";

const poolListSettingsWrapper: ReflectiveBuilder<PoolListUserSettings> = deriveFactoryWrapper<PoolListUserSettings>(['newPoolDefaultChain']);

export type OrderCriteria = 'name' | 'created' | 'modified' | 'size'
export type OrderDirection = 'ascending' | 'descending';
export class SortStep
{
  constructor(
    public readonly criteria: OrderCriteria, public readonly direction: OrderDirection
  ) {
  }
}

export class PoolListUserSettings
{
  newPoolDefaultChain: string;
  filterByChains: Immutable.List<string>;
  orderBy: Immutable.List<OrderCriteria>;


  static build = buildMethodFactory(poolListSettingsWrapper, PoolListUserSettings);

  constructor() { }

}

// public get targetImageChain(): Observable<ImageChainDef> {
//   let chains: Observable<ImageChainDef[]> = this.imageStore.getAllChainDefinitions();
//
//   return chains.flatMap((value: ImageChainDef[]) =>
//     Observable.from(value)
//       .filter((nextValue: ImageChainDef) =>
//         nextValue.uuid === this.targetImageChainUuid));
// }
