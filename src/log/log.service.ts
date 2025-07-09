import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async createLog(logData: {
    usuarioId: number;
    accion: string;
    ruta: string;
    metodo: string;
  }): Promise<Log> {
    const nuevoLog = this.logRepository.create(logData);
    return this.logRepository.save(nuevoLog);
  }
}