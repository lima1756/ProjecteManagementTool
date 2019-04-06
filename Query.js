const util = require('util')
const DBController = require('./DBController');

const greaterThan = '>',
    greaterOrEqualThan = '>=',
    lessThan = '<',
    lessOrEqualThan = '<=',
    iqualThan = '=',
    differentThan = '!=',
    isOperator = 'IS',
    isNotOperator= 'IS NOT',
    nullValue = 'NULL',
    andOperator = 'AND',
    orOperator = 'OR',
    notoperator = 'not',
    selectType = 'SELECT',
    updateType = 'UPDATE',
    insertType = 'INSERT',
    deleteType = 'DELETE';

// TODO: create documentation
// TODO: change pops to fors, I must not change the query created because the user may need it again

//module.exports = 
class Query{

    static get Comparator(){
        return class Comparator{

            greaterThan(columnName, value){
                this.structure = this.comparator(columnName, value, greaterThan);
                return this;
            }

            greaterThanOrEqualTo(columnName, value){
                this.structure = this.comparator(columnName, value, greaterOrEqualThan);
                return this;
            }
        
            lessThan(columnName, value){
                this.structure = this.comparator(columnName, value, lessThan);
                return this;
            }
            
            lessThanOrEqualTo(columnName, value){
                this.structure = this.comparator(columnName, value, lessOrEqualThan);
                return this;
            }
        
            equalTo(columnName, value){
                this.structure = this.comparator(columnName, value, iqualThan);
                return this;
            }

            differentThan(columnName, value){
                this.structure = this.comparator(columnName, value, differentThan);
                return this;
            }

            isNull(columnName){
                this.structure = this.comparator(columnName, nullValue, isOperator);
                return this;
            }

            isNotNull(columnName){
                this.structure = this.comparator(columnName, nullValue, isNotOperator);
                return this;
            }
        
            comparator(column, value, symbol){
                return {
                    column: column,
                    value: value,
                    symbol: symbol
                }
            }

            static and(...args){
                let result;
                Query.argsToArray(args, (arr)=>{
                    result = Comparator.operator(arr, andOperator);
                });
                return result;               
            } 

            static or(...args){
                let result;
                Query.argsToArray(args, (arr)=>{
                    result = Comparator.operator(arr, orOperator);
                });
                return result;
            }

            static not(...args){
                let result;
                Query.argsToArray(args, (arr)=>{
                    result = Comparator.operator(arr, notoperator);
                });
                return result;
            }

            static operator(comparators, operator){
                return {
                    isAggrupation: true,
                    operator:operator,
                    comparators: comparators
                }
            }

            static createConditional(operation){
                let conditionalString = ''
                if(operation.hasOwnProperty('isAggrupation')){
                    if(operation.operator==notoperator){
                        conditionalString += notoperator + ' ';
                    }
                    conditionalString += '( '
                    while(operation.comparators.length>0){
                        let comparator = operation.comparators.pop();
                        
                        conditionalString += Comparator.createConditional(comparator);
                        if(operation.operator!=notoperator && operation.comparators.length!=0){
                            conditionalString += operation.operator + ' ';
                        }
                    }
                    conditionalString += ') '
                }
                else{
                    if(typeof(operation.structure.column)!=typeof('')){
                        throw new Error('This field should be a string representing a column of your table');
                    }
                    else{
                        conditionalString += operation.structure.column + ' ';
                    }
                    conditionalString += operation.structure.symbol + ' ';
                    if(typeof(operation.structure.value)==typeof({})){
                        conditionalString += '( ' + Query.createSelect(operation.structure.value) + ') ';
                    }
                    else{
                        conditionalString += operation.structure.value + ' ';
                    }
                }

                return conditionalString;
            }
        
        }
    }
    
    constructor(table){
        this.structure = {
            table:table
        };
        return this;
    }

    select(...args){
        this.checkQueryTypeError(selectType);
        Query.argsToArray(args, (arr)=>{
            this.structure.select = {
                columns: arr
            }
        });
        return this;
    }

    join(table, onConditional){
        this.structure.join = this.structure.join || []   
        this.structure.join.push({
            table: table,
            onConditional: onConditional
        });
        return this;
    }

    leftJoin(table, onConditional){
        this.structure.leftJoin = this.structure.leftJoin || []   
        this.structure.leftJoin.push({
            table: table,
            onConditional: onConditional
        });
        return this;
    }

    rightJoin(table, onConditional){
        this.structure.rightJoin = this.structure.rightJoin || []   
        this.structure.rightJoin.push({
            table: table,
            onConditional: onConditional
        });
        return this;
    }

    where(comparator){
        this.structure.where = comparator;
        return this;
    }

    groupBy(...args){
        Query.argsToArray(args, (arr)=>{
            this.structure.groupBy = arr;
        });
        return this;
    }

    having(comparator){
        this.structure.having = comparator;
        return this;
    }

    orderBy(desc, ...args){
        this.structure.orderBy = {};
        Query.argsToArray(args, (arr)=>{
            this.structure.orderBy.columns = arr;
        });
        this.structure.orderBy.orderDesc = desc;
        return this;
    }

    /**
     * 
     * @param  {...any} args The arguments of the function should be or an array of key-value pairs (key is the column and the pair the new value)
     * or different arguments of key-value pairs.
     */
    update(...args){
        this.checkQueryTypeError(updateType);
        Query.argsToArray(args, (arr)=>{
            this.structure.updateSet = arr;
        })
        return this;
    }

    insert(...args){
        this.checkQueryTypeError(insertType);
        Query.argsToArray(args, (arr)=>{
            this.structure.insertColumns = arr;
        }, false);
        return this;
    }

    insertValues(...args){
        this.structure.insertValues = this.structure.insertValues || [];
        Query.argsToArray(args, (arr)=>{
            this.structure.insertValues.push(arr);
        })
        return this;
    }

    delete(){
        this.checkQueryTypeError(deleteType);
        return this;
    }


    run(){
        this.queryString = this.structure.type + ' ';
        switch(this.structure.type){
            case selectType:
                this.queryString = Query.createSelect(this);
                break;
            case updateType:
                break;
            case deleteType:
                break;
            case insertType:
                break;
            default:
                throw new Error('There is no CRUD operation selected, please add an operation in your method calls');
        }
        console.log(this.queryString);
        // console.log(util.inspect(this, false, null, true));
    }


    checkQueryTypeError(newType){
        if(!this.structure.type)
            this.structure.type = newType;
        else
            throw new Error(`This query was already type of: ${this.structure.type} and is not compatible with ${newType}`);
    }

    static get argsError(){ 
        return new Error(`This method needs an array of elements or multiple elements as arguments`);
    }   

    static argsToArray(args, callback, throwErrorIfZero=true){
        if(args.length==1 && Array.isArray(args[0])){
            callback(args[0])
        }
        else if(args.length>1 || (args.length==1 && !Array.isArray(args[0]))){
            callback(args)
        }
        else if(args.length==0 && throwErrorIfZero){
            throw Query.argsError;
        }
        else if(args.length==0 && !throwErrorIfZero){
            callback([])
        }
        else{
            throw Query.argsError;
        }
    }

    static createSelect(queryObject){
        let queryString = 'SELECT '
        while(queryObject.structure.select.columns.length>0){
            queryString += queryObject.structure.select.columns.pop()
            if(queryObject.structure.select.columns.length != 0)
                queryString += ', '
            else
                queryString += ' '
        }
        queryString += 'FROM ';
        if(typeof(queryObject.structure.table)==typeof({})){
            queryString += '( ';
            queryString = Query.createSelect(queryObject.structure.table);
            queryString += ') ';
        }
        else{
            queryString += queryObject.structure.table + ' '
        }
        if(queryObject.structure.hasOwnProperty('join')){
            while(queryObject.structure.join.length>0){
                const join = queryObject.structure.join.pop();
                queryString += 'JOIN '+ Query.createJoin(join)
            }
        }
        if(queryObject.structure.hasOwnProperty('leftJoin')){
            while(queryObject.structure.leftJoin.length>0){
                const join = queryObject.structure.leftJoin.pop();
                queryString += 'LEFT JOIN '+ Query.createJoin(join)
            }
        }
        if(queryObject.structure.hasOwnProperty('rightJoin')){
            while(queryObject.structure.rightJoin.length>0){
                const join = queryObject.structure.rightJoin.pop();
                queryString += 'RIGHT JOIN '+ Query.createJoin(join)
            }
        }
        if(queryObject.structure.hasOwnProperty('where')){
            queryString += 'WHERE '+ Query.Comparator.createConditional(queryObject.structure.where);
        }

        if(queryObject.structure.hasOwnProperty('groupBy')){
            queryString += 'GROUP BY ';
            while(queryObject.structure.groupBy.length>0){
                const groupByColumn = queryObject.structure.groupBy.pop();
                queryString += groupByColumn;
                if(queryObject.structure.groupBy.length!=0){
                    queryString += ', '
                }
                else{
                    queryString += ' '
                }
            }
        }

        if(queryObject.structure.hasOwnProperty('having')){
            queryString += 'HAVING '+ Query.Comparator.createConditional(queryObject.structure.having);
        }

        if(queryObject.structure.hasOwnProperty('orderBy')){
            queryString += 'GROUP BY ';
            for(let i = 0; i < queryObject.structure.orderBy.columns.length; i++){
                queryString += queryObject.structure.orderBy.columns[i];
                if(i!=queryObject.structure.orderBy.columns.length-1)
                    queryString += ', ';
                else{
                    queryString += ' ';
                }
            }
        }

        return queryString;
    }

    static createJoin(joinObject){
        let joinString = '';
        if(typeof(joinObject.table)==typeof({})){
            joinString += '( ';
            joinString += Query.createSelect(joinObject.table);
            joinString += ') ';
        }
        else{
            joinString += (joinObject.table + ' ');
        }
        joinString += 'ON ' + Query.Comparator.createConditional(joinObject.onConditional);
        
        return joinString;
    }


}

const andCom = Query.Comparator.and([new Query.Comparator().greaterThanOrEqualTo('a', 1), new Query.Comparator().equalTo('b', 20)]);
const orCom = Query.Comparator.or([andCom, new Query.Comparator().isNotNull('c')]);

const havingCom = new Query.Comparator().equalTo('count(d)',20);

(new Query('table')).select('a','b','c','count(d)')
    .join('table2', new Query.Comparator().equalTo('table.b','table2.f'))
    .leftJoin(new Query('table3').select('f','g','h'), new Query.Comparator().equalTo('table.b','table3.g'))
    .where(orCom)
    .groupBy('a', 'b', 'c')
    .having(havingCom)
    .orderBy(false, 'a', 'b')
    .run();
