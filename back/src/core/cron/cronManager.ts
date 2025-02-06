import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronManager implements OnModuleDestroy {
  private readonly logger: Logger = new Logger(CronManager.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {
    this.logger.log('CronManager initialized');
  }

  addCronJob(name: string, cronExpression: string, callback: () => void) {
    const job = new CronJob(cronExpression, callback);
    this.schedulerRegistry.addCronJob(name, job);
    this.logger.log(`Cron job ${name} added`);
  }

  onModuleDestroy() {
    const cronJobs = this.schedulerRegistry.getCronJobs();
    cronJobs.forEach((job, name) => {
      job.stop();
      this.logger.log(`Cron job ${name} stopped`);
    });
  }
}
