// import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { ClientProxy } from "@nestjs/microservices";
// import { firstValueFrom } from "rxjs";

// @Injectable()
// export class AuthGuard implements CanActivate {
//   private readonly logger = new Logger(AuthGuard.name);

//   constructor(
//     private readonly reflector: Reflector,
//     @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy
//   ) { }

//   public async canActivate(context: ExecutionContext): Promise<boolean> {
//     const secured = this.reflector.get<string[]>('secured', context.getHandler());

//     if (!secured) return true;

//     this.logger.log('Secured route');
//     const request = context.switchToHttp().getRequest();
//     const bearerToken = request.headers.authorization?.replace('Bearer ', '');
//     const userTokenInfo = await firstValueFrom(
//       this.userServiceClient.send('token_decode', {
//         token: bearerToken
//       })
//     )
//     if (!userTokenInfo || !userTokenInfo.userId) {
//       throw new UnauthorizedException({
//         message: 'Unauthorized',
//         data: null,
//         errors: null
//       });
//     };
//     const userInfo = await firstValueFrom(
//       this.userServiceClient.send('user_get_by_id', userTokenInfo.userId)
//     );
//     delete userInfo.passwordHash;
//     delete userInfo.createdAt;
//     delete userInfo.updatedAt;
//     request.user = userInfo
//     return true;
//   }
// }