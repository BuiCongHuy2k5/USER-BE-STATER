import { Logger } from "@Decorators/Logger";
import Redis  from "ioredis";
import { Inject, Service } from "typedi";
import winston from "winston";
import { RestRoles } from "@Enums/RestRoles";
import { NotFoundError } from "routing-controllers";
import { DeepPartial } from "typeorm";
import { PublisherRepository } from "@Repositories/PublisherRepository";
import { CreatePublisherInput } from "./types/CreatePublisherInput";
import { Publisher } from "databases/postgres/entities/Publisher";
import { UpdatePublisherInput } from "./types/UpdatePublisherInput";

@Service()
export class PublisherService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly publisherRepo: PublisherRepository
  ) {}

  async createPublisher(input: CreatePublisherInput): Promise<Publisher> {
    const publisher = new Publisher();
    publisher.publisherCode = input.publisherCode;
    publisher.publisherName = input.publisherName;
    publisher.status = RestRoles.ACTIVE;

    return this.publisherRepo.create(publisher);
  }

  async getById(publisherId: number): Promise<Publisher> {
    const publisher = await this.publisherRepo.getById(publisherId);
    if (!publisher) {
      throw new NotFoundError(`PUBLISHER NOT FOUND ID: ${publisherId}`);
    }
    return publisher;
  }

  async search(filters: { publisherName?: string }): Promise<Publisher[]> {
      const results = await this.publisherRepo.search(filters);
      if (results.length === 0) {
        throw new NotFoundError(`NO PUBLISHER FOUND MATCHING FILTERS`);
      }
      return results;
    }

  async partialUpdate(input: UpdatePublisherInput): Promise<Publisher> {
    const publisher = await this.publisherRepo.getById(input.publisherId);
    if (!publisher) {
      throw new NotFoundError(`PUBLISHER NOT FOUND`);
    }
  
    const { publisherId, ...updateData } = input;
  
    return this.publisherRepo.partialUpdate(publisherId, updateData as DeepPartial<Publisher>);
  }

  async delete(publisherId: number): Promise<{ message: string }> {
    const publisher = await this.publisherRepo.getById(publisherId);
    if (!publisher) {
      throw new NotFoundError(`PUBLISHER NOT FOUND ID: ${publisherId}`);
    }

    await this.publisherRepo.delete(publisherId);
    return { message: `DELETE PUBLISH ID: ${publisherId}` };
  }

  async inactivePublisher(id: number): Promise<{ message: string }> {
    const publisher = await this.publisherRepo.getById(id);
    if (!publisher) {
      throw new NotFoundError(`PUBLISHER NOT FOUND ID: ${id}`);
    }
  
    await this.publisherRepo.partialUpdate(id, { status: RestRoles.INACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
    }
  
    async restore(id: number): Promise<{message: string}> {
    const publisher = await this.publisherRepo.getById(id);
    if (!publisher) {
      throw new NotFoundError(`PUBLISHER NOT FOUND ID: ${id}`);
    }
  
    if (publisher.status === RestRoles.ACTIVE) {
      return { message: `PUBLISH ID ${id} IS ALREADY ACTIVE` };
    }
  
    await this.publisherRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }

}
