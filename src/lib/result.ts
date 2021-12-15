export class Result {

    constructor(isSuccess:boolean){
        this.success = isSuccess;
        this.messages = [];
        this.validations = [];
    }

    private success:boolean;
    isValidation:boolean;
    validations:IFieldValidation[];
    private messages:string[];
    data:any;

    addMessage(msg:string){
        if(msg){
            this.messages.push(msg);
        }
    }

    addValidation(field:string, message:string){
        this.success = false;
        this.isValidation = true;
        this.validations.push({message:message, field:field});
    }

    get message(){
        return this.messages.join(' ').slice(0, 70);
    }

    get isSuccess(){
        return this.success;
    }

    get isError(){
        return !this.success;
    }

    static Succeed(){
        let result = new Result(true);
        return result;
    }

    static Ok(data){
        let result = new Result(true);
        result.data = data;
        return result;
    }

    static Error(msg){
        let result = new Result(false);
        result.addMessage(msg);
        return result;
    }
}

export interface IFieldValidation{
    message:string;
    field:string;
}