module.exports = class ErrorManager{
    static get DataBaseError(){
        return class DataBaseError extends ErrorManager.MainError{
            constructor(message, err = {}){
                super(message, 500, err);
            }
        }
    }

    static get InternalServerError(){
        return class DataBaseError extends ErrorManager.MainError{
            constructor(message, err = {}){
                super(message, 500, err);
            }
        }
    }

    static get BadRequestError(){
        return class BadRequestError extends ErrorManager.MainError{
            constructor(message, err = {}){
                super(message, 400, err);
            }
        }
    }

    static get NotFoundError(){
        return class NotFoundError extends ErrorManager.MainError{
            constructor(message, err = {}){
                super(message, 404, err);
            }
        }
    }

    static get Forbidden(){
        return class Forbidden extends ErrorManager.MainError{
            constructor(message, err = {}){
                super(message, 403, err);
            }
        }
    }

    static get MainError(){
        return class MainError extends Error{
            constructor(message, status, err = {}){
                super(message)
                this.status = status;
                this.error = err;
            }
        }
    }
}