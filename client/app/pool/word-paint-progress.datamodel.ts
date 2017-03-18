/**
 * Created by jheinnic on 2/12/17.
 */
import {PaintablePoint} from "../shared/canvas-util/point.datamodel";
import {
  deriveFactoryWrapper, copyMethodFactory, buildMethodFactory, KeyToValue
} from "../../../common/lib/datamodel-ts/index";

const initialPaintProgressWrapper =
  deriveFactoryWrapper<InitialPaintProgress>(['width', 'height']);

export class InitialPaintProgress {
  public readonly kind = 'initial';
  public readonly width: number;
  public readonly height: number;

  copy = copyMethodFactory(initialPaintProgressWrapper);

  static build =
    buildMethodFactory(initialPaintProgressWrapper, InitialPaintProgress);

  constructor() { }
}


/**
 * Encapsulation for a partial set of paintable pixels, giving
 */
const incremenatalPaintProgressWrapper =
  deriveFactoryWrapper<IncrementalPaintProgress>(['paintPoints', 'pctDone']);

export class IncrementalPaintProgress
{
  public readonly kind = 'incremental';
  public readonly paintPoints: PaintablePoint[];
  public readonly pctDone: number;

  copy = copyMethodFactory(incremenatalPaintProgressWrapper);

  static build =
    buildMethodFactory(incremenatalPaintProgressWrapper, IncrementalPaintProgress);

  constructor() { }
}

export type PaintProgress = InitialPaintProgress | IncrementalPaintProgress;

type PaintProgressKindStrings = 'initial' | 'incremental';

export const PaintProgressKind: KeyToValue<PaintProgressKindStrings> = {
  initial: "initial",
  incremental: "incremental"
};

// const paintProgressWrapper = deriveFactoryWrapper<PaintProgress>(
//   new PaintProgress());

// let test = PaintProgress.build((builder) => {builder.paintPoints([]).pctDone(40)});
// let test2 = test.copy((builder) => {builder.paintPoints([]).pctDone(40)});
// console.log(test);
// console.log(test2);
