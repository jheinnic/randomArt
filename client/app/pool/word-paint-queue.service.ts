/**
 * Created by jheinnic on 2/1/17.
 */
import {Injectable} from "@angular/core";
import {AbstractQueueService} from "../shared/service-util/abstract-queue.service";
import {WordPaintTask} from "./word-paint-task.datamodel";

@Injectable()
export class WordPaintQueueService extends AbstractQueueService<WordPaintTask>
{
  constructor() {
    super();
  }

}

