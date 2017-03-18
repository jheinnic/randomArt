/**
 * Created by jheinnic on 2/28/17.
 */
import {CpuInfo, cpus} from "os";

export class ProcService {
  private readonly cpuData: CpuInfo[];
  private readonly cpuCount: number;

  constructor() {
    this.cpuData = cpus();
    this.cpuCount = this.cpuData.length;
  }

  report() {
    console.log(this.cpuData);
    console.log(this.cpuCount);
  }
}

const ps = new ProcService();
ps.report();

