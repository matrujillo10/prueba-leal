import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError, FindConditions } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findOne(query: FindConditions<User>): Promise<User> {
    return this.userRepository.findOne(query);
  }

  async register(user: User) {
    const newUser = this.userRepository.create(user);
    
    // Guarda
    const queryFailedGuard = (err: any): err is QueryFailedError & { code: string } => err instanceof QueryFailedError;

    this.logger.log(`Creando usuario ${newUser.email}`);

    return await this.userRepository.save(newUser)
    .then((data: User) => {
      // El usuario se creo sin problemas, se devuelve el id del usuario
      this.logger.log(`Usuario ${newUser.email} creado`);
      return {
        status: 'ok',
        data: {
          user_id: data.user_id
        }
      }
    })
    .catch((err: any) => {
      var message = {}
      if (queryFailedGuard(err)) {
        switch (err.code) {
          case 'ER_DUP_ENTRY': // Este error se dará si el usuario ya existe
          this.logger.log(`El usuario ${newUser.email} ya existe`);
            message = {
              status: 'error',
              data: {
                message: `User with email ${newUser.email} already exists`
              }
            };
            break;
          default:
            // Dejamos trace del error que no conocemos
            this.logger.error(err);
            message = {
              status: 'error',
              data: {
                message: `Unable to create the user[${newUser.email}].`
              }
            };
            break;
        } 
      } else {
        // Dejamos trace del error que no conocemos
        this.logger.error(err);
        message = {
          status: 'error',
          data: {
            message: `Unable to create the user[${newUser.email}].`
          }
        };
      }
      return message;
    })
  }
}
