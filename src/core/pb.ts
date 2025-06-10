import pocketbase, { RecordService } from "pocketbase";
import type { MyceliumInstance, PBMycelium, Run } from "./types";
import { runs, updateAvailable } from "../stores/runs";

export default class PB {
  private static instance: PB | null = null;
  private myceliumCollection: RecordService<PBMycelium>;

  constructor() {
    console.log("url:", import.meta.env.VITE_PB_URL);
    const p = new pocketbase(import.meta.env.VITE_PB_URL);
    p.autoCancellation(false);
    this.myceliumCollection = p.collection("mycelium");

    this.getAll()
      .then((r) => {
        runs.set(r);
        this.myceliumCollection.subscribe("*", async () => {
          updateAvailable.set(true);
        });
      })
      .catch((error) => {
        console.log("some error happend: ", error);
      });
  }

  public static getInstance(): PB {
    if (!this.instance) {
      this.instance = new PB();
    }

    return this.instance;
  }

  public async getAll(): Promise<Run[]> {
    try {
      let page = 1;
      const perPage = 500;
      const mycelium: PBMycelium[] = [];
      let response = await this.myceliumCollection.getList(page, perPage);
      mycelium.push(...response.items);
      while (response.page <= response.totalPages) {
        page++;
        response = await this.myceliumCollection.getList(page, perPage);
        mycelium.push(...response.items);
      }

      const runsRecord: Record<number, Run> = {};

      mycelium.forEach((m) => {
        if (!runsRecord[m.run])
          runsRecord[m.run] = {
            index: m.run,
            instances: [],
          };

        runsRecord[m.run].instances.push({
          id: m.id,
          run: m.run,
          segmented: m.segmented,
          estimatedDay: m.estimatedDay,
          actualDay: Math.round(m.hour / 24),
        });
      });

      const runs: Run[] = [];

      for (const key in runsRecord) {
        runs.push(runsRecord[key]);
      }

      return runs;
    } catch (error) {
      console.error("couldn't get runs: ", error);
      return [];
    }
  }
}
