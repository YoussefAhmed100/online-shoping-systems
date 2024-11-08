import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../enums/role.enum";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate{
   constructor(private reflector:Reflector ){}
   canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true
    };
    // console.log('requiredRoles',requiredRoles)
    
       
      
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      return requiredRoles.some((role) => user.role?.includes(role));
     
    }




}
