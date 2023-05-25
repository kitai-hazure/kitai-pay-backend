import { Module } from "@nestjs/common";
import { ProService } from "./pro.service";
import { ProResolver } from "./pro.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { ProSchema } from "./pro.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Pro", schema: ProSchema }])],
  providers: [ProResolver, ProService],
})
export class ProModule {}
