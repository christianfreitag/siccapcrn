import { HttpException, HttpStatus } from "@nestjs/common";

export class AnalystNotFoundException extends HttpException{
    constructor(msg?:string,status?:HttpStatus){
        super(msg||"Não foi encontrado nenhum analista que corresponda a esse id.",status||HttpStatus.NOT_FOUND)
    }
}