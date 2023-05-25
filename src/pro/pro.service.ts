import { Injectable } from "@nestjs/common";

@Injectable()
export class ProService {
  getPro(): string {
    const waitTill = new Date(new Date().getTime() + 5 * 1000);
    while (waitTill > new Date()) {}
    const pros = ["Akhilesh Manda", "Dhruv Dave", "Kalash Shah"];
    const index = Math.floor(Math.random() * 3);
    return pros[index];
  }

  setPro(setProInput: string): string {
    return setProInput;
  }
}
