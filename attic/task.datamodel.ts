import {Partial} from "../../../../common/lib/datamodel-ts/index";
/**
 * Created by jheinnic on 1/22/17.
 */

export class TaskProgress<T,S,P> {
  public readonly activeTask: T = undefined;
  public readonly latestStep: S = undefined;
  public readonly latestProgress: P = undefined;

  constructor(base?: TaskProgress<T,S,P>, overrides?: Partial<TaskProgress<T,S,P>>) {
    Object.assign(this, base, overrides);
  }

  public withError(err: any): TaskError<T,S,P> {
    return new TaskError(
      new TaskError(undefined, this),
      {error: err}
    );
  }
}

export class TaskError<T,S,P> extends TaskProgress<T,S,P> {
  public readonly error: any = 'error';

  constructor(base?: TaskError<T,S,P>, overrides?: Partial<TaskError<T,S,P>>) {
    super(base, overrides);
  }
}
