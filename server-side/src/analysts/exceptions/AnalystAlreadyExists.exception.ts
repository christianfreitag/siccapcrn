import { HttpException, HttpStatus } from "@nestjs/common";

export class AnalystAlreadyExistException extends HttpException{
    constructor(msg?:string,status?:HttpStatus){
        super(msg||"Ja existe um analista cadastrado com essas informações.",status||HttpStatus.CONFLICT)
    }
}